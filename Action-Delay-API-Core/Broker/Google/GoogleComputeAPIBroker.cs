using Action_Delay_API_Core.Models.Errors;
using FluentResults;

namespace Action_Delay_API_Core.Broker.Google
{
    /// <summary>
    /// Compute Engine APIs (load balancing, Cloud Armor). Separate from <see cref="GoogleCloudAPIBroker"/>
    /// only because that one pins its base address to the Cloud DNS host; the token provider, response
    /// envelope and HTTP pipeline are shared.
    /// </summary>
    public partial class GoogleComputeAPIBroker : IGoogleComputeAPIBroker
    {
        // Narrower than cloud-platform, and enough for urlMaps.get/patch and securityPolicies.patchRule.
        private const string GoogleComputeScope = "https://www.googleapis.com/auth/compute";

        private readonly HttpClient _httpClient;
        private readonly ILogger _logger;
        private readonly IGoogleServiceAccountTokenProvider _tokenProvider;

        public GoogleComputeAPIBroker(HttpClient httpClient, ILogger<GoogleComputeAPIBroker> logger,
            IGoogleServiceAccountTokenProvider tokenProvider)
        {
            _logger = logger;
            _httpClient = httpClient;
            _tokenProvider = tokenProvider;
            _httpClient.BaseAddress = new Uri("https://compute.googleapis.com");
            _httpClient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
            _httpClient.Timeout = TimeSpan.FromSeconds(60);
        }

        /// <summary>
        /// Mints a Compute-scoped bearer token, surfacing any failure as a <see cref="CustomAPIError"/> so
        /// jobs classify it as an API error rather than a job error.
        /// </summary>
        private async Task<Result<string>> TryGetAccessToken(string serviceAccountJson, CancellationToken token)
        {
            try
            {
                return Result.Ok(await _tokenProvider.GetAccessTokenAsync(serviceAccountJson, GoogleComputeScope, token));
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Failed to obtain Google Compute access token");
                return Result.Fail(ex is CustomAPIError apiError
                    ? apiError
                    : new CustomAPIError($"Failed to obtain Google Compute access token: {ex.Message}"));
            }
        }
    }
}
