using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using Action_Deplay_API_Worker.Models;
using Action_Deplay_API_Worker.Models.API.Request;
using Action_Deplay_API_Worker.Models.API.Response;
using Action_Deplay_API_Worker.Models.Services;
using DnsClient;
using DnsClient.Protocol;
using Polly;

namespace Action_Deplay_API_Worker.Services
{
    public class DnsService : IDnsService
    {
        private readonly ILogger _logger;

        public DnsService(ILogger<DnsService> logger)
        {
            _logger = logger;
        }


        private static readonly IAsyncPolicy nameServerqueryRetryPolicy =
            Policy.Handle<TimeoutException>()
                .Or<System.Net.Sockets.SocketException>()
                .Or<OperationCanceledException>()
                .WaitAndRetryAsync(6, retryAttempt => TimeSpan.FromMilliseconds(Math.Max(50, retryAttempt * 50)));

        private static readonly IAsyncPolicy<IDnsQueryResponse> dnsRetryPolicy =
            Policy.Handle<DnsResponseException>()
                .Or<TimeoutException>()
                .Or<System.Net.Sockets.SocketException>()
                .Or<OperationCanceledException>()
                .OrResult<IDnsQueryResponse>(r => r.HasError)
                .WaitAndRetryAsync(6, retryAttempt => TimeSpan.FromMilliseconds(Math.Max(50, retryAttempt * 50)));

