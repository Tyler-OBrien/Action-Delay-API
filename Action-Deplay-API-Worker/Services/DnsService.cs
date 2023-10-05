using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
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

        public async Task<SerializableDNSResponse> PerformDnsLookupAsync(string queryName, string queryType, string dnsServer)
        {
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
                        Answers = new List<SerializableDnsAnswer>()
                    };
                }

                var dnsServerAddresses =
                    await nameServerqueryRetryPolicy.ExecuteAsync(() => Dns.GetHostAddressesAsync(dnsServer));
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
                        Answers = new List<SerializableDnsAnswer>()
                    };
                }

                var lookupClientOptions = new LookupClientOptions(dnsServerAddresses);
                var lookupClient = new LookupClient(lookupClientOptions);

                var response =
                    await dnsRetryPolicy.ExecuteAsync(() => lookupClient.QueryAsync(queryName, parsedQueryType));

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
                    "Received Query Request for {queryName}, type {queryType} via  {dnsServer}, we got back {ResponseCode}, and {Count} answers",
                    queryName, queryType, dnsServer, response.Header.ResponseCode, response.Answers.Count);
                return dnsResponse;
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
                    Answers = new List<SerializableDnsAnswer>()
                };
            }
        }
    }
}
