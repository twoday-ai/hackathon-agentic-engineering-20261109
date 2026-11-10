using Checkout.Api;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<PricingCalculator>();
builder.Services.AddProblemDetails();
builder.Services.Configure<RouteHandlerOptions>(options => options.ThrowOnBadRequest = false);
builder.Services.ConfigureHttpJsonOptions(options =>
    options.SerializerOptions.NumberHandling = JsonNumberHandling.Strict);

var app = builder.Build();
app.UseExceptionHandler();

app.MapGet("/api/health", () => Results.Ok(new { status = "ready" }));
app.MapPost("/api/checkout", (PricingRequest request, PricingCalculator calculator) =>
{
    var errors = request.Validate();
    return errors.Count == 0
        ? Results.Ok(calculator.Calculate(request))
        : Results.ValidationProblem(errors);
});

app.Run();

public partial class Program;
