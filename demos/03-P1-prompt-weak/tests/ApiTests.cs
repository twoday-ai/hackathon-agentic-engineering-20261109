using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Workshop.Api;
using Xunit;

namespace Workshop.Tests;

public sealed class ApiTests
{
    [Fact]
    public async Task Health_checks_the_database()
    {
        using var app = new ApiFactory();
        using var client = app.CreateClient();
        var health = await client.GetFromJsonAsync<JsonElement>("/api/health");
        Assert.True(health.GetProperty("database").GetBoolean());
    }

    [Fact]
    public async Task List_and_detail_select_the_correct_persisted_request()
    {
        using var app = new ApiFactory();
        using var client = app.CreateClient();
        var list = await client.GetFromJsonAsync<JsonElement>("/api/requests");
        Assert.Equal(3, list.GetArrayLength());
        var first = await client.GetFromJsonAsync<JsonElement>($"/api/requests/{SeedData.Fjordby}");
        var second = await client.GetFromJsonAsync<JsonElement>($"/api/requests/{SeedData.Sodal}");
        Assert.Equal("Fjordby", first.GetProperty("municipality").GetString());
        Assert.Equal("Sødal", second.GetProperty("municipality").GetString());
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync($"/api/requests/{Guid.NewGuid()}")).StatusCode);
    }

}
