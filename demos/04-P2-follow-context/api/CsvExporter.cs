using System.Text;

namespace Workshop.Api;

// Existing component: inspect its callers and tests before changing it in build session 5.
public static class CsvExporter
{
    public static byte[] Export(IEnumerable<ProjectRequest> requests)
    {
        var csv = new StringBuilder();
        csv.Append("Municipality,Project title\r\n");
        foreach (var row in requests)
        csv.AppendJoin(',', new[] { row.Municipality, row.ProjectTitle }.Select(Escape)).Append("\r\n");
        return new UTF8Encoding(encoderShouldEmitUTF8Identifier: false).GetBytes(csv.ToString());
    }

    // Preserve quoting and spreadsheet-formula neutralization when adding a column.
    private static string Escape(string value)
    {
        var first = value.AsSpan().TrimStart();
        if (first.Length > 0 && ("=+-@".Contains(first[0]) || "\t\r\n".Contains(value[0])))
        value = "'" + value;
        return "\"" + value.Replace("\"", "\"\"") + "\"";
    }
}