        public async Task<SerializableDNSResponse> PerformDnsLookupAsync(SerializableDNSRequest request)
        {
            var cancellationTokenSource = new CancellationTokenSource(request.TimeoutMs ?? 5_000);
            var token = cancellationTokenSource.Token;
            var queryType = request.QueryType;
            var queryName = request.QueryName;
            var dnsServer = request.DnsServer;
            try
            {
                if (!Enum.TryParse(queryType, true, out QueryType parsedQueryType))
                {
                    _logger.LogInformation(
                        "Invalid QueryType: {queryType}, trying to query {queryName} via {dnsServer}", queryType,
                        queryName, dnsServer);
                    return new SerializableDNSResponse()
                    {
                        QueryName = queryName,
                        QueryType = queryType,
                        ResponseCode = DnsHeaderResponseCode.Refused.ToString(),
                        Answers = new List<SerializableDnsAnswer>(),
                        Info = $"Invalid QueryType: {queryType}, trying to query {queryName} via {dnsServer}"
                    };
                }

                IPAddress[] dnsServerAddresses = null;
                try
                {
                    dnsServerAddresses =
                        await nameServerqueryRetryPolicy.ExecuteAsync(() =>
                        {
                            AddressFamily addressFamily = AddressFamily.Unspecified;
                            if (request.NetType == NetType.IPv4)
                                addressFamily = AddressFamily.InterNetwork;
                            else if (request.NetType == NetType.IPv6)
                                addressFamily = AddressFamily.InterNetworkV6;
                            return Dns.GetHostAddressesAsync(dnsServer, addressFamily, token);
                        });
                }
                catch (Exception ex) when (ex is SocketException or ArgumentOutOfRangeException or ArgumentException)
                {
                    _logger.LogWarning(ex,
                        "Received Query Request for {queryName}, type {queryType} via  {dnsServer}, we had an error when trying to resolve the nameservers.",
                        queryName, queryType, dnsServer);
                    return new SerializableDNSResponse()
                    {
                        QueryName = queryName,
                        QueryType = queryType,
                        ResponseCode = DnsHeaderResponseCode.ServerFailure.ToString(),
                        Answers = new List<SerializableDnsAnswer>(),
                        Info = $"Internal Error when trying to resolve DnsServer into IP: {ex.Message}"
                    };
                }
                catch (Exception ex) when (ex is OperationCanceledException or TaskCanceledException)
                {
                    _logger.LogWarning(ex,
                        "Received Query Request for {queryName}, type {queryType} via  {dnsServer}, but it timed out on resolving dnsServer",
                        queryName, queryType, dnsServer);
                    return new SerializableDNSResponse()
                    {
                        QueryName = queryName,
                        QueryType = queryType,
                        ResponseCode = DnsHeaderResponseCode.ServerFailure.ToString(),
                        Answers = new List<SerializableDnsAnswer>(),
                        Info = $"Timeout on resolving DnsServer :("
                    };
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex,
                        "Received Query Request for {queryName}, type {queryType} via  {dnsServer}, we had an error when trying to resolve the nameservers.",
                        queryName, queryType, dnsServer);
                    return new SerializableDNSResponse()
                    {
                        QueryName = queryName,
                        QueryType = queryType,
                        ResponseCode = DnsHeaderResponseCode.ServerFailure.ToString(),
                        Answers = new List<SerializableDnsAnswer>(),
                        Info = $"Unhandled Internal Error when trying to resolve DnsServer into IP :("
                    };
                }

                if (dnsServerAddresses.Length == 0)
                {
                    _logger.LogInformation(
                        "Unable to resolve DNS server: {dnsServer}, trying to query {queryType} of {queryName}",
                        dnsServer, queryType, queryName);
                    return new SerializableDNSResponse()
                    {
                        QueryName = queryName,
                        QueryType = queryType,
                        ResponseCode = DnsHeaderResponseCode.ServerFailure.ToString(),
                        Answers = new List<SerializableDnsAnswer>(),
                        Info = $"Unable to resolve DNS server: {dnsServer}, trying to query {queryType} of {queryName}"
                    };
                }

                var lookupClientOptions = new LookupClientOptions(dnsServerAddresses);
                lookupClientOptions.UseCache = false;
                var lookupClient = new LookupClient(lookupClientOptions);

                var response =
                    await dnsRetryPolicy.ExecuteAsync(() =>
                        lookupClient.QueryAsync(queryName, parsedQueryType, cancellationToken: token));

                var dnsResponse = new SerializableDNSResponse()
                {
                    QueryName = queryName,
                    QueryType = queryType,
                    ResponseCode = response.Header.ResponseCode.ToString(),
                    Answers = new List<SerializableDnsAnswer>()
                };

                foreach (var answer in response.Answers)
                {
                    var dnsAnswer = new SerializableDnsAnswer()
                    {
                        DomainName = answer.DomainName.ToString(),
                        TTL = answer.InitialTimeToLive,
                        RecordType = answer.RecordType.ToString(),
                        RecordClass = answer.RecordClass.ToString()
                    };

                    switch (answer)
                    {
                        case ARecord a:
                            dnsAnswer.Value = a.Address.ToString();
                            break;
                        case AaaaRecord aaaa:
                            dnsAnswer.Value = aaaa.Address.ToString();
                            break;
                        case CNameRecord cname:
                            dnsAnswer.Value = cname.CanonicalName.ToString();
                            break;
                        case TxtRecord txt:
                            dnsAnswer.Value = string.Join("; ", txt.Text);
                            break;
                        case CaaRecord txt:
                            dnsAnswer.Value = txt.Value;
                            break;
                        case SrvRecord srv:
                            dnsAnswer.Value = srv.Target;
                            break;
                        case NsRecord ns:
                            dnsAnswer.Value = ns.NSDName.ToString();
                            break;
                        case UriRecord uri:
                            dnsAnswer.Value = uri.Target;
                            break;
                        case PtrRecord ptr:
                            dnsAnswer.Value = ptr.PtrDomainName.ToString();
                            break;
                        case MxRecord mx:
                            dnsAnswer.Value = mx.Exchange;
                            break;
                        default:
                            dnsAnswer.Value = "Unknown record type";
                            break;
                    }

                    dnsResponse.Answers.Add(dnsAnswer);
                }

                _logger.LogInformation(
                    "Received Query Request for {queryName}, type {queryType} via  {dnsServer}, we got back {ResponseCode}, and {Count} answers, first Answer: {firstAnswer}, error message: {error}",
                    queryName, queryType, dnsServer, response.Header.ResponseCode, response.Answers.Count, response.Answers.Any() ? response.Answers.FirstOrDefault() : "", response.ErrorMessage);
                return dnsResponse;
            }
            catch (DnsClient.DnsResponseException dnsResponseException)
            {
                _logger.LogWarning(dnsResponseException,
                    "Received Query Request for {queryName}, type {queryType} via  {dnsServer}, but we had a dnsError {dnsError}, {dnsMessage}",
                    queryName, queryType, dnsServer, dnsResponseException.Code, dnsResponseException.Message);
                return new SerializableDNSResponse()
                {
                    QueryName = queryName,
                    QueryType = queryType,
                    ResponseCode = dnsResponseException.Code.ToString(),
                    Answers = new List<SerializableDnsAnswer>(),
                    Info = $"Dns Error, Code: {dnsResponseException.Code}, Message: {dnsResponseException.Message}"
                };
            }
            catch (Exception ex) when (ex is OperationCanceledException or TaskCanceledException)
            {
                _logger.LogWarning(ex,
                    "Received Query Request for {queryName}, type {queryType} via  {dnsServer}, but it timed out",
                    queryName, queryType, dnsServer);
                return new SerializableDNSResponse()
                {
                    QueryName = queryName,
                    QueryType = queryType,
                    ResponseCode = DnsHeaderResponseCode.ServerFailure.ToString(),
                    Answers = new List<SerializableDnsAnswer>(),
                    Info = $"Timeout :("
                };
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex,
                    "Received Query Request for {queryName}, type {queryType} via  {dnsServer}, we had an error.",
                    queryName, queryType, dnsServer);
                return new SerializableDNSResponse()
                {
                    QueryName = queryName,
                    QueryType = queryType,
                    ResponseCode = DnsHeaderResponseCode.ServerFailure.ToString(),
                    Answers = new List<SerializableDnsAnswer>(),
                    Info = $"Unhandled Internal Error :("
                };
            }
        }
    }
}
