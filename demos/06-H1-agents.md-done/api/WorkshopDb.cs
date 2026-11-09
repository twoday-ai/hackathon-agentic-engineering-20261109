using Microsoft.EntityFrameworkCore;

namespace Workshop.Api;

public enum RequestStatus { New, Reviewed }

public sealed class ProjectRequest
{
    public Guid Id { get; set; }
    public string Municipality { get; set; } = "";
    public string ProjectTitle { get; set; } = "";
    public string Description { get; set; } = "";
    public bool BudgetAttached { get; set; }
    public RequestStatus Status { get; set; } = RequestStatus.New;
    // Supplied persistence detail; not an extra business workflow state.
    public int Version { get; set; }
    public List<ActivityEntry> Activity { get; set; } = [];
}

public sealed class ActivityEntry
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RequestId { get; set; }
    public string Action { get; set; } = "";
    public string Actor { get; set; } = "Request officer";
    public DateTimeOffset OccurredAt { get; set; } = DateTimeOffset.UtcNow;
    public string CorrelationId { get; set; } = "";
}

public sealed class WorkshopDb(DbContextOptions<WorkshopDb> options) : DbContext(options)
{
    public DbSet<ProjectRequest> Requests => Set<ProjectRequest>();
    public DbSet<ActivityEntry> Activities => Set<ActivityEntry>();

    protected override void OnModelCreating(ModelBuilder model)
    {
        model.Entity<ProjectRequest>().HasKey(x => x.Id);
        model.Entity<ProjectRequest>().Property(x => x.Version).IsConcurrencyToken();
        model.Entity<ProjectRequest>().Property(x => x.Status)
            .HasConversion<string>().IsConcurrencyToken();
        model.Entity<ProjectRequest>().HasMany(x => x.Activity).WithOne()
            .HasForeignKey(x => x.RequestId).OnDelete(DeleteBehavior.Cascade);
        model.Entity<ActivityEntry>().HasKey(x => x.Id);
        // ActivityEntry creates its GUID in the application; new entries must be inserted.
        model.Entity<ActivityEntry>().Property(x => x.Id).ValueGeneratedNever();
    }
}

public static class SeedData
{
    public static readonly Guid Fjordby = Guid.Parse("11111111-1111-1111-1111-111111111111");
    public static readonly Guid Sodal = Guid.Parse("22222222-2222-2222-2222-222222222222");
    public static readonly Guid Vesteng = Guid.Parse("33333333-3333-3333-3333-333333333333");

    public static async Task EnsureSeededAsync(WorkshopDb db)
    {
        if (await db.Requests.AnyAsync()) return;
        db.Requests.AddRange(
        new ProjectRequest { Id = Fjordby, Municipality = "Fjordby", ProjectTitle = "School renovation",
            Description = "Improve insulation and lighting in the local school.", BudgetAttached = false },
        new ProjectRequest { Id = Sodal, Municipality = "Sødal", ProjectTitle = "Library refurbishment",
            Description = "Refresh the shared reading room.", BudgetAttached = true },
        new ProjectRequest { Id = Vesteng, Municipality = "Vesteng", ProjectTitle = "",
            Description = "Update the sports centre entrance.", BudgetAttached = true });
        await db.SaveChangesAsync();
    }
}
