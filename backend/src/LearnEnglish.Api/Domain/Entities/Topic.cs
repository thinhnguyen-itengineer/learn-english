namespace LearnEnglish.Api.Domain.Entities;

public class Topic
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string IconName { get; set; } = "BookOpen";
    public string DifficultyLevel { get; set; } = "Easy";
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Word> Words { get; set; } = new List<Word>();
    public ICollection<Sentence> Sentences { get; set; } = new List<Sentence>();
    public ICollection<GameSession> GameSessions { get; set; } = new List<GameSession>();
}
