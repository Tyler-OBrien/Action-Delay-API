using Action_Delay_API_Core.Helpers;
using Action_Delay_API_Core.Jobs.Performance;

namespace Action_Delay_API_Core_Tests.Helpers;

public class S3PresignedUrlGeneratorTests
{
    private const string AccessKey = "AKIAIOSFODNN7EXAMPLE";
    private const string SecretKey = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
    private const string Region = "us-east-1";
    private const string Endpoint = "s3.amazonaws.com";
    private const string Bucket = "my-test-bucket";
    private const string Key = "folder/file.txt";

    private readonly S3PresignedUrlGenerator _generator;

    public S3PresignedUrlGeneratorTests()
    {
        _generator = new S3PresignedUrlGenerator(AccessKey, SecretKey, Region, Endpoint);
    }

    /// <summary>
    /// Parses the query parameters from a presigned URL, URL-decoding keys and values.
    /// </summary>
    private static Dictionary<string, string> ParseQueryParams(string url)
    {
        var query = new Uri(url).Query.TrimStart('?');
        if (string.IsNullOrEmpty(query)) return [];
        return query.Split('&')
            .Select(p => p.Split('=', 2))
            .Where(p => p.Length == 2)
            .ToDictionary(
                p => Uri.UnescapeDataString(p[0]),
                p => Uri.UnescapeDataString(p[1]));
    }

    // -------------------------------------------------------------------------
    // Constructor validation
    // -------------------------------------------------------------------------

    [Fact]
    public void Constructor_NullAccessKey_ThrowsArgumentNullException()
    {
        Assert.Throws<ArgumentNullException>(() =>
            new S3PresignedUrlGenerator(null!, SecretKey, Region, Endpoint));
    }

    [Fact]
    public void Constructor_NullSecretKey_ThrowsArgumentNullException()
    {
        Assert.Throws<ArgumentNullException>(() =>
            new S3PresignedUrlGenerator(AccessKey, null!, Region, Endpoint));
    }

    [Fact]
    public void Constructor_NullRegion_ThrowsArgumentNullException()
    {
        Assert.Throws<ArgumentNullException>(() =>
            new S3PresignedUrlGenerator(AccessKey, SecretKey, null!, Endpoint));
    }

    // -------------------------------------------------------------------------
    // Parameter validation — GenerateUploadUrl
    // -------------------------------------------------------------------------

