using System.Net;
using System.Net.Http.Json;
using System.Text;
using Checkout.Api;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Checkout.Tests;

public sealed class ApiTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Theory]
    [InlineData(10_000, 10, 1_000, 9_000, 500, 9_500)]
    [InlineData(12_000, 10, 1_200, 10_800, 0, 10_800)]
    public async Task ImmutableHttpAcceptanceCases(
        int subtotal, int percent, int discount, int discounted, int shipping, int total)
    {
        using var client = factory.CreateClient();
        using var response = await client.PostAsJsonAsync("/api/checkout", new PricingRequest(subtotal, percent));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(
            new PricingResult(subtotal, percent, discount, discounted, shipping, total),
            await response.Content.ReadFromJsonAsync<PricingResult>());
    }

    [Theory]
    [InlineData("""{"subtotalCents":-1,"discountPercent":10}""")]
    [InlineData("""{"subtotalCents":100000001,"discountPercent":0}""")]
    [InlineData("""{"subtotalCents":10000,"discountPercent":101}""")]
    [InlineData("""{"subtotalCents":10000,"discountPercent":-1}""")]
    [InlineData("""{"subtotalCents":10.5,"discountPercent":10}""")]
    [InlineData("""{"subtotalCents":10000,"discountPercent":1.5}""")]
    [InlineData("""{"subtotalCents":2147483648,"discountPercent":0}""")]
    [InlineData("""{"subtotalCents":"10000","discountPercent":10}""")]
    [InlineData("{}")]
    [InlineData("""{"subtotalCents":10000}""")]
    [InlineData("""{"discountPercent":10}""")]
    [InlineData("null")]
    [InlineData("{")]
    public async Task InvalidBodiesReturnBadRequest(string json)
    {
        using var client = factory.CreateClient();
        using var body = new StringContent(json, Encoding.UTF8, "application/json");
        using var response = await client.PostAsync("/api/checkout", body);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task ValidationErrorsIdentifyBothFields()
    {
        using var client = factory.CreateClient();
        using var response = await client.PostAsJsonAsync("/api/checkout", new PricingRequest(-1, 101));
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("SubtotalCents", body);
        Assert.Contains("DiscountPercent", body);
    }

    [Fact]
    public async Task HealthEndpointIsReady()
    {
        using var client = factory.CreateClient();
        using var response = await client.GetAsync("/api/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("ready", await response.Content.ReadAsStringAsync());
    }
}
