namespace LearnEnglish.Api.Domain.Entities;

public class ClozeDistractorItem
{
    public string Word { get; set; } = string.Empty;
    public string DefinitionVi { get; set; } = string.Empty;
}

public class ClozeQuestion
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TopicId { get; set; }
    public Topic Topic { get; set; } = null!;
    public string ContextSentence { get; set; } = string.Empty;
    public string SentenceTranslationVi { get; set; } = string.Empty;
    public string PartOfSpeechHint { get; set; } = string.Empty;
    public string CorrectWord { get; set; } = string.Empty;
    public string CorrectDefinitionVi { get; set; } = string.Empty;
    public List<ClozeDistractorItem> Distractors { get; set; } = new();
    public string ExplanationText { get; set; } = string.Empty;
    public string DifficultyLevel { get; set; } = "Easy";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