    [Fact]
    public void GenerateUploadUrl_EmptyBucket_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            _generator.GenerateUploadUrl("", Key, TimeSpan.FromMinutes(15)));
    }

    [Fact]
    public void GenerateUploadUrl_EmptyKey_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            _generator.GenerateUploadUrl(Bucket, "", TimeSpan.FromMinutes(15)));
    }

    [Fact]
    public void GenerateUploadUrl_ExpirationZero_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.Zero));
    }

    [Fact]
    public void GenerateUploadUrl_ExpirationOver7Days_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.FromDays(8)));
    }

    // -------------------------------------------------------------------------
    // Parameter validation — GenerateDownloadUrl
    // -------------------------------------------------------------------------

    [Fact]
    public void GenerateDownloadUrl_EmptyBucket_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            _generator.GenerateDownloadUrl("", Key, TimeSpan.FromMinutes(15)));
    }

    [Fact]
    public void GenerateDownloadUrl_EmptyKey_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            _generator.GenerateDownloadUrl(Bucket, "", TimeSpan.FromMinutes(15)));
    }

    // -------------------------------------------------------------------------
    // Parameter validation — CreateDeleteRequest
    // -------------------------------------------------------------------------

    [Fact]
    public void CreateDeleteRequest_EmptyBucket_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            _generator.CreateDeleteRequest("", Key));
    }

    [Fact]
    public void CreateDeleteRequest_EmptyKey_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() =>
            _generator.CreateDeleteRequest(Bucket, ""));
    }

    // -------------------------------------------------------------------------
    // Virtual-host style — URL structure
    // -------------------------------------------------------------------------

    [Fact]
    public void GenerateUploadUrl_VirtualHostStyle_BucketIsSubdomain()
    {
        var url = _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        var uri = new Uri(url);
        Assert.Equal($"{Bucket}.{Endpoint}", uri.Host);
        Assert.Equal("https", uri.Scheme);
    }

    [Fact]
    public void GenerateDownloadUrl_VirtualHostStyle_BucketIsSubdomain()
    {
        var url = _generator.GenerateDownloadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        var uri = new Uri(url);
        Assert.Equal($"{Bucket}.{Endpoint}", uri.Host);
        Assert.Equal("https", uri.Scheme);
    }

    [Fact]
    public void GenerateUploadUrl_VirtualHostStyle_KeyIsInPath()
    {
        var url = _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        Assert.Equal($"/{Key}", new Uri(url).AbsolutePath);
    }

    [Fact]
    public void GenerateDownloadUrl_VirtualHostStyle_KeyIsInPath()
    {
        var url = _generator.GenerateDownloadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        Assert.Equal($"/{Key}", new Uri(url).AbsolutePath);
    }

    [Fact]
    public void CreateDeleteRequest_VirtualHostStyle_BucketIsSubdomain()
    {
        var request = _generator.CreateDeleteRequest(Bucket, Key);
        var uri = request.RequestUri!;
        Assert.Equal($"{Bucket}.{Endpoint}", uri.Host);
        Assert.Equal("https", uri.Scheme);
    }

    [Fact]
    public void CreateDeleteRequest_VirtualHostStyle_KeyIsInPath()
    {
        var request = _generator.CreateDeleteRequest(Bucket, Key);
        Assert.Equal($"/{Key}", request.RequestUri!.AbsolutePath);
    }

    // -------------------------------------------------------------------------
    // Required AWS SigV4 query parameters
    // -------------------------------------------------------------------------

    [Theory]
    [InlineData("X-Amz-Algorithm")]
    [InlineData("X-Amz-Credential")]
    [InlineData("X-Amz-Date")]
    [InlineData("X-Amz-Expires")]
    [InlineData("X-Amz-SignedHeaders")]
    [InlineData("X-Amz-Signature")]
    public void GenerateUploadUrl_ContainsRequiredQueryParameter(string paramName)
    {
        var url = _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        Assert.True(ParseQueryParams(url).ContainsKey(paramName), $"Missing query param: {paramName}");
    }

    [Theory]
    [InlineData("X-Amz-Algorithm")]
    [InlineData("X-Amz-Credential")]
    [InlineData("X-Amz-Date")]
    [InlineData("X-Amz-Expires")]
    [InlineData("X-Amz-SignedHeaders")]
    [InlineData("X-Amz-Signature")]
    public void GenerateDownloadUrl_ContainsRequiredQueryParameter(string paramName)
    {
        var url = _generator.GenerateDownloadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        Assert.True(ParseQueryParams(url).ContainsKey(paramName), $"Missing query param: {paramName}");
    }

    [Fact]
    public void GenerateUploadUrl_AlgorithmIsAws4HmacSha256()
    {
        var url = _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        Assert.Equal("AWS4-HMAC-SHA256", ParseQueryParams(url)["X-Amz-Algorithm"]);
    }

    [Fact]
    public void GenerateUploadUrl_CredentialContainsAccessKeyAndRegionAndService()
    {
        var url = _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        var credential = ParseQueryParams(url)["X-Amz-Credential"];

        Assert.StartsWith(AccessKey + "/", credential);
        Assert.Contains($"/{Region}/", credential);
        Assert.EndsWith("/s3/aws4_request", credential);
    }

    [Fact]
    public void GenerateUploadUrl_ExpiresMatchesRequestedDuration()
    {
        var expiration = TimeSpan.FromMinutes(15);
        var url = _generator.GenerateUploadUrl(Bucket, Key, expiration);
        Assert.Equal(((int)expiration.TotalSeconds).ToString(), ParseQueryParams(url)["X-Amz-Expires"]);
    }

    [Fact]
    public void GenerateDownloadUrl_ExpiresMatchesRequestedDuration()
    {
        var expiration = TimeSpan.FromSeconds(900);
        var url = _generator.GenerateDownloadUrl(Bucket, Key, expiration);
        Assert.Equal("900", ParseQueryParams(url)["X-Amz-Expires"]);
    }

    [Fact]
    public void GenerateUploadUrl_SignedHeadersAlwaysContainsHost()
    {
        var url = _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        var signedHeaders = ParseQueryParams(url)["X-Amz-SignedHeaders"].Split(';');
        Assert.Contains("host", signedHeaders);
    }

    [Fact]
    public void GenerateDownloadUrl_SignedHeadersAlwaysContainsHost()
    {
        var url = _generator.GenerateDownloadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        var signedHeaders = ParseQueryParams(url)["X-Amz-SignedHeaders"].Split(';');
        Assert.Contains("host", signedHeaders);
    }

    [Fact]
    public void GenerateUploadUrl_SignatureIsLowercaseHex64Chars()
    {
        var url = _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        var signature = ParseQueryParams(url)["X-Amz-Signature"];
        Assert.Equal(64, signature.Length);
        Assert.Matches("^[0-9a-f]+$", signature);
    }

    // -------------------------------------------------------------------------
    // Optional headers — Content-MD5 and payload hash
    // -------------------------------------------------------------------------

    [Fact]
    public void GenerateUploadUrl_WithContentMd5_IncludesInSignedHeadersAndQueryParam()
    {
        const string md5 = "rL0Y20zC+Fzt72VPzMSk2A==";
        var url = _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15), contentMd5: md5);
        var queryParams = ParseQueryParams(url);

        var signedHeaders = queryParams["X-Amz-SignedHeaders"].Split(';');
        Assert.Contains("content-md5", signedHeaders);
        Assert.True(queryParams.ContainsKey("X-Amz-Content-MD5"), "Expected X-Amz-Content-MD5 query param");
        Assert.Equal(md5, queryParams["X-Amz-Content-MD5"]);
    }

    [Fact]
    public void GenerateUploadUrl_WithPayloadSha256_IncludesInSignedHeadersAndQueryParam()
    {
        const string sha256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
        var url = _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15), payloadSha256: sha256);
        var queryParams = ParseQueryParams(url);

        var signedHeaders = queryParams["X-Amz-SignedHeaders"].Split(';');
        Assert.Contains("x-amz-content-sha256", signedHeaders);
        Assert.True(queryParams.ContainsKey("X-Amz-Content-Sha256"), "Expected X-Amz-Content-Sha256 query param");
        Assert.Equal(sha256, queryParams["X-Amz-Content-Sha256"]);
    }

    [Fact]
    public void GenerateUploadUrl_WithoutPayloadSha256_NeitherSignedHeaderNorQueryParamPresent()
    {
        // Unsigned payload path: no sha256 passed
        var url = _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        var queryParams = ParseQueryParams(url);

        var signedHeaders = queryParams["X-Amz-SignedHeaders"].Split(';');
        Assert.DoesNotContain("x-amz-content-sha256", signedHeaders);
        Assert.False(queryParams.ContainsKey("X-Amz-Content-Sha256"));
    }

    // -------------------------------------------------------------------------
    // Key URI encoding
    // -------------------------------------------------------------------------

    [Fact]
    public void GenerateUploadUrl_KeyWithSlashes_PreservesSlashesInPath()
    {
        const string deepKey = "a/b/c/file.txt";
        var url = _generator.GenerateUploadUrl(Bucket, deepKey, TimeSpan.FromMinutes(15));
        Assert.Equal($"/{deepKey}", new Uri(url).AbsolutePath);
    }

    [Fact]
    public void GenerateUploadUrl_KeyWithSpaces_EncodesSpacesAsPercent20()
    {
        const string keyWithSpaces = "folder/file name.txt";
        var url = _generator.GenerateUploadUrl(Bucket, keyWithSpaces, TimeSpan.FromMinutes(15));
        var path = new Uri(url).AbsolutePath;
        Assert.Contains("%20", path);
        Assert.DoesNotContain(" ", path);
    }

    [Fact]
    public void GenerateUploadUrl_KeyWithSpecialChars_EncodesThemInPath()
    {
        const string specialKey = "folder/file@2024.txt";
        var url = _generator.GenerateUploadUrl(Bucket, specialKey, TimeSpan.FromMinutes(15));
        var path = new Uri(url).AbsolutePath;
        Assert.Contains("%40", path);  // '@' → %40
        Assert.DoesNotContain("@", path);
    }

    // -------------------------------------------------------------------------
    // DELETE request structure
    // -------------------------------------------------------------------------

    [Fact]
    public void CreateDeleteRequest_UsesDeleteHttpMethod()
    {
        var request = _generator.CreateDeleteRequest(Bucket, Key);
        Assert.Equal(HttpMethod.Delete, request.Method);
    }

    [Fact]
    public void CreateDeleteRequest_HasAuthorizationHeaderWithCorrectScheme()
    {
        var request = _generator.CreateDeleteRequest(Bucket, Key);
        Assert.True(request.Headers.Contains("Authorization"));
        var authHeader = request.Headers.GetValues("Authorization").First();
        Assert.StartsWith("AWS4-HMAC-SHA256 ", authHeader);
        Assert.Contains("Credential=", authHeader);
        Assert.Contains("SignedHeaders=", authHeader);
        Assert.Contains("Signature=", authHeader);
    }

    [Fact]
    public void CreateDeleteRequest_HasRequiredAmzHeaders()
    {
        var request = _generator.CreateDeleteRequest(Bucket, Key);
        Assert.True(request.Headers.Contains("X-Amz-Date"), "Missing X-Amz-Date header");
        Assert.True(request.Headers.Contains("X-Amz-Content-Sha256"), "Missing X-Amz-Content-Sha256 header");
    }

    [Fact]
    public void CreateDeleteRequest_WithVersionId_IncludesVersionIdInQueryString()
    {
        const string versionId = "abc123version";
        var request = _generator.CreateDeleteRequest(Bucket, Key, versionId: versionId);
        var query = request.RequestUri!.Query;
        Assert.Contains("versionId=", query);
        Assert.Contains(versionId, query);
    }

    [Fact]
    public void CreateDeleteRequest_WithoutVersionId_HasNoQueryString()
    {
        var request = _generator.CreateDeleteRequest(Bucket, Key);
        Assert.True(string.IsNullOrEmpty(request.RequestUri!.Query));
    }

    // -------------------------------------------------------------------------
    // Signature stability — same inputs produce same signature
    // -------------------------------------------------------------------------

    [Fact]
    public void GenerateUploadUrl_DifferentKeys_ProduceDifferentSignatures()
    {
        var url1 = _generator.GenerateUploadUrl(Bucket, "file1.txt", TimeSpan.FromMinutes(15));
        var url2 = _generator.GenerateUploadUrl(Bucket, "file2.txt", TimeSpan.FromMinutes(15));

        var sig1 = ParseQueryParams(url1)["X-Amz-Signature"];
        var sig2 = ParseQueryParams(url2)["X-Amz-Signature"];

        Assert.NotEqual(sig1, sig2);
    }

    [Fact]
    public void GenerateUploadUrl_DifferentBuckets_ProduceDifferentSignatures()
    {
        var gen1 = new S3PresignedUrlGenerator(AccessKey, SecretKey, Region, Endpoint);
        var gen2 = new S3PresignedUrlGenerator(AccessKey, SecretKey, Region, Endpoint);

        var url1 = gen1.GenerateUploadUrl("bucket-a", Key, TimeSpan.FromMinutes(15));
        var url2 = gen2.GenerateUploadUrl("bucket-b", Key, TimeSpan.FromMinutes(15));

        var sig1 = ParseQueryParams(url1)["X-Amz-Signature"];
        var sig2 = ParseQueryParams(url2)["X-Amz-Signature"];

        Assert.NotEqual(sig1, sig2);
    }

    [Fact]
    public void GenerateUploadUrl_DifferentSecretKeys_ProduceDifferentSignatures()
    {
        var gen1 = new S3PresignedUrlGenerator(AccessKey, "secret-key-one", Region, Endpoint);
        var gen2 = new S3PresignedUrlGenerator(AccessKey, "secret-key-two", Region, Endpoint);

        var url1 = gen1.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        var url2 = gen2.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15));

        var sig1 = ParseQueryParams(url1)["X-Amz-Signature"];
        var sig2 = ParseQueryParams(url2)["X-Amz-Signature"];

        Assert.NotEqual(sig1, sig2);
    }

    // -------------------------------------------------------------------------
    // Path style vs virtual-host style — signatures differ
    // -------------------------------------------------------------------------

    [Fact]
    public void GenerateUploadUrl_PathStyleAndVirtualHost_ProduceDifferentSignatures()
    {
        var virtualHost = new S3PresignedUrlGenerator(AccessKey, SecretKey, Region, Endpoint, usePathStyle: false);
        var pathStyle = new S3PresignedUrlGenerator(AccessKey, SecretKey, Region, Endpoint, usePathStyle: true);

        var sig1 = ParseQueryParams(virtualHost.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15)))["X-Amz-Signature"];
        var sig2 = ParseQueryParams(pathStyle.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15)))["X-Amz-Signature"];

        Assert.NotEqual(sig1, sig2);
    }
}

