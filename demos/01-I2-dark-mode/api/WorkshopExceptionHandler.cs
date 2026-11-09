using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace Workshop.Api;

public sealed class WorkshopExceptionHandler(ILogger<WorkshopExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken token)
    {
        var conflict = exception is DbUpdateConcurrencyException;
        logger.LogError(exception, "Request failed; trace {TraceId}", context.TraceIdentifier);
        context.Response.StatusCode = conflict ? 409 : 500;
        await context.Response.WriteAsJsonAsync(new
        {
            message = conflict ? "The request changed. Reload it before trying again."
                : "Something went wrong. Please try again.",
            correlationId = context.TraceIdentifier
        }, cancellationToken: token);
        return true;
    }
}
