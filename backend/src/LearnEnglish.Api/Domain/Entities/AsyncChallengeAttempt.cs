namespace LearnEnglish.Api.Domain.Entities;

public class AsyncChallengeAttempt
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ChallengeId { get; set; }
    public Guid? ParticipantUserId { get; set; }
    public string ParticipantName { get; set; } = string.Empty;
    public int Score { get; set; }
    public bool IsWinner { get; set; } = false;
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

    public virtual AsyncChallenge Challenge { get; set; } = null!;
    public virtual User? ParticipantUser { get; set; }
}