public class S3PresignedUrlGeneratorPathStyleTests
{
    private const string AccessKey = "AKIAIOSFODNN7EXAMPLE";
    private const string SecretKey = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
    private const string Region = "us-east-1";
    private const string Endpoint = "minio.example.com";
    private const string Bucket = "my-test-bucket";
    private const string Key = "folder/file.txt";

    private readonly S3PresignedUrlGenerator _generator;

    public S3PresignedUrlGeneratorPathStyleTests()
    {
        _generator = new S3PresignedUrlGenerator(AccessKey, SecretKey, Region, Endpoint, usePathStyle: true);
    }

    private static Dictionary<string, string> ParseQueryParams(string url)
    {
        var query = new Uri(url).Query.TrimStart('?');
        if (string.IsNullOrEmpty(query)) return [];
        return query.Split('&')
            .Select(p => p.Split('=', 2))
            .Where(p => p.Length == 2)
            .ToDictionary(
                p => Uri.UnescapeDataString(p[0]),
                p => Uri.UnescapeDataString(p[1]));
    }

    // -------------------------------------------------------------------------
    // Path-style URL structure
    // -------------------------------------------------------------------------

    [Fact]
    public void GenerateUploadUrl_PathStyle_EndpointIsHost()
    {
        var url = _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        var uri = new Uri(url);
        Assert.Equal(Endpoint, uri.Host);
        Assert.Equal("https", uri.Scheme);
    }

