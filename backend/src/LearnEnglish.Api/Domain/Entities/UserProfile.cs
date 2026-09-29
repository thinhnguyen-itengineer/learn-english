namespace LearnEnglish.Api.Domain.Entities;

public class UserProfile
{
    public Guid UserId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public string CustomTitle { get; set; } = "Người Học Mới (Novice Learner)";
    public int TotalXp { get; set; }
    public int Coins { get; set; } = 350;
    public int TokenBalance { get; set; } = 350;
    public int TotalTokensEarned { get; set; } = 350;
    public int DailyTokensEarned { get; set; } = 0;
    public DateTime LastTokenResetAt { get; set; } = DateTime.UtcNow;
    public int CurrentLevel { get; set; } = 1;
    public int CurrentStreak { get; set; }
    public int HighestStreak { get; set; }
    public DateOnly? LastActiveDate { get; set; }
    public int StreakFreezeCount { get; set; }
    public int UnlockedPresetSlots { get; set; } = 1;
    public int ActivePresetSlot { get; set; } = 1;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public AvatarConfig? AvatarConfig { get; set; }
    public ICollection<UserInventory> InventoryItems { get; set; } = new List<UserInventory>();
    public ICollection<TokenTransaction> TokenTransactions { get; set; } = new List<TokenTransaction>();
    public ICollection<AvatarPreset> Presets { get; set; } = new List<AvatarPreset>();
}
