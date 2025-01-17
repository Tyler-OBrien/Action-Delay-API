using System.Collections;
using System.Diagnostics;
using System.Net.NetworkInformation;
using System.Runtime.InteropServices;
using System.Text;
using Microsoft.AspNetCore.Mvc;

namespace ASPNETCoreSimpleWebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HelloWorldController : ControllerBase
    {



        private readonly ILogger<HelloWorldController> _logger;

        public HelloWorldController(ILogger<HelloWorldController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "")]
        public string Get()
        {
            return $"Hello!";
        }

        [HttpGet("/getMemInfo")]
        public string getMemInfo()
        {
            if (String.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("APIKEY")) || Request.Headers.TryGetValue("APIKEY", out var foundApiKey) == false || foundApiKey.First()
                    .Equals(Environment.GetEnvironmentVariable("APIKEY"), StringComparison.OrdinalIgnoreCase) == false)
            {
                Response.StatusCode = 404;
                return string.Empty;
            }
            var process = Process.GetCurrentProcess();
            var sb = new StringBuilder();

            // Process Memory Info
            sb.AppendLine("=== PROCESS MEMORY ===");
            sb.AppendLine($"Working Set: {process.WorkingSet64 / 1024 / 1024} MB");
            sb.AppendLine($"Private Memory: {process.PrivateMemorySize64 / 1024 / 1024} MB");
            sb.AppendLine($"Virtual Memory: {process.VirtualMemorySize64 / 1024 / 1024} MB");
            sb.AppendLine($"Non-paged System Memory: {process.NonpagedSystemMemorySize64 / 1024 / 1024} MB");
            sb.AppendLine($"Paged Memory: {process.PagedMemorySize64 / 1024 / 1024} MB");
            sb.AppendLine($"Peak Working Set: {process.PeakWorkingSet64 / 1024 / 1024} MB");

            // System Memory
            sb.AppendLine("\n=== SYSTEM MEMORY ===");
            var memInfo = GC.GetGCMemoryInfo(GCKind.Any);
            sb.AppendLine($"Total Physical Memory: {memInfo.TotalAvailableMemoryBytes / 1024 / 1024} MB");
            sb.AppendLine($"Memory Load: {memInfo.MemoryLoadBytes / 1024 / 1024} MB");
            sb.AppendLine($"Heap Size: {memInfo.HeapSizeBytes / 1024 / 1024} MB");
            sb.AppendLine($"Fragment Size: {memInfo.FragmentedBytes / 1024 / 1024} MB");
            sb.AppendLine($"High Memory Load Threshold: {memInfo.HighMemoryLoadThresholdBytes / 1024 / 1024} MB");
            sb.AppendLine($"Total Committed Bytes: {memInfo.TotalCommittedBytes / 1024 / 1024} MB");
            sb.AppendLine($"Promotion Generation: {memInfo.Generation}");

            // CPU Info
            sb.AppendLine("\n=== CPU INFO ===");
            sb.AppendLine($"Processor Count: {Environment.ProcessorCount}");
            if (OperatingSystem.IsLinux())
            {
                try
                {
                    if (System.IO.File.Exists("/proc/cpuinfo"))
                    {
                        // Try to get CPU model from /proc/cpuinfo
                        var cpuInfo = System.IO.File.ReadAllLines("/proc/cpuinfo");
                        var modelName = cpuInfo.FirstOrDefault(line => line.StartsWith("model name"));
                        var vendor = cpuInfo.FirstOrDefault(line => line.StartsWith("vendor_id"));
                        var cacheSize = cpuInfo.FirstOrDefault(line => line.StartsWith("cache size"));
                        var cpuMhz = cpuInfo.FirstOrDefault(line => line.StartsWith("cpu MHz"));
                        var flags = cpuInfo.FirstOrDefault(line => line.StartsWith("flags"));

                        if (modelName != null) sb.AppendLine(modelName);
                        if (vendor != null) sb.AppendLine(vendor);
                        if (cacheSize != null) sb.AppendLine(cacheSize);
                        if (cpuMhz != null) sb.AppendLine(cpuMhz);
                        if (flags != null) sb.AppendLine(flags);

                        try
                        {
                            for (int i = 0; i < Environment.ProcessorCount; i++)
                            {
                                var freqPath = $"/sys/devices/system/cpu/cpu{i}/cpufreq/scaling_cur_freq";
                                if (System.IO.File.Exists(freqPath))
                                {
                                    var freq = System.IO.File.ReadAllText(freqPath).Trim();
                                    var freqMhz = double.Parse(freq) / 1000;
                                    sb.AppendLine($"CPU {i} Frequency: {freqMhz} MHz");
                                }
                            }
                            // Try to get CPU max frequency
                            if (System.IO.File.Exists("/sys/devices/system/cpu/cpu0/cpufreq/cpuinfo_max_freq"))
                            {
                                var maxFreq = System.IO.File.ReadAllText("/sys/devices/system/cpu/cpu0/cpufreq/cpuinfo_max_freq").Trim();
                                var maxFreqMhz = double.Parse(maxFreq) / 1000;
                                sb.AppendLine($"Max CPU Frequency: {maxFreqMhz} MHz");
                            }

                            // Try to get CPU min frequency
                            if (System.IO.File.Exists("/sys/devices/system/cpu/cpu0/cpufreq/cpuinfo_min_freq"))
                            {
                                var minFreq = System.IO.File.ReadAllText("/sys/devices/system/cpu/cpu0/cpufreq/cpuinfo_min_freq").Trim();
                                var minFreqMhz = double.Parse(minFreq) / 1000;
                                sb.AppendLine($"Min CPU Frequency: {minFreqMhz} MHz");
                            }
                        }
                        catch
                        {
                            sb.AppendLine("CPU detailed info not available");
                        }
                    }
                }
                catch
                {
                    sb.AppendLine("CPU detailed info not available");
                }
            }

            // OS Info
            sb.AppendLine("\n=== OS INFO ===");
            sb.AppendLine($"OS: {(OperatingSystem.IsWindows() ? "Windows" : OperatingSystem.IsLinux() ? "Linux" : "macOS")}");
            sb.AppendLine($"Version: {Environment.OSVersion}");
            sb.AppendLine($"Process Architecture: {RuntimeInformation.ProcessArchitecture}");
            sb.AppendLine($"OS Architecture: {RuntimeInformation.OSArchitecture}");

            // Runtime Info
            sb.AppendLine("\n=== RUNTIME INFO ===");
            sb.AppendLine($"Framework: {RuntimeInformation.FrameworkDescription}");
            sb.AppendLine($"Runtime Identifier: {RuntimeInformation.RuntimeIdentifier}");
            sb.AppendLine($"Machine Name: {Environment.MachineName}");
            sb.AppendLine($"User Name: {Environment.UserName}");
            sb.AppendLine($"User Domain Name: {Environment.UserDomainName}");


            // Network Interfaces
            sb.AppendLine("\n=== NETWORK INTERFACES ===");
            foreach (var nic in NetworkInterface.GetAllNetworkInterfaces())
            {
                sb.AppendLine($"\nInterface: {nic.Name}");
                sb.AppendLine($"Description: {nic.Description}");
                sb.AppendLine($"Type: {nic.NetworkInterfaceType}");
                sb.AppendLine($"Status: {nic.OperationalStatus}");
                sb.AppendLine($"Speed: {nic.Speed / 1_000_000} Mbps");
                sb.AppendLine($"MAC: {nic.GetPhysicalAddress()}");

                var ipProps = nic.GetIPProperties();
                sb.AppendLine("IP Addresses:");
                foreach (var ip in ipProps.UnicastAddresses)
                {
                    sb.AppendLine($"  {ip.Address} ({ip.IPv4Mask})");
                }
            }

            // Container Detection and cgroup info for Linux containers
            sb.AppendLine("\n=== CONTAINER INFO ===");
            sb.AppendLine($"Is Container: {Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true"}");
            if (OperatingSystem.IsLinux())
            {
                try
                {
                    // Try to read container memory limits
                    if (System.IO.File.Exists("/sys/fs/cgroup/memory.max"))
                    {
                        var memoryLimit = System.IO.File.ReadAllText("/sys/fs/cgroup/memory.max").Trim();
                        sb.AppendLine($"Memory Limit: {memoryLimit}");
                    }

                    // Try to read CPU quota
                    if (System.IO.File.Exists("/sys/fs/cgroup/cpu.max"))
                    {
                        var cpuQuota = System.IO.File.ReadAllText("/sys/fs/cgroup/cpu.max").Trim();
                        sb.AppendLine($"CPU Quota: {cpuQuota}");
                    }
                }
                catch
                {
                    sb.AppendLine("Container cgroup info not available");
                }
            }

            // Process info
            sb.AppendLine("\n=== PROCESS INFO ===");
            sb.AppendLine($"Process ID: {Environment.ProcessId}");
            sb.AppendLine($"User Interactive: {Environment.UserInteractive}");
            sb.AppendLine($"Current Directory: {Environment.CurrentDirectory}");
            sb.AppendLine($"CmdLine: {Environment.CommandLine}");
            sb.AppendLine($"Process Path: {Environment.ProcessPath}");
            sb.AppendLine($"System PageSize: {Environment.SystemPageSize / 1024} KB");

            // Environment Variables
            sb.AppendLine("\n=== ENVIRONMENT VARS ===");
            foreach (DictionaryEntry env in Environment.GetEnvironmentVariables())
            {
                sb.AppendLine($"{env.Key}={env.Value}");
            }

            return sb.ToString();
        }

    }
}
