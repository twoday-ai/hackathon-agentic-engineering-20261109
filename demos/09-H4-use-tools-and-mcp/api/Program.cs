using Microsoft.EntityFrameworkCore;
using Workshop.Api;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<WorkshopDb>(options =>
options.UseNpgsql(builder.Configuration.GetConnectionString("Workshop")));
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<WorkshopExceptionHandler>();
builder.Services.ConfigureHttpJsonOptions(options =>
options.SerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter()));
var app = builder.Build();
app.UseExceptionHandler();
app.Use(async (context, next) =>
{
    var clock = System.Diagnostics.Stopwatch.StartNew();
    context.Response.Headers["X-Correlation-ID"] = context.TraceIdentifier;
    try { await next(context); }
    finally
    {
        app.Logger.LogInformation("HTTP {Method} {Path} returned {Status} in {ElapsedMs}ms; trace {TraceId}",
        context.Request.Method, context.Request.Path, context.Response.StatusCode,
        clock.ElapsedMilliseconds, context.TraceIdentifier);
    }
});
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<WorkshopDb>();
    // A fixed schema for a disposable workshop. All six checkpoints share this schema.
    // EnsureCreated is deliberate here; use migrations for an evolving production schema.
    await db.Database.EnsureCreatedAsync();
    await SeedData.EnsureSeededAsync(db);
}
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapWorkshopEndpoints();
app.MapFallbackToFile("index.html");
app.Run();

public partial class Program { }
