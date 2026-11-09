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
    public async Task Export_downloads_the_existing_two_column_csv()
    {
        using var app = new ApiFactory();
        using var client = app.CreateClient();
        using var response = await client.GetAsync("/api/requests/export");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("text/csv", response.Content.Headers.ContentType?.MediaType);
        Assert.Equal("utf-8", response.Content.Headers.ContentType?.CharSet);
        var disposition = response.Content.Headers.ContentDisposition;
        Assert.Equal("attachment", disposition?.DispositionType);
        Assert.Equal("requests.csv", (disposition?.FileNameStar ?? disposition?.FileName)?.Trim('"'));
        var bytes = await response.Content.ReadAsByteArrayAsync();
        var expected = "Municipality,Project title\r\n"
            + "\"Fjordby\",\"School renovation\"\r\n"
            + "\"Sødal\",\"Library refurbishment\"\r\n"
            + "\"Vesteng\",\"\"\r\n";
        Assert.Equal(Encoding.UTF8.GetBytes(expected), bytes);
    }

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
