namespace LearnEnglish.Api.Domain.Entities;

public class UserProfile
{
    public Guid UserId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public int TotalXp { get; set; }
    public int CurrentLevel { get; set; } = 1;
    public int CurrentStreak { get; set; }
    public int HighestStreak { get; set; }
    public DateOnly? LastActiveDate { get; set; }
    public int StreakFreezeCount { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
