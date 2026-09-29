namespace LearnEnglish.Api.Domain.Entities;

public class AudioBlitzQuestion
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TopicId { get; set; }
    public Topic Topic { get; set; } = null!;
    public Guid WordId { get; set; }
    public Word Word { get; set; } = null!;
    public string AudioUrl { get; set; } = string.Empty;
    public string? SlowAudioUrl { get; set; }
    public string Phonetic { get; set; } = string.Empty;
    public string TargetWord { get; set; } = string.Empty;
    public string PartOfSpeech { get; set; } = string.Empty;
    public string DefinitionVi { get; set; } = string.Empty;
    public string ContextSentence { get; set; } = string.Empty;
    public string DistractorLetters { get; set; } = "ETAOIN";
    public string DifficultyLevel { get; set; } = "Easy";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