    [Fact]
    public void GenerateDownloadUrl_PathStyle_EndpointIsHost()
    {
        var url = _generator.GenerateDownloadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        var uri = new Uri(url);
        Assert.Equal(Endpoint, uri.Host);
        Assert.Equal("https", uri.Scheme);
    }

    [Fact]
    public void GenerateUploadUrl_PathStyle_BucketAndKeyAreInPath()
    {
        var url = _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        Assert.Equal($"/{Bucket}/{Key}", new Uri(url).AbsolutePath);
    }

    [Fact]
    public void GenerateDownloadUrl_PathStyle_BucketAndKeyAreInPath()
    {
        var url = _generator.GenerateDownloadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        Assert.Equal($"/{Bucket}/{Key}", new Uri(url).AbsolutePath);
    }

    [Fact]
    public void GenerateUploadUrl_PathStyle_BucketNotInSubdomain()
    {
        var url = _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        Assert.DoesNotContain(Bucket, new Uri(url).Host);
    }

    [Fact]
    public void GenerateDownloadUrl_PathStyle_BucketNotInSubdomain()
    {
        var url = _generator.GenerateDownloadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        Assert.DoesNotContain(Bucket, new Uri(url).Host);
    }

    // -------------------------------------------------------------------------
    // Required AWS SigV4 query parameters (same requirements as virtual-host)
    // -------------------------------------------------------------------------

