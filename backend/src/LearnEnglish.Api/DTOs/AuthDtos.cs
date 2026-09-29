namespace LearnEnglish.Api.DTOs;

public record GuestAuthResponse
{
    public string Token { get; init; } = string.Empty;
    public DateTime ExpiresAt { get; init; }
    public UserSummaryDto User { get; init; } = null!;
}

public record UserSummaryDto
{
    public Guid Id { get; init; }
    public string Username { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
    public bool IsGuest { get; init; }
    public int TotalXp { get; init; }
    public int Coins { get; init; }
    public int CurrentLevel { get; init; }
    public int CurrentStreak { get; init; }
}

public record UserProfileDto
{
    public Guid UserId { get; init; }
    public string Username { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
    public string? AvatarUrl { get; init; }
    public int TotalXp { get; init; }
    public int Coins { get; init; }
    public int CurrentLevel { get; init; }
    public int CurrentLevelXp { get; init; }
    public int NextLevelXp { get; init; }
    public int CurrentStreak { get; init; }
    public int HighestStreak { get; init; }
    public int StreakFreezeCount { get; init; }
    public int DailyXpEarned { get; init; }
    public int DailyXpCap { get; init; } = 1000;
}
