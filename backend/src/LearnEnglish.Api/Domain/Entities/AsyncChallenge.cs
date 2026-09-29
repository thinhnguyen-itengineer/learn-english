namespace LearnEnglish.Api.Domain.Entities;

public class AsyncChallenge
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string ChallengeToken { get; set; } = string.Empty;
    public Guid CreatorUserId { get; set; }
    public string GameType { get; set; } = string.Empty;
    public int CreatorScore { get; set; }
    public string QuestionSnapshotJson { get; set; } = "[]";
    public int AttemptCount { get; set; } = 0;
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual User Creator { get; set; } = null!;
    public virtual ICollection<AsyncChallengeAttempt> Attempts { get; set; } = new List<AsyncChallengeAttempt>();
}
