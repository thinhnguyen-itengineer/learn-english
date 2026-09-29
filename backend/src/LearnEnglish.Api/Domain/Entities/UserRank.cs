namespace LearnEnglish.Api.Domain.Entities;

public class UserRank
{
    public Guid UserId { get; set; }
    public int Trophy { get; set; } = 0;
    public int HighestTrophy { get; set; } = 0;
    public RankTier Tier { get; set; } = RankTier.Bronze;
    public string Division { get; set; } = "III";
    public int WinStreak { get; set; } = 0;
    public int HighestWinStreak { get; set; } = 0;
    public int ProtectionGamesLeft { get; set; } = 0;
    public int TotalMatches { get; set; } = 0;
    public int Wins { get; set; } = 0;
    public int Losses { get; set; } = 0;
    public int Draws { get; set; } = 0;
    public int AbandonCount { get; set; } = 0;
    public DateTime? PenaltyUntil { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public virtual User User { get; set; } = null!;
}
