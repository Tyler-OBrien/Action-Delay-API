﻿namespace Action_Delay_API_Worker.Extensions
{
    public static class SerializableExtension
    {
        /*
        public static byte[] Serialize<T>(this T obj) where T : class
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
        */
    }
}
