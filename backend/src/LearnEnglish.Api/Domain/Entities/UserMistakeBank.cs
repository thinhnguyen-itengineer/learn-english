namespace LearnEnglish.Api.Domain.Entities;

public class UserMistakeBank
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string QuestionId { get; set; } = string.Empty;
    public string OriginGameType { get; set; } = string.Empty;
    public string SkillType { get; set; } = string.Empty; // Listening, Reading, Writing, Speaking
    public string Prompt { get; set; } = string.Empty;
    public string? Phonetic { get; set; }
    public string? AudioUrl { get; set; }
    public string? ContextSentence { get; set; }
    public string CorrectAnswer { get; set; } = string.Empty;
    public string WrongAttemptsJson { get; set; } = "[]";
    public string? Explanation { get; set; }
    public decimal EaseFactor { get; set; } = 2.50m;
    public int IntervalDays { get; set; } = 1;
    public int RepetitionCount { get; set; } = 0;
    public int ConsecutiveSuccesses { get; set; } = 0;
    public string Status { get; set; } = "Learning"; // Learning, Reviewing, Mastered
    public int? LastEvaluatedQuality { get; set; }
    public DateTime NextReviewDate { get; set; } = DateTime.UtcNow;
    public DateTime LastFailedAt { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual User User { get; set; } = null!;
}
