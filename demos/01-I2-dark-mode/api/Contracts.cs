namespace Workshop.Api;

public sealed record RequestSummary(Guid Id, string Municipality, string ProjectTitle, RequestStatus Status);
public sealed record RequestUpdate(string? Municipality, string? ProjectTitle, string? Description, bool BudgetAttached);
public sealed record ActivityView(string Action, string Actor, DateTimeOffset OccurredAt, string CorrelationId);
public sealed record RequestDetail(Guid Id, string Municipality, string ProjectTitle, string Description,
bool BudgetAttached, RequestStatus Status, ReadinessResult? Readiness, IReadOnlyList<ActivityView> Activity)
{
    public static RequestDetail From(ProjectRequest request) => new(request.Id, request.Municipality,
    request.ProjectTitle, request.Description, request.BudgetAttached, request.Status,
    Workshop.Api.Readiness.Evaluate(request), request.Activity.OrderBy(x => x.OccurredAt)
        .Select(x => new ActivityView(x.Action, x.Actor.StartsWith("Workshop ") ? "Request officer" : x.Actor, x.OccurredAt, x.CorrelationId)).ToList());
}
