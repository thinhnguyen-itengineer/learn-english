namespace LearnEnglish.Api.Domain.Entities;

public class LeaderboardSnapshot
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? SeasonId { get; set; }
    public string Type { get; set; } = "Weekly"; // Weekly, SeasonEnd, AllTime
    public int RankPosition { get; set; }
    public Guid UserId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Tier { get; set; } = "Bronze";
    public int Trophy { get; set; }
    public decimal WinRatePercentage { get; set; } = 0.00m;
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;

    public virtual Season? Season { get; set; }
    public virtual User? User { get; set; }
}
