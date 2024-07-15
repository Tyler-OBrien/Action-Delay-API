using System.Diagnostics;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using Action_Delay_API_Worker.Extensions;
using Action_Delay_API_Worker.Models;
using Action_Delay_API_Worker.Models.API.Request;
using Action_Delay_API_Worker.Models.API.Response;
using Action_Delay_API_Worker.Models.Services;
using DnsClient;
using Polly;

namespace Action_Delay_API_Worker.Services
{
    public class PingService : IPingService
    {

        private readonly ILogger _logger;

        public PingService(ILogger<PingService> logger)
        {
            _logger = logger;
        }



        private static readonly IAsyncPolicy ResolveHostnameRetryPolicy =
            Policy.Handle<DnsResponseException>()
                .Or<TimeoutException>()
                .Or<System.Net.Sockets.SocketException>()
                .Or<OperationCanceledException>()
                .WaitAndRetryAsync(6, retryAttempt => TimeSpan.FromMilliseconds(Math.Max(50, retryAttempt * 50)));

        public async Task<SerializablePingResponse> PerformRequestAsync(SerializablePingRequest request)
        {

            var cancellationTokenSource = new CancellationTokenSource(request.TimeoutMs ?? 5_000);
            var token = cancellationTokenSource.Token;
            IPAddress address = null;
            if (IPAddress.TryParse(request.Hostname, out var parsedIPAddress))
            {
                address = parsedIPAddress;
            }
            else
            {
                IPAddress[] hostnameAddresses = null;
                try
                {
                    hostnameAddresses =
                        await ResolveHostnameRetryPolicy.ExecuteAsync(async () =>
                        {
                            var getAddresses = await Program.NetTypeSpecificLookup(request.Hostname,
                                request.NetType ?? NetType.Either, token, nameserverOverride: request.CustomDNSServerOverride);
                            return getAddresses.AddressList;
                        });
                }
                catch (Exception ex) when (ex is SocketException or ArgumentOutOfRangeException or ArgumentException)
                {
                    _logger.LogWarning(ex,
                        "Received Ping Request for {queryName}, NetType {netType} via  {dnsServer}, we had an error when trying to resolve the nameservers.",
                        request.Hostname, request.NetType, request.CustomDNSServerOverride);
                    return new SerializablePingResponse()
                    {

                        ProxyFailure = true,
                        Info = $"Internal Error when trying to resolve Hostname into IP: {ex.Message}"
                    };
                }
                catch (Exception ex) when (ex is OperationCanceledException or TaskCanceledException)
                {
                    _logger.LogWarning(ex,
                        "Received Ping Request for {queryName}, NetType {netType} via  {dnsServer}, we had a timeout when trying to resolve the hostname.",
                        request.Hostname, request.NetType, request.CustomDNSServerOverride);
                    return new SerializablePingResponse()
                    {

                        ProxyFailure = true,

                        Info = $"Timeout on resolving Hostname :("
                    };
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex,
                        "Received Ping Request for {queryName}, NetType {netType} via  {dnsServer}, we had an error when trying to resolve the hostname.",
                        request.Hostname, request.NetType, request.CustomDNSServerOverride);
                    return new SerializablePingResponse()
                    {
                        ProxyFailure = true,
                        Info = $"Unhandled Internal Error when trying to resolve Hostname into IP :("
                    };
                }

                if (hostnameAddresses.Length == 0)
                {
                    _logger.LogInformation(
                        "Received Ping Request: Unable to resolve hostname: {hostname}, trying to query with override {dnsOverride} for netType {netType}",
                        request.Hostname, request.CustomDNSServerOverride, request.NetType.ToString() ?? "Either");
                    return new SerializablePingResponse()
                    {

                        ProxyFailure = true,
                        Info =
                            $"Unable to resolve hostname {request.Hostname}, trying to net type {request.NetType.ToString() ?? "Either"} w/ override {request.CustomDNSServerOverride}"
                    };
                }

                address = hostnameAddresses.First();
            }

            using Ping ping = new Ping();
            string exceptionInfo = null;
            List<double> results = new List<double>(request.PingCount ?? 1);
                for (int i = 0; i < (request.PingCount ?? 1); i++)
                {
                    try
                    {
                        if (cancellationTokenSource.Token.IsCancellationRequested)
                        {
                            if (exceptionInfo == null)
                                exceptionInfo = "Timeout";
                            break;
                        }

                        Stopwatch stopwatch = Stopwatch.StartNew();
                        var pingResponse = await ping.SendPingAsync(address, request.TimeoutMs ?? 4000);
                        stopwatch.Stop();
                        if (pingResponse.Status == IPStatus.Success)
                        {
                            if (pingResponse.RoundtripTime == 0 || stopwatch.Elapsed.TotalMilliseconds < pingResponse.RoundtripTime + 5)
                            results.Add(stopwatch.Elapsed.TotalMilliseconds);
                            else 
                            results.Add(pingResponse.RoundtripTime);
                        }
                        else
                        {
                            exceptionInfo = pingResponse.Status.ToString();
                        }
                    }
                    catch (PingException pingException)
                    {
                        exceptionInfo = pingException.Message.Truncate(50);
                    }
                }

                if (results.Any())
                {
                    var averageMs = results.Average();
                    _logger.LogInformation(
                        "Received Ping Request for {hostname}, pings: {pings}, customns: {customnameserver}, timeout: {timeout}, netType: {netType}, resolved into {address}, average response time: {averageMs}ms and error info: {exceptionInfo}",
                        request.Hostname, request.PingCount ?? 1, request.CustomDNSServerOverride, request.TimeoutMs, request.NetType, address.ToString(), averageMs, exceptionInfo
                        );
                return new SerializablePingResponse()
                    {
                        Info = exceptionInfo != null ? exceptionInfo : null,
                        WasSuccess = true,
                        ResponseTimeMsAvg = Math.Round(averageMs, 4)
                };
                }
                else
                {
                    _logger.LogInformation(
                        "Received Ping Request for {hostname} failed, pings: {pings}, customns: {customnameserver}, timeout: {timeout}, netType: {netType}, resolved into {address}, error info: {exceptionInfo}",
                        request.Hostname, request.PingCount ?? 1, request.CustomDNSServerOverride, request.TimeoutMs, request.NetType, address.ToString(), exceptionInfo
                    );
                return new SerializablePingResponse()
                    {
                        Info = exceptionInfo,
                        WasSuccess = false,
                    };
            }
            
        }
    }
}
