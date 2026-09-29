namespace LearnEnglish.Api.Domain.Entities;

public class WeeklyLeagueMember
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid LeagueId { get; set; }
    public Guid UserId { get; set; }
    public int WeeklyXp { get; set; } = 0;
    public int? FinalRank { get; set; }
    public string OutcomeStatus { get; set; } = "Pending"; // Pending, Promoted, Safe, Demoted
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    public virtual WeeklyLeague League { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}
