using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace Action_Delay_API_Core.Extensions
{
    public static class SerializableExtension
    {
        public static byte[] Serialize<T>(this T obj)
        {
            return (Encoding.UTF8.GetBytes(JsonSerializer.Serialize(obj)));
        }

        public static T? Deserialize<T>(this byte[] data) where T : class
        {
            if (data.Length == 0) return null;
            var DATA = Encoding.UTF8.GetString(data);
            if (string.IsNullOrWhiteSpace(DATA)) return null;
            return JsonSerializer.Deserialize<T>(DATA);
        }
        public static string Truncate(this string value, int maxLength)
        {
            if (string.IsNullOrEmpty(value)) return value;
            return value.Length <= maxLength ? value : value.Substring(0, maxLength);
        }

        public static Regex HtmlTitleRegex = new Regex(@"<title>(.*?)<\/title>",
            RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.IgnorePatternWhitespace);

        public static string IntelligentCloudflareErrorsFriendlyTruncate(this string value, int maxLength)
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

        public static Regex S3MessageRegex = new Regex(@"<Message>(.*?)<\/Message>",
            RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.IgnorePatternWhitespace);

        public static string IntelligentCloudflareErrorsS3FriendlyTruncate(this string value, int maxLength)
        {

            if (string.IsNullOrEmpty(value)) return value;

            if (value.TrimStart().StartsWith("<?xml", StringComparison.OrdinalIgnoreCase))
            {
                var tryMatch = S3MessageRegex.Match(value);
                if (tryMatch is { Success: true, Groups.Count: > 1 })
                {
                    value = tryMatch.Groups[1].Value;
                }
            }

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
