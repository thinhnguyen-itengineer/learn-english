namespace LearnEnglish.Api.Domain.Entities;

public class MatchSession
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? SeasonId { get; set; }
    public string MatchType { get; set; } = "SpeedWordMatch";
    public string Status { get; set; } = "Waiting"; // Waiting, InProgress, Finished, Aborted
    public string QuestionSeed { get; set; } = string.Empty;
    public Guid? TopicId { get; set; }
    public Guid? WinnerId { get; set; }
    public string? FinishReason { get; set; } // NormalCompletion, Timeout, Forfeit, DisconnectTimeout
    public int DurationSeconds { get; set; } = 0;
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? EndedAt { get; set; }

    public virtual Season? Season { get; set; }
    public virtual Topic? Topic { get; set; }
    public virtual ICollection<MatchParticipant> Participants { get; set; } = new List<MatchParticipant>();
}
