namespace Action_Delay_API_Core.Broker.Google
{
    public partial class GoogleCloudAPIBroker : IGoogleCloudAPIBroker
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger _logger;
        private readonly IGoogleServiceAccountTokenProvider _tokenProvider;

        public GoogleCloudAPIBroker(HttpClient httpClient, ILogger<GoogleCloudAPIBroker> logger,
            IGoogleServiceAccountTokenProvider tokenProvider)
        {
            _logger = logger;
            _httpClient = httpClient;
            _tokenProvider = tokenProvider;
            _httpClient.BaseAddress = new Uri("https://dns.googleapis.com");
            _httpClient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
            _httpClient.Timeout = TimeSpan.FromSeconds(60);
        }
    }
}