    [Theory]
    [InlineData("X-Amz-Algorithm")]
    [InlineData("X-Amz-Credential")]
    [InlineData("X-Amz-Date")]
    [InlineData("X-Amz-Expires")]
    [InlineData("X-Amz-SignedHeaders")]
    [InlineData("X-Amz-Signature")]
    public void GenerateUploadUrl_PathStyle_ContainsRequiredQueryParameter(string paramName)
    {
        var url = _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        Assert.True(ParseQueryParams(url).ContainsKey(paramName), $"Missing query param: {paramName}");
    }

    [Fact]
    public void GenerateUploadUrl_PathStyle_SignedHeadersContainsHost()
    {
        var url = _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        var signedHeaders = ParseQueryParams(url)["X-Amz-SignedHeaders"].Split(';');
        Assert.Contains("host", signedHeaders);
    }

    [Fact]
    public void GenerateUploadUrl_PathStyle_CredentialContainsAccessKeyAndRegion()
    {
        var url = _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        var credential = ParseQueryParams(url)["X-Amz-Credential"];
        Assert.StartsWith(AccessKey + "/", credential);
        Assert.Contains($"/{Region}/", credential);
        Assert.EndsWith("/s3/aws4_request", credential);
    }

    [Fact]
    public void GenerateUploadUrl_PathStyle_SignatureIsLowercaseHex64Chars()
    {
        var url = _generator.GenerateUploadUrl(Bucket, Key, TimeSpan.FromMinutes(15));
        var signature = ParseQueryParams(url)["X-Amz-Signature"];
        Assert.Equal(64, signature.Length);
        Assert.Matches("^[0-9a-f]+$", signature);
    }

