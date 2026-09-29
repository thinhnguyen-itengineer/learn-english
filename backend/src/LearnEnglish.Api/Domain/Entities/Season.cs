namespace LearnEnglish.Api.Domain.Entities;

public class Season
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public int SeasonNumber { get; set; }
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
    public bool IsActive { get; set; } = false;
    public string RewardsConfig { get; set; } = "{}";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<MatchSession> MatchSessions { get; set; } = new List<MatchSession>();
    public virtual ICollection<LeaderboardSnapshot> Snapshots { get; set; } = new List<LeaderboardSnapshot>();
}
