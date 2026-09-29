namespace LearnEnglish.Api.Domain.Entities;

public class TokenTransaction
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }

    public int Amount { get; set; }
    public int BalanceAfter { get; set; }
    public string TransactionType { get; set; } = string.Empty; // earn_lesson, earn_game, earn_battle, earn_quest, earn_streak, spend_shop_item, spend_preset_slot, admin_adjustment
    public string? SourceCategory { get; set; }
    public string? ReferenceId { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public UserProfile Profile { get; set; } = null!;
}