    // -------------------------------------------------------------------------
    // Key encoding in path style
    // -------------------------------------------------------------------------

    [Fact]
    public void GenerateUploadUrl_PathStyle_KeyWithSlashes_PathIsBucketSlashKey()
    {
        const string deepKey = "a/b/c/file.txt";
        var url = _generator.GenerateUploadUrl(Bucket, deepKey, TimeSpan.FromMinutes(15));
        Assert.Equal($"/{Bucket}/{deepKey}", new Uri(url).AbsolutePath);
    }

    [Fact]
    public void GenerateUploadUrl_PathStyle_KeyWithSpaces_EncodesSpacesAsPercent20()
    {
        const string keyWithSpaces = "folder/file name.txt";
        var url = _generator.GenerateUploadUrl(Bucket, keyWithSpaces, TimeSpan.FromMinutes(15));
        var path = new Uri(url).AbsolutePath;
        Assert.Contains("%20", path);
        Assert.DoesNotContain(" ", path);
    }

    // -------------------------------------------------------------------------
    // DELETE request — path style
    // -------------------------------------------------------------------------

    [Fact]
    public void CreateDeleteRequest_PathStyle_EndpointIsHost()
    {
        var request = _generator.CreateDeleteRequest(Bucket, Key);
        Assert.Equal(Endpoint, request.RequestUri!.Host);
    }

    [Fact]
    public void CreateDeleteRequest_PathStyle_BucketAndKeyAreInPath()
    {
        var request = _generator.CreateDeleteRequest(Bucket, Key);
        Assert.Equal($"/{Bucket}/{Key}", request.RequestUri!.AbsolutePath);
    }

    [Fact]
    public void CreateDeleteRequest_PathStyle_BucketNotInSubdomain()
    {
        var request = _generator.CreateDeleteRequest(Bucket, Key);
        Assert.DoesNotContain(Bucket, request.RequestUri!.Host);
    }

    [Fact]
    public void CreateDeleteRequest_PathStyle_HasAuthorizationHeader()
    {
        var request = _generator.CreateDeleteRequest(Bucket, Key);
        Assert.True(request.Headers.Contains("Authorization"));
        var authHeader = request.Headers.GetValues("Authorization").First();
        Assert.StartsWith("AWS4-HMAC-SHA256 ", authHeader);
    }

    [Fact]
    public void CreateDeleteRequest_PathStyle_WithVersionId_IncludesVersionIdInQueryString()
    {
        const string versionId = "abc123version";
        var request = _generator.CreateDeleteRequest(Bucket, Key, versionId: versionId);
        Assert.Contains("versionId=", request.RequestUri!.Query);
        Assert.Contains(versionId, request.RequestUri!.Query);
    }
}

// -------------------------------------------------------------------------
// Warmup URL helper tests (GenericUploadS3BaseJob / GenericDownloadS3BaseJob)
// -------------------------------------------------------------------------

