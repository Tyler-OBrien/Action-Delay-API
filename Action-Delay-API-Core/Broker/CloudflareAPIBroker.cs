namespace Action_Delay_API_Core.Broker;
public partial class CloudflareAPIBroker : ICloudflareAPIBroker
    {
        public const long CLOUDFLARE_API_SIZE_LIMIT = 104857600;

        public const string BasePath = "/client/v4";

        private readonly HttpClient _httpClient;
        private readonly ILogger _logger;

        public CloudflareAPIBroker(HttpClient httpClient, ILogger<CloudflareAPIBroker> logger)
        {
            _logger = logger;
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://api.cloudflare.com");
            _httpClient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
        }
    }
