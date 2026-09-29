namespace LearnEnglish.Api.Domain.Entities;

public class UserHabitState
{
    public Guid UserId { get; set; }
    public int CurrentStreak { get; set; } = 0;
    public int MaxStreak { get; set; } = 0;
    public int StreakFreezeCount { get; set; } = 0; // 0 to 2
    public DateOnly? LastActiveDate { get; set; }
    public DateTime? StreakBrokenAt { get; set; }
    public bool EarlyBirdClaimed { get; set; } = false;
    public bool MiddayClaimed { get; set; } = false;
    public bool NightOwlClaimed { get; set; } = false;
    public DateOnly? ActiveClaimedDate { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual User User { get; set; } = null!;
}
