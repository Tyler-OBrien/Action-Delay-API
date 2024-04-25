namespace Action_Delay_API_Core.Models.NATS
{
    public enum NetType
    {
        Either = 0,
        IPv4 = 1,
        IPv6 = 2
    }
    public enum MethodType
    {
        GET,
        POST,
        PUT,
        PATCH,
        DELETE,
        OPTIONS,
        HEAD
    }
}
