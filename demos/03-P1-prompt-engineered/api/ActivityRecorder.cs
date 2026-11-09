namespace Workshop.Api;

// Supplied helper: participants call it from the review endpoint in build session 4.
public static class ActivityRecorder
{
    public static ActivityEntry Reviewed(Guid requestId, string correlationId) => new()
    {
        RequestId = requestId,
        Action = "Marked reviewed",
        CorrelationId = correlationId
    };
}
