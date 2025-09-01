using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Helpers
{
    public class S3PresignedUrlGenerator
    {
        private readonly string _accessKey;
        private readonly string _secretKey;
        private readonly string _region;
        private readonly string _endpoint;

        public S3PresignedUrlGenerator(string accessKey, string secretKey, string region, string endpoint = null)
        {
            _accessKey = accessKey ?? throw new ArgumentNullException(nameof(accessKey));
            _secretKey = secretKey ?? throw new ArgumentNullException(nameof(secretKey));
            _region = region ?? throw new ArgumentNullException(nameof(region));
            _endpoint = endpoint;
        }

        public string GenerateUploadUrl(string bucket, string key, TimeSpan expiration, string contentMd5 = null, string payloadSha256 = null)
        {
            ValidateParameters(bucket, key, expiration);
            return GeneratePresignedUrl(bucket, key, expiration, "PUT", contentMd5, payloadSha256);
        }

        public string GenerateDownloadUrl(string bucket, string key, TimeSpan expiration)
        {
            ValidateParameters(bucket, key, expiration);
            return GeneratePresignedUrl(bucket, key, expiration, "GET");
        }

        public HttpRequestMessage CreateDeleteRequest(string bucket, string key, string versionId = null)
        {
            if (string.IsNullOrWhiteSpace(bucket))
                throw new ArgumentException("Bucket name cannot be null or empty", nameof(bucket));
            if (string.IsNullOrWhiteSpace(key))
                throw new ArgumentException("Key cannot be null or empty", nameof(key));

            var now = DateTime.UtcNow;
            var dateStamp = now.ToString("yyyyMMdd");
            var amzDate = now.ToString("yyyyMMddTHHmmssZ");
            var contentSha256 = Sha256Hash(""); // Empty body for DELETE

            var virtualHost = $"{bucket}.{_endpoint}";
            var encodedKey = UriEncodePath(key);

            // Build URL with optional version ID
            var url = $"https://{virtualHost}/{encodedKey}";
            var queryString = "";
            if (!string.IsNullOrWhiteSpace(versionId))
            {
                queryString = $"versionId={UriEncodeQueryParam(versionId)}";
                url += $"?{queryString}";
            }

            var request = new HttpRequestMessage(HttpMethod.Delete, url);

            // Add required headers
            request.Headers.Add("Host", virtualHost);
            request.Headers.Add("X-Amz-Date", amzDate);
            request.Headers.Add("X-Amz-Content-Sha256", contentSha256);

            // Create authorization header
            var credentialScope = $"{dateStamp}/{_region}/s3/aws4_request";
            var canonicalRequest = CreateCanonicalRequest("DELETE", $"/{encodedKey}", queryString,
                new Dictionary<string, string>
                {
                    ["host"] = virtualHost,
                    ["x-amz-content-sha256"] = contentSha256,
                    ["x-amz-date"] = amzDate
                },
                "host;x-amz-content-sha256;x-amz-date", contentSha256);

            var stringToSign = CreateStringToSign(amzDate, credentialScope, canonicalRequest);
            var signature = CalculateSignature(stringToSign, _secretKey, dateStamp, _region, "s3");

            var authHeader = $"AWS4-HMAC-SHA256 Credential={_accessKey}/{credentialScope}, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature={signature}";
            request.Headers.TryAddWithoutValidation("Authorization", authHeader);

            return request;
        }


        private void ValidateParameters(string bucket, string key, TimeSpan expiration)
        {
            if (string.IsNullOrWhiteSpace(bucket))
                throw new ArgumentException("Bucket name cannot be null or empty", nameof(bucket));
            if (string.IsNullOrWhiteSpace(key))
                throw new ArgumentException("Key cannot be null or empty", nameof(key));
            if (expiration.TotalSeconds < 1 || expiration.TotalSeconds > 604800) // 1 second to 7 days
                throw new ArgumentException("Expiration must be between 1 second and 7 days", nameof(expiration));
        }

        private string GeneratePresignedUrl(string bucket, string key, TimeSpan expiration, string httpMethod, string contentMd5 = null, string payloadSha256 = null)
        {
            var now = DateTime.UtcNow;
            var expires = (int)expiration.TotalSeconds;
            var dateStamp = now.ToString("yyyyMMdd");
            var amzDate = now.ToString("yyyyMMddTHHmmssZ");

            var credentialScope = $"{dateStamp}/{_region}/s3/aws4_request";
            var credential = $"{_accessKey}/{credentialScope}";

            // For virtual-hosted style, bucket goes in hostname
            var virtualHost = $"{bucket}.{_endpoint}";

            // Calculate payload hash
            var payloadHash = payloadSha256 ?? "UNSIGNED-PAYLOAD";

            // Build query parameters (excluding signature)
            var queryParams = new SortedDictionary<string, string>
            {
                ["X-Amz-Algorithm"] = "AWS4-HMAC-SHA256",
                ["X-Amz-Credential"] = credential,
                ["X-Amz-Date"] = amzDate,
                ["X-Amz-Expires"] = expires.ToString(),
                ["X-Amz-SignedHeaders"] = "host"
            };

            // Set up headers and signed headers list
            var headers = new Dictionary<string, string> { ["host"] = virtualHost };
            var signedHeadersList = new List<string> { "host" };

            // Add Content-MD5 if provided
            if (!string.IsNullOrEmpty(contentMd5))
            {
                queryParams["X-Amz-Content-MD5"] = contentMd5;
                headers["content-md5"] = contentMd5;
                signedHeadersList.Add("content-md5");
            }

            // Add X-Amz-Content-Sha256 if we have a specific payload
            if (!string.IsNullOrEmpty(payloadSha256))
            {
                queryParams["X-Amz-Content-Sha256"] = payloadHash;
                headers["x-amz-content-sha256"] = payloadHash;
                signedHeadersList.Add("x-amz-content-sha256");
            }

            // Sort and join signed headers
            signedHeadersList.Sort();
            var signedHeaders = string.Join(";", signedHeadersList);
            queryParams["X-Amz-SignedHeaders"] = signedHeaders;

            var canonicalQueryString = string.Join("&",
                queryParams.Select(x => $"{UriEncodeQueryParam(x.Key)}={UriEncodeQueryParam(x.Value)}"));

            // Create canonical request - path is just the key, host includes bucket
            var encodedKey = UriEncodePath(key);
            var canonicalRequest = CreateCanonicalRequest(httpMethod, $"/{encodedKey}", canonicalQueryString,
                headers, signedHeaders, payloadHash);

            var stringToSign = CreateStringToSign(amzDate, credentialScope, canonicalRequest);
            var signature = CalculateSignature(stringToSign, _secretKey, dateStamp, _region, "s3");

            var presignedUrl = $"https://{virtualHost}/{encodedKey}?{canonicalQueryString}&X-Amz-Signature={signature}";

            return presignedUrl;
        }

        private string CreateCanonicalRequest(string httpMethod, string canonicalUri, string canonicalQueryString,
            Dictionary<string, string> headers, string signedHeaders, string payloadHash)
        {
            var canonicalHeaders = string.Join("", headers.OrderBy(x => x.Key)
                .Select(x => $"{x.Key.ToLowerInvariant()}:{x.Value.Trim()}\n"));

            return $"{httpMethod}\n{canonicalUri}\n{canonicalQueryString}\n{canonicalHeaders}\n{signedHeaders}\n{payloadHash}";
        }

        private string CreateStringToSign(string amzDate, string credentialScope, string canonicalRequest)
        {
            return $"AWS4-HMAC-SHA256\n{amzDate}\n{credentialScope}\n{Sha256Hash(canonicalRequest)}";
        }

        private static string Sha256Hash(string input)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
            return BitConverter.ToString(bytes).Replace("-", "").ToLowerInvariant();
        }

        private static string Sha256HashBytes(byte[] input)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(input);
            return BitConverter.ToString(bytes).Replace("-", "").ToLowerInvariant();
        }

        private static string CalculateSignature(string stringToSign, string secretKey, string dateStamp, string region, string service)
        {
            var kDate = HmacSha256($"AWS4{secretKey}", dateStamp);
            var kRegion = HmacSha256(kDate, region);
            var kService = HmacSha256(kRegion, service);
            var kSigning = HmacSha256(kService, "aws4_request");
            var signature = HmacSha256(kSigning, stringToSign);

            return BitConverter.ToString(signature).Replace("-", "").ToLowerInvariant();
        }

        private static byte[] HmacSha256(string key, string data) => HmacSha256(Encoding.UTF8.GetBytes(key), data);

        private static byte[] HmacSha256(byte[] key, string data)
        {
            using var hmac = new HMACSHA256(key);
            return hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
        }

        // AWS-specific URI encoding for paths (encode everything except unreserved chars)
        private static string UriEncodePath(string input)
        {
            if (string.IsNullOrEmpty(input)) return "";

            var result = new StringBuilder();
            foreach (char c in input)
            {
                if (IsUnreserved(c) || c == '/')
                    result.Append(c);
                else
                    result.Append($"%{((int)c):X2}");
            }
            return result.ToString();
        }

        // AWS-specific URI encoding for query parameters (encode everything except unreserved chars)
        private static string UriEncodeQueryParam(string input)
        {
            if (string.IsNullOrEmpty(input)) return "";

            var result = new StringBuilder();
            foreach (char c in input)
            {
                if (IsUnreserved(c))
                    result.Append(c);
                else
                    result.Append($"%{((int)c):X2}");
            }
            return result.ToString();
        }

        private static bool IsUnreserved(char c)
        {
            return (c >= 'A' && c <= 'Z') ||
                   (c >= 'a' && c <= 'z') ||
                   (c >= '0' && c <= '9') ||
                   c == '-' || c == '_' || c == '.' || c == '~';
        }
    }
}
