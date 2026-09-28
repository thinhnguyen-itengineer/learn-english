namespace LearnEnglish.Api.Domain.Entities;

public class Sentence
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TopicId { get; set; }
    public string EnglishText { get; set; } = string.Empty;
    public string VietnameseTranslation { get; set; } = string.Empty;
    public List<string> Tokens { get; set; } = new();
    public string DifficultyLevel { get; set; } = "Easy";
    public string? HintText { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Topic Topic { get; set; } = null!;
}
