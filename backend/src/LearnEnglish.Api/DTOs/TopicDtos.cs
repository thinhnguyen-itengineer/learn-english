namespace LearnEnglish.Api.DTOs;

public record TopicDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string IconName { get; init; } = "BookOpen";
    public string DifficultyLevel { get; init; } = "Easy";
    public int WordCount { get; init; }
    public int SentenceCount { get; init; }
}

public record WordDto
{
    public Guid Id { get; init; }
    public string Term { get; init; } = string.Empty;
    public string? Phonetic { get; init; }
    public string? PartOfSpeech { get; init; }
    public string DefinitionVi { get; init; } = string.Empty;
    public string? ExampleSentence { get; init; }
    public string? AudioUrl { get; init; }
}

public record SentenceDto
{
    public Guid Id { get; init; }
    public string EnglishText { get; init; } = string.Empty;
    public string VietnameseTranslation { get; init; } = string.Empty;
    public List<string> Tokens { get; init; } = new();
    public string? HintText { get; init; }
}
