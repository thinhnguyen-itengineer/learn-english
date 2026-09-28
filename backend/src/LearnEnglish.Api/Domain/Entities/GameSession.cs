using LearnEnglish.Api.Domain.Enums;

namespace LearnEnglish.Api.Domain.Entities;

public class GameSession
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public GameType GameType { get; set; }
    public Guid TopicId { get; set; }
    public int Score { get; set; }
    public int XpEarned { get; set; }
    public int DurationSeconds { get; set; }
    public decimal AccuracyRate { get; set; }
    public int MaxCombo { get; set; }
    public GameSessionStatus Status { get; set; } = GameSessionStatus.InProgress;
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    public User User { get; set; } = null!;
    public Topic Topic { get; set; } = null!;
}