public class S3WarmupUrlTests
{
    private const string Endpoint = "s3.amazonaws.com";
    private const string Bucket = "my-bucket";

    // Upload job

    [Fact]
    public void UploadJob_GetWarmupUrl_VirtualHostStyle_UsesBucketSubdomain()
    {
        var url = GenericUploadS3BaseJob.GetWarmupUrl(Endpoint, Bucket, usePathStyle: false);
        Assert.Equal($"https://{Bucket}.{Endpoint}", url);
    }

    [Fact]
    public void UploadJob_GetWarmupUrl_PathStyle_UsesEndpointOnly()
    {
        var url = GenericUploadS3BaseJob.GetWarmupUrl(Endpoint, Bucket, usePathStyle: true);
        Assert.Equal($"https://{Endpoint}", url);
    }

    [Fact]
    public void UploadJob_GetWarmupUrl_PathStyle_DoesNotContainBucket()
    {
        var url = GenericUploadS3BaseJob.GetWarmupUrl(Endpoint, Bucket, usePathStyle: true);
        Assert.DoesNotContain(Bucket, url);
    }

    [Fact]
    public void UploadJob_GetWarmupUrl_VirtualHostStyle_MatchesPresignedUrlHost()
    {
        // The warmup URL host must match the host used in presigned upload URLs.
        var warmup = new Uri(GenericUploadS3BaseJob.GetWarmupUrl(Endpoint, Bucket, usePathStyle: false));
        var presigned = new Uri(new S3PresignedUrlGenerator("key", "secret", "us-east-1", Endpoint, usePathStyle: false)
            .GenerateUploadUrl(Bucket, "file.txt", TimeSpan.FromMinutes(15)));

        Assert.Equal(presigned.Host, warmup.Host);
    }

    [Fact]
    public void UploadJob_GetWarmupUrl_PathStyle_MatchesPresignedUrlHost()
    {
        var warmup = new Uri(GenericUploadS3BaseJob.GetWarmupUrl(Endpoint, Bucket, usePathStyle: true));
        var presigned = new Uri(new S3PresignedUrlGenerator("key", "secret", "us-east-1", Endpoint, usePathStyle: true)
            .GenerateUploadUrl(Bucket, "file.txt", TimeSpan.FromMinutes(15)));

        Assert.Equal(presigned.Host, warmup.Host);
    }

    // Download job

    [Fact]
    public void DownloadJob_GetWarmupUrl_VirtualHostStyle_UsesBucketSubdomain()
    {
        var url = GenericDownloadS3BaseJob.GetWarmupUrl(Endpoint, Bucket, usePathStyle: false);
        Assert.Equal($"https://{Bucket}.{Endpoint}", url);
    }

    [Fact]
    public void DownloadJob_GetWarmupUrl_PathStyle_UsesEndpointOnly()
    {
        var url = GenericDownloadS3BaseJob.GetWarmupUrl(Endpoint, Bucket, usePathStyle: true);
        Assert.Equal($"https://{Endpoint}", url);
    }

    [Fact]
    public void DownloadJob_GetWarmupUrl_PathStyle_MatchesPresignedUrlHost()
    {
        var warmup = new Uri(GenericDownloadS3BaseJob.GetWarmupUrl(Endpoint, Bucket, usePathStyle: true));
        var presigned = new Uri(new S3PresignedUrlGenerator("key", "secret", "us-east-1", Endpoint, usePathStyle: true)
            .GenerateDownloadUrl(Bucket, "file.txt", TimeSpan.FromMinutes(15)));

        Assert.Equal(presigned.Host, warmup.Host);
    }

    [Fact]
    public void DownloadJob_GetWarmupUrl_VirtualHostStyle_MatchesPresignedUrlHost()
    {
        var warmup = new Uri(GenericDownloadS3BaseJob.GetWarmupUrl(Endpoint, Bucket, usePathStyle: false));
        var presigned = new Uri(new S3PresignedUrlGenerator("key", "secret", "us-east-1", Endpoint, usePathStyle: false)
            .GenerateDownloadUrl(Bucket, "file.txt", TimeSpan.FromMinutes(15)));

        Assert.Equal(presigned.Host, warmup.Host);
    }
}
