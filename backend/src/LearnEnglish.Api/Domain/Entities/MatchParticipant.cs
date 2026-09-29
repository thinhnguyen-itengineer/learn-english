namespace LearnEnglish.Api.Domain.Entities;

public class MatchParticipant
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid MatchId { get; set; }
    public Guid UserId { get; set; }
    public bool IsBot { get; set; } = false;
    public int FinalScore { get; set; } = 0;
    public int CorrectCount { get; set; } = 0;
    public int WrongCount { get; set; } = 0;
    public int MaxCombo { get; set; } = 0;
    public int FinishTimeMs { get; set; } = 0;
    public int InitialTrophy { get; set; } = 0;
    public int TrophyChange { get; set; } = 0;
    public int EarnedXp { get; set; } = 0;
    public MatchResult Result { get; set; } = MatchResult.Pending;
    public bool IsForfeit { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual MatchSession Match { get; set; } = null!;
}
