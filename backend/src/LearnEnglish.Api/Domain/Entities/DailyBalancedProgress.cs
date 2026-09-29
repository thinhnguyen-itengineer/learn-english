namespace LearnEnglish.Api.Domain.Entities;

public class DailyBalancedProgress
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public DateOnly PracticeDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
    public bool CompletedListening { get; set; }
    public bool CompletedReading { get; set; }
    public bool CompletedWriting { get; set; }
    public bool CompletedSpeaking { get; set; }
    public bool BonusClaimed { get; set; }
    public DateTime? BonusClaimedAt { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual User User { get; set; } = null!;
}
