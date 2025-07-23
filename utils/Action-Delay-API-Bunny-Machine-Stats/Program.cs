using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Net.Security;
using System.Net.Sockets;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.Json.Serialization;

namespace Action_Delay_API_Bunny_Machine_Stats
{

    public partial class IPAddressInfoResult
    {
        [JsonPropertyName("as_name")]
        public string AsName { get; set; }

        [JsonPropertyName("asn")]
        public string asn { get; set; }

        [JsonPropertyName("country")]
        public string Country { get; set; }


        [JsonPropertyName("continent")]
        public string Continent { get; set; }

    }



    public class Result
    {
        public string Region { get; set; }

        public string ServerId { get; set; }

        public string Provider { get; set; }

        public string IPAddress { get; set; }

        public bool IPv6 { get; set; }

        public bool Working { get; set; }

        public string Country { get; set; }

        public string Continent { get; set; }
    }

    public class LocalConfig
    {
        [JsonPropertyName("IPInfoApiKey")]
        public string IPInfoApiKey { get; set; }

        [JsonPropertyName("UpdateProviderNameApiKey")]
        public string UpdateProviderNameApiKey { get; set; }
    }
    internal class Program
    {

        public static List<string> IpLists = new List<string>()
        {
            "https://bunnycdn.com/api/system/edgeserverlist",
            "https://bunnycdn.com/api/system/edgeserverlist/IPv6",
            "https://bunnycdn.com/api/system/cdnserverlist",
            "https://bunnycdn.com/api/system/cdnserverlist/IPv6"
        };
        private static readonly HttpRequestOptionsKey<IPAddress> TargetIpAddressKey = new("TargetIpAddress");
        static async Task Main(string[] args)
        {
            var tryDeserializeConfig =
                System.Text.Json.JsonSerializer.Deserialize<LocalConfig>(File.ReadAllText("Config.json"));


            List<Result> results = new List<Result>();

            Console.WriteLine("Hello, World!");
            var httpClient = new HttpClient();
            HashSet<string> resolvedIps = new HashSet<string>();
            int totalIPs = 0;
            foreach (var ipList in IpLists)
            {
                try
                {
                    var newHttpClient = new HttpRequestMessage(HttpMethod.Get, ipList);
                    newHttpClient.Headers.TryAddWithoutValidation("User-Agent", "Update Edge Server List");
                    newHttpClient.Headers.Add("Accept", "application/json");
                    var resp = await httpClient.SendAsync(newHttpClient);

                    if (resp.IsSuccessStatusCode == false)
                    {
                        Console.WriteLine($"Request for {ipList} failed, status code: {resp.StatusCode}");
                        continue;
                    }

                    var getIps = await resp.Content.ReadFromJsonAsync<string[]>();
                    totalIPs += getIps.Length;
                    foreach (var ip in getIps)
                    {
                        resolvedIps.Add(ip);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error resolving {ipList}, error: {ex}");
                }
            }
            Console.WriteLine($"Resolved {resolvedIps.Count} IPs, {totalIPs} total fetched and then deduplicated");

            var parallelOptions = new ParallelOptions
            {
                MaxDegreeOfParallelism = 20,
            };

            var handler = new SocketsHttpHandler
            {
                SslOptions = new SslClientAuthenticationOptions
                {
                    RemoteCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) =>
                    {
                        if (sslPolicyErrors == SslPolicyErrors.None)
                        {
                            return true;
                        }

                        // Return true to bypass the error and accept the certificate anyway.
                        return true;
                    }
                },
                ConnectCallback = async (context, cancellationToken) =>
                {
                    if (!context.InitialRequestMessage.Options.TryGetValue(TargetIpAddressKey, out var targetIp))
                    {
                        var fallbackSocket = new Socket(SocketType.Stream, ProtocolType.Tcp) { NoDelay = true };
                        await fallbackSocket.ConnectAsync(context.DnsEndPoint.Host, context.DnsEndPoint.Port, cancellationToken);
                        return new NetworkStream(fallbackSocket, ownsSocket: true);
                    }

                    var socket = new Socket(SocketType.Stream, ProtocolType.Tcp) { NoDelay = true };
                    try
                    {
                        await socket.ConnectAsync(targetIp, context.DnsEndPoint.Port, cancellationToken);
                        return new NetworkStream(socket, ownsSocket: true);
                    }
                    catch
                    {
                        socket.Dispose();
                        throw;
                    }
                }
            };

            using var requestHttpClient = new HttpClient(handler);
            requestHttpClient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
            requestHttpClient.Timeout = TimeSpan.FromSeconds(10);

            await Parallel.ForEachAsync(resolvedIps, parallelOptions, async (ipString, cancellationToken) =>
            {
                if (!IPAddress.TryParse(ipString, out var ipAddress)) return;

                using var request = new HttpRequestMessage(HttpMethod.Get, "https://whereami.bunny.chaika.me/cache");
                request.Options.Set(TargetIpAddressKey, ipAddress);
                request.Headers.ConnectionClose = true;
                try
                {
                    using var response = await requestHttpClient.SendAsync(request, HttpCompletionOption.ResponseContentRead, cancellationToken);
                    var output = new StringBuilder();
                    bool isBunnyServerHeader = false;
                    output.AppendLine($"HTTP/{response.Version} {(int)response.StatusCode} {response.ReasonPhrase}");
                    var serverHeader = response.Headers.FirstOrDefault(hdr => hdr.Key.Equals("Server", StringComparison.OrdinalIgnoreCase));
                    if (serverHeader.Key != null)
                    { 
                        output.AppendLine($"{serverHeader.Key}: {string.Join(", ", serverHeader.Value)}");
                        isBunnyServerHeader = serverHeader.Value.Any(val =>
                            val.Contains("Bunny", StringComparison.OrdinalIgnoreCase));
                    }

                    var tryGetColoHeader = response.Headers.FirstOrDefault(hdr => hdr.Key.Equals("colo", StringComparison.OrdinalIgnoreCase));
                    var tryGetMetalHeader = response.Headers.FirstOrDefault(hdr => hdr.Key.Equals("metal", StringComparison.OrdinalIgnoreCase));

                    string resolvedRegion = string.Empty;
                    string resolvedServer = String.Empty;

                    if ((tryGetColoHeader.Value?.Any() ?? false) && (tryGetMetalHeader.Value?.Any() ?? false))
                    {
                        resolvedRegion = tryGetColoHeader.Value.FirstOrDefault();
                        resolvedServer = tryGetMetalHeader.Value.FirstOrDefault();
                    }

                    if (serverHeader.Key != null)
                    {
                        var split = serverHeader.Value.FirstOrDefault().Split("-");

                        if (String.IsNullOrWhiteSpace(resolvedRegion) && String.IsNullOrWhiteSpace(split.ElementAtOrDefault(1)) == false)
                            resolvedRegion = split[1];

                        if (String.IsNullOrWhiteSpace(resolvedServer)  && String.IsNullOrWhiteSpace(split.ElementAtOrDefault(2)) == false)
                            resolvedServer = split[2];
                    }

                    string resolvedProviderName = "Unknown";
                    string resolvedContinent = "Unknown";
                    string resolvedCountry = "Unknown";
                    try
                    {
                        var tryGetIpInfo =
                            await httpClient.GetFromJsonAsync<IPAddressInfoResult>(
                                $"https://api.ipinfo.io/lite/{ipString}?token={tryDeserializeConfig.IPInfoApiKey}");
                        if (tryGetIpInfo != null)
                        {
                            if (String.IsNullOrWhiteSpace(tryGetIpInfo.AsName) == false)
                                resolvedProviderName = tryGetIpInfo.AsName + $" ({tryGetIpInfo.asn})";
                            else if (String.IsNullOrWhiteSpace(tryGetIpInfo.asn) == false)
                                resolvedRegion = tryGetIpInfo.asn;

                            resolvedContinent = tryGetIpInfo.Continent;
                            resolvedCountry = tryGetIpInfo.Country;
                            output.AppendLine($" Provider: {resolvedProviderName}");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error resolving provider for  {ipAddress}: {ex.Message}");
                    }

                    Console.WriteLine($"--- Response for IP {ipAddress} ---\n{output}\n---------------------------\n");
                    results.Add(new Result()
                    {
                        IPAddress = ipString,
                        IPv6 = ipAddress.AddressFamily == AddressFamily.InterNetworkV6,
                        Provider = resolvedProviderName,
                        Region = resolvedRegion,
                        ServerId = resolvedServer,
                        Working = response.IsSuccessStatusCode && isBunnyServerHeader,
                        Continent = resolvedContinent,
                        Country = resolvedCountry,
                    });
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed for IP {ipAddress}: {ex.Message}");
                }
            });
            Console.WriteLine($"Bunny Servers By Provider:");
            foreach (var providerGrp in results.Where(result => result.Working && result.IPv6 == false).GroupBy(result => result.Provider).OrderByDescending(result => result.Count()))
            {
                Console.WriteLine($"Provider: {providerGrp.Key} - Servers: {providerGrp.Count()} - Continents: {String.Join(" | ", providerGrp.GroupBy(result => result.Continent).OrderByDescending(result => result.Count()).Select(grp => $"{grp.Key} ({grp.Count()})"))} - Regions: {String.Join(" | ", providerGrp.GroupBy(result => result.Region).OrderByDescending(result => result.Count()).Select(grp => $"{grp.Key} ({grp.Count()})"))}");
            }

            Dictionary<string, string> regionsMappedToProviders = new Dictionary<string, string>();
            foreach (var groupingsByRegion in results.Where(result => result.Working && result.IPv6 == false).GroupBy(result => result.Region))
            {
                regionsMappedToProviders[groupingsByRegion.Key] = String.Join(", ", groupingsByRegion.GroupBy(result => result.Provider)
                    .OrderByDescending(result => result.Count()).Select(result => result.Key));

               
            }

            var pushEventMsg = new HttpRequestMessage(HttpMethod.Post,
                "https://bunny-vector-log-ingest.workers.chaika.me/update-provider-names");
            pushEventMsg.Headers.TryAddWithoutValidation("apiKey", tryDeserializeConfig.UpdateProviderNameApiKey);
            pushEventMsg.Content =
                new StringContent(System.Text.Json.JsonSerializer.Serialize(
                    regionsMappedToProviders.Select(kvp => new { provider = kvp.Value, region = kvp.Key })), MediaTypeHeaderValue.Parse("application/json"));
            var tryIngestResult = await httpClient.SendAsync(pushEventMsg);
            if (tryIngestResult.IsSuccessStatusCode == false)
                Console.WriteLine($"Error Sending results to API, got back HTTP/{tryIngestResult.Version} {(int)tryIngestResult.StatusCode} {tryIngestResult.ReasonPhrase}");
            else
                Console.WriteLine($"Send Results to API, ran without error, HTTP/{tryIngestResult.Version} {(int)tryIngestResult.StatusCode} {tryIngestResult.ReasonPhrase} ");
            
        }

    }
}
