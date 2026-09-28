namespace LearnEnglish.Api.Domain.Entities;

public class Word
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TopicId { get; set; }
    public string Term { get; set; } = string.Empty;
    public string? Phonetic { get; set; }
    public string? PartOfSpeech { get; set; }
    public string DefinitionVi { get; set; } = string.Empty;
    public string? ExampleSentence { get; set; }
    public string? AudioUrl { get; set; }
    public string DifficultyLevel { get; set; } = "Easy";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Topic Topic { get; set; } = null!;
}
