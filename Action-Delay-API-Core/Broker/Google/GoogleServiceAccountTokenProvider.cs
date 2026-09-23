using System.Collections.Concurrent;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Action_Delay_API_Core.Models.Errors;

namespace Action_Delay_API_Core.Broker.Google
{
    public interface IGoogleServiceAccountTokenProvider
    {
        /// <summary>
        /// Returns a Google OAuth2 access token for the given service-account JSON key and scope,
        /// minted via the JWT-bearer flow. Tokens are cached in-memory and refreshed shortly before expiry.
        /// </summary>
        Task<string> GetAccessTokenAsync(string serviceAccountJson, string scope, CancellationToken token);
    }

    /// <summary>
    /// Mints Google OAuth2 access tokens from a service-account JSON key without the Google SDK:
    /// builds and RS256-signs a JWT assertion, then exchanges it at the token endpoint. Registered as a
    /// singleton so the access token is cached across the many concurrent per-location broker calls.
    /// </summary>
    public class GoogleServiceAccountTokenProvider : IGoogleServiceAccountTokenProvider
    {
        private const string DefaultTokenUri = "https://oauth2.googleapis.com/token";
        private const string JwtBearerGrant = "urn:ietf:params:oauth:grant-type:jwt-bearer";

        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<GoogleServiceAccountTokenProvider> _logger;

        // One cache slot per (scope, key) pair. A single shared slot would have the jobs evict each
        // other every run - Cloud DNS and Compute ask for different scopes - forcing a fresh RS256
        // sign and token exchange on every call, all queued behind one lock.
        private readonly ConcurrentDictionary<string, CacheEntry> _cache = new();

        public GoogleServiceAccountTokenProvider(IHttpClientFactory httpClientFactory,
            ILogger<GoogleServiceAccountTokenProvider> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task<string> GetAccessTokenAsync(string serviceAccountJson, string scope, CancellationToken token)
        {
            var cacheKey = $"{scope}\n{serviceAccountJson}";
            var entry = _cache.GetOrAdd(cacheKey, _ => new CacheEntry());

            // Fast path: a still-valid token is a single volatile reference read, no lock at all.
            var cached = entry.Current;
            if (IsUsable(cached)) return cached!.Value;

            // Serialize refreshes for this key only: the once-per-hour mint is exactly the stampede
            // we want to collapse when every location asks at the same moment.
            await entry.Lock.WaitAsync(token);
            try
            {
                cached = entry.Current;
                if (IsUsable(cached)) return cached!.Value;

                var credentials = ParseServiceAccount(serviceAccountJson);
                var assertion = BuildSignedJwt(credentials, scope);
                var (accessToken, expiresIn) = await ExchangeAsync(credentials.TokenUri, assertion, token);

                entry.Current = new CachedToken(accessToken, DateTime.UtcNow.AddSeconds(expiresIn));
                return accessToken;
            }
            finally
            {
                entry.Lock.Release();
            }
        }

        // Refresh 60s early so a token can't expire mid-flight.
        private static bool IsUsable(CachedToken? cached) =>
            cached != null && DateTime.UtcNow < cached.ExpiryUtc.AddSeconds(-60);

        private static ServiceAccountCredentials ParseServiceAccount(string serviceAccountJson)
        {
            ServiceAccountCredentials? credentials;
            try
            {
                credentials = JsonSerializer.Deserialize<ServiceAccountCredentials>(serviceAccountJson);
            }
            catch (Exception ex)
            {
                throw new CustomAPIError($"Could not parse Google service-account JSON: {ex.Message}");
            }

            if (credentials == null || string.IsNullOrWhiteSpace(credentials.ClientEmail) ||
                string.IsNullOrWhiteSpace(credentials.PrivateKey))
                throw new CustomAPIError("Google service-account JSON is missing client_email or private_key");

            if (string.IsNullOrWhiteSpace(credentials.TokenUri))
                credentials.TokenUri = DefaultTokenUri;
            return credentials;
        }

        private static string BuildSignedJwt(ServiceAccountCredentials credentials, string scope)
        {
            var now = DateTimeOffset.UtcNow;
            var header = new { alg = "RS256", typ = "JWT" };
            var payload = new
            {
                iss = credentials.ClientEmail,
                scope,
                aud = credentials.TokenUri,
                iat = now.ToUnixTimeSeconds(),
                exp = now.AddMinutes(60).ToUnixTimeSeconds()
            };

            var unsigned = $"{Base64UrlEncode(JsonSerializer.SerializeToUtf8Bytes(header))}." +
                           $"{Base64UrlEncode(JsonSerializer.SerializeToUtf8Bytes(payload))}";

            using var rsa = RSA.Create();
            rsa.ImportFromPem(credentials.PrivateKey);
            var signature = rsa.SignData(Encoding.ASCII.GetBytes(unsigned),
                HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
            return $"{unsigned}.{Base64UrlEncode(signature)}";
        }

        private async Task<(string accessToken, int expiresIn)> ExchangeAsync(string tokenUri, string assertion,
            CancellationToken token)
        {
            var client = _httpClientFactory.CreateClient(nameof(GoogleServiceAccountTokenProvider));
            using var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", JwtBearerGrant),
                new KeyValuePair<string, string>("assertion", assertion)
            });

            using var response = await client.PostAsync(tokenUri, content, token);
            var body = await response.Content.ReadAsStringAsync(token);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogCritical($"Google token exchange failed: HTTP {(int)response.StatusCode} - {body}");
                throw new CustomAPIError($"Google token exchange failed: HTTP {(int)response.StatusCode} - {body}");
            }

            TokenResponse? parsed;
            try
            {
                parsed = JsonSerializer.Deserialize<TokenResponse>(body);
            }
            catch (Exception ex)
            {
                throw new CustomAPIError($"Could not parse Google token response: {ex.Message} - {body}");
            }

            if (parsed == null || string.IsNullOrEmpty(parsed.AccessToken))
                throw new CustomAPIError($"Google token exchange returned no access_token: {body}");
            return (parsed.AccessToken, parsed.ExpiresIn);
        }

        private static string Base64UrlEncode(byte[] bytes) =>
            Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');

        private sealed class CacheEntry
        {
            public readonly SemaphoreSlim Lock = new(1, 1);

            /// <summary>Swapped wholesale, so an unlocked reader never sees a token with someone else's expiry.</summary>
            public volatile CachedToken? Current;
        }

        private sealed record CachedToken(string Value, DateTime ExpiryUtc);

        private class ServiceAccountCredentials
        {
            [JsonPropertyName("client_email")] public string ClientEmail { get; set; } = "";
            [JsonPropertyName("private_key")] public string PrivateKey { get; set; } = "";
            [JsonPropertyName("token_uri")] public string TokenUri { get; set; } = "";
        }

        private class TokenResponse
        {
            [JsonPropertyName("access_token")] public string? AccessToken { get; set; }
            [JsonPropertyName("expires_in")] public int ExpiresIn { get; set; }
        }
    }
}
