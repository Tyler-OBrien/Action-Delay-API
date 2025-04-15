using System.Buffers.Text;
using System.Reflection;
using System.Text;
using Action_Delay_Api_Worker_Cli.Models;
using FluentResults;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Runtime.InteropServices;
using System.Text.Unicode;

namespace Action_Delay_Api_Worker_Cli
{
    internal class Program
    {
       
        public static LocalConfig LocalConfig { get; set; }
        static async Task Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
            LocalConfig = System.Text.Json.JsonSerializer.Deserialize<LocalConfig>(File.ReadAllText("./appsettings.json"), SerializableRequestJsonContext.Default.Options);

            var firstarg = args[0];
            if (firstarg == "dig")
            {
                await Dig(args.Skip(1).ToArray());
            }
            else if (firstarg == "http")
            {
                await Http(args.Skip(1).ToArray());

            }
            else
            {
                Console.WriteLine($"Specify dig or http first");
            }

        }

        private static async Task Dig(string[] args)
        {
            var selectedLocations = args[0];
            var queryName = args[1];
            var queryType = args[2];
            string? queryServer = null;
            if (args.Length > 3)
            {
                queryServer = args[3];
            }

            var newServerQuery = new NATSDNSRequest()
            {
                QueryName = queryName,
                QueryType = queryType,
                TimeoutMs = 15_000,
                DnsServer = queryServer ?? "one.one.one.one",
            };
            Console.WriteLine($"Running Query: {queryType} {queryName}, DnsServer {queryServer ?? "1.1.1.1"}");
            var newNatsQueue = new NATSQueue(LocalConfig);
            List<Location> locations = new List<Location>();
            if (selectedLocations.Equals("All", StringComparison.OrdinalIgnoreCase))
                locations = LocalConfig.Locations.Where(location => location.Disabled == false).ToList();
            else
            {
                var splitSelectedLocations = selectedLocations.Split(",");
                locations = LocalConfig.Locations.Where(location => location.Disabled == false && 
                    splitSelectedLocations.Contains(location.NATSName ?? location.Name, StringComparer.OrdinalIgnoreCase)).ToList();
            }

            var runningTasks = new Dictionary<Location, Task<Result<SerializableDNSResponse>>>();
            foreach (var location in locations)
            {
                runningTasks.Add(location, newNatsQueue.DNS(newServerQuery, location, CancellationToken.None));
            }

            List<Location> failedLocations = new List<Location>();
            var successfulResponses = new Dictionary<Location, SerializableDNSResponse>();
            await Task.Delay(500);
            while (runningTasks.Any())
            {
                var tryGetTask = await Task.WhenAny(runningTasks.Values);
                var completedLocation = runningTasks.First(x => x.Value == tryGetTask).Key;
                try
                {
                    var getTask = await tryGetTask;
                    if (getTask.IsSuccess && getTask.ValueOrDefault != null)
                    {
                        successfulResponses.Add(completedLocation, getTask.ValueOrDefault);
                    }
                    else
                    {
                        failedLocations.Add(completedLocation);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Exception: {0}", ex);
                    failedLocations.Add(completedLocation);
                }
                runningTasks.Remove(completedLocation);
            }

            Console.WriteLine($"Result:");
            foreach (var successfulResponse in successfulResponses)
            {
                Console.WriteLine($"{successfulResponse.Key.DisplayName ?? successfulResponse.Key.Name} {successfulResponse.Value.ResponseCode} Response: {String.Join(", ", successfulResponse.Value.Answers.Select(result => $"{result.RecordClass} -> {result.Value}"))}. NSID: {successfulResponse.Value.NSID}, Response time: {successfulResponse.Value.ResponseTimeMs}ms, Extra Info: {successfulResponse.Value.Info}.");   
            }
            Console.WriteLine($"Failed Locations: {String.Join(", ", failedLocations.Select(location => location.DisplayName ?? location.Name))}");

        }

        private static async Task Http(string[] args)
        {
            var selectedLocations = args[0];
            var url = args[1];
            MethodType? method = null;
            if (args.Length > 2 && MethodType.TryParse<MethodType>(args[2].ToString(), true, out var parsedMethodType))
            {
                method = parsedMethodType;
            }
            NetType? netType = null;
            if (args.Length > 3 && NetType.TryParse<NetType>(args[3].ToString(), true, out var parsedNetType))
            {
                netType = parsedNetType;
            }
            string? showSpecificHeader = null;
            if (args.Length > 4)
            {
                showSpecificHeader = args[4];
            }

            var extraFlags = String.Join(" ", args);

            var dumpAllHeaders = extraFlags.Contains("--headers", StringComparison.OrdinalIgnoreCase);
            var keepAlive = extraFlags.Contains("--keepalive", StringComparison.OrdinalIgnoreCase);

            var shortResponse = extraFlags.Contains("--short", StringComparison.OrdinalIgnoreCase);
            var shortv2Response = extraFlags.Contains("--shortv2", StringComparison.OrdinalIgnoreCase);


            var onlyShowDifferentPopRouting = extraFlags.Contains("--onlyShowDifferentPopRouting", StringComparison.OrdinalIgnoreCase);

            var newServerQuery = new NATSHttpRequest()
            {
                URL = url,
                Method = method ?? MethodType.GET,
                TimeoutMs = 15_000,
                NetType = netType,
                EnableConnectionReuse = keepAlive,
                Headers = new Dictionary<string, string>()
            };

            if (shortResponse || shortv2Response)
            {
                newServerQuery.ReturnBody = false;
                newServerQuery.ReturnBodyOnError = false;
            }

            Console.WriteLine($"Running Request: {url} {method ?? MethodType.GET}, NetType: {netType ?? NetType.Either}");


            if (File.Exists("Headers"))
            {
                var tryGetLines = File.ReadAllLines("Headers", Encoding.UTF8);
                foreach (var headerLine in tryGetLines)
                {
                    var split = headerLine.Split(":");
                    if (split.Length > 1)
                    {
                        var key = split[0].Trim();
                        var value = split[1].Trim();
                        Console.WriteLine($"Header: {key}: {value}");
                        newServerQuery.Headers.Add(key, value);
                    }
                }
            }

            if (File.Exists("Body"))
            {
                var tryGetBody = await File.ReadAllBytesAsync("Body");
                newServerQuery.Base64Body = System.Convert.ToBase64String(tryGetBody);
                Console.WriteLine($"Custom Body");
                if (tryGetBody.Length < 5000)
                {
                    try
                    {
                        var body =  Encoding.UTF8.GetString(tryGetBody);
                        Console.WriteLine($"Body: {body}");
                    }
                    catch (Exception) {} // nom
                }
            }

            var newNatsQueue = new NATSQueue(LocalConfig);
            List<Location> locations = new List<Location>();
            if (selectedLocations.Equals("All", StringComparison.OrdinalIgnoreCase))
                locations = LocalConfig.Locations.Where(location => location.Disabled == false).ToList();
            else
            {
                var splitSelectedLocations = selectedLocations.Split(",");
                locations = LocalConfig.Locations.Where(location => location.Disabled == false &&
                    splitSelectedLocations.Contains(location.NATSName ?? location.Name, StringComparer.OrdinalIgnoreCase)).ToList();
            }

            var runningTasks = new Dictionary<Location, Task<Result<SerializableHttpResponse>>>();
            foreach (var location in locations)
            {
                runningTasks.Add(location, newNatsQueue.HTTP(newServerQuery, location, CancellationToken.None));
            }

            List<Location> failedLocations = new List<Location>();
            var successfulResponses = new Dictionary<Location, SerializableHttpResponse>();
            await Task.Delay(500);
            while (runningTasks.Any())
            {
                var tryGetTask = await Task.WhenAny(runningTasks.Values);
                var completedLocation = runningTasks.First(x => x.Value == tryGetTask).Key;
                try
                {
                    var getTask = await tryGetTask;
                    if (getTask.IsSuccess && getTask.ValueOrDefault != null)
                    {
                        if (getTask.ValueOrDefault.Headers == null)
                            getTask.ValueOrDefault.Headers = new Dictionary<string, string>();
                        successfulResponses.Add(completedLocation, getTask.ValueOrDefault);
                    }
                    else
                    {
                        failedLocations.Add(completedLocation);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Exception: {0}", ex);
                    failedLocations.Add(completedLocation);
                }
                runningTasks.Remove(completedLocation);
            }

            Console.WriteLine($"Result:");
            foreach (var successfulResponse in successfulResponses)
            {
                successfulResponse.Value.Headers = new Dictionary<string, string>(successfulResponse.Value.Headers,
                    StringComparer.OrdinalIgnoreCase);
                string extraLocInfo = "";
                string extraLocInfoShort = "";
                int spacesToAdd = 0;

                if (successfulResponse.Value.Headers.TryGetValue("Server", out var serverHeader))
                {
                    if (serverHeader.Equals("Cloudflare", StringComparison.OrdinalIgnoreCase))
                    {
                        if (successfulResponse.Value.Headers.TryGetValue("cf-ray", out var rayHeader) &&
                            rayHeader.Split("-").Length > 1)
                        {
                            extraLocInfo = $"(CF {rayHeader.Split("-")[1]}";
                            extraLocInfoShort = $"CF {rayHeader.Split("-")[1]}";

                            if (onlyShowDifferentPopRouting)
                            {
                                if (rayHeader.Split("-")[1].Trim().Equals(successfulResponse.Key.DisplayName ??
                                    successfulResponse.Key.Name, StringComparison.OrdinalIgnoreCase))
                                    continue;
                            }

                        }

                        if (successfulResponse.Value.Headers.TryGetValue("colo", out var colo) &&
                            successfulResponse.Value.Headers.TryGetValue("metal", out var metal))
                        {
                            extraLocInfo += $" - {metal}c{colo}m";
                        }
                    }
                    else if (serverHeader.StartsWith("BunnyCDN", StringComparison.OrdinalIgnoreCase))
                    {


                        if (serverHeader.Split("-").Length > 1)
                        {
                            var serverStr = serverHeader.Split("-")[1];

                            if (serverStr.Length == 2)
                                spacesToAdd = 1;

                            extraLocInfo = $"(Bunny {serverStr}";
                            extraLocInfoShort = $"Bunny {serverStr}";
                        }
                    }

                    if (String.IsNullOrEmpty(extraLocInfo) == false)
                        extraLocInfo += ") ";
                    for (int i = 0; i < spacesToAdd; i++)
                    {
                        extraLocInfo += " ";
                    }
                }
                
                if (shortv2Response)
                    Console.Write($"{(String.IsNullOrWhiteSpace(extraLocInfoShort) ? successfulResponse.Key.DisplayName ?? successfulResponse.Key.Name : extraLocInfoShort)} {successfulResponse.Value.StatusCode.ToString("D")}:");
                else if (shortResponse == false)
                    Console.Write($"{successfulResponse.Key.DisplayName ?? successfulResponse.Key.Name}{extraLocInfo} Response: {successfulResponse.Value.StatusCode}/{successfulResponse.Value.StatusCode.ToString("D")}. Response Truncated: \"{IntelligentCloudflareErrorsFriendlyTruncate(successfulResponse.Value.Body, 50)}\" Server: {(successfulResponse.Value.Headers.TryGetValue("cf-ray", out var CfRay) ? CfRay : successfulResponse.Value.Headers.GetValueOrDefault("server", ""))}, Response time: {(successfulResponse.Value.ResponseTimeMs.HasValue ? Math.Round(successfulResponse.Value.ResponseTimeMs.Value, 2) : "")}, Extra Info: {successfulResponse.Value.Info}.");
                else 
                    Console.Write($"{successfulResponse.Key.DisplayName ?? successfulResponse.Key.Name} {extraLocInfo} {(successfulResponse.Value.ResponseTimeMs.HasValue ? Math.Round(successfulResponse.Value.ResponseTimeMs.Value, 2) : "")}ms {successfulResponse.Value.StatusCode.ToString("D")}");
                if (showSpecificHeader != null)
                {
                    if (successfulResponse.Value.Headers.TryGetValue(showSpecificHeader, out var getHeader))
                    {
                        Console.Write($" {showSpecificHeader} -> {getHeader}"); 
                    }
                    else
                    {
                        Console.Write($" {showSpecificHeader} -> NULL");

                    }
                }

                Console.WriteLine();
                if (dumpAllHeaders)
                {
                    foreach (var headersKvp in successfulResponse.Value.Headers)
                    {
                        Console.WriteLine($"{headersKvp.Key} -> {headersKvp.Value}");
                    }
                }
            }
            Console.WriteLine($"Failed Locations: {String.Join(", ", failedLocations.Select(location => location.DisplayName ?? location.Name))}");
        }


        public static Regex HtmlTitleRegex = new Regex(@"<title>(.*?)<\/title>",
            RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.IgnorePatternWhitespace);
        public static string IntelligentCloudflareErrorsFriendlyTruncate(string value, int maxLength)
        {

            if (string.IsNullOrEmpty(value)) return value;

            if (value.TrimStart().StartsWith("<html>", StringComparison.OrdinalIgnoreCase) || value.TrimStart().StartsWith("<!DOCTYPE html>", StringComparison.OrdinalIgnoreCase))
            {
                var tryMatch = HtmlTitleRegex.Match(value);
                if (tryMatch is { Success: true, Groups.Count: > 1 })
                {
                    value = tryMatch.Groups[1].Value;
                }
            }

            return value.Length <= maxLength ? value : value.Substring(0, maxLength);
        }

    }


}
