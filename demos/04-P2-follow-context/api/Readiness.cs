namespace Workshop.Api;

public sealed record ReadinessResult(bool IsReady, IReadOnlyList<string> MissingFields);

public static class Readiness
{
    public static ReadinessResult? Evaluate(ProjectRequest request)
    {
        // TODO BUILD 2: apply the three rules in docs/rules.md.
        return null;
    }
}
