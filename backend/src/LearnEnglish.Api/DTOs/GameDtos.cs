using System.Text.Json.Serialization;
using LearnEnglish.Api.Domain.Enums;

namespace LearnEnglish.Api.DTOs;

public record StartGameRequest
{
    public GameType GameType { get; init; }
    public Guid TopicId { get; init; }
    public string DifficultyLevel { get; init; } = "Easy";
}

public record WordMatchCardDto
{
    public string Id { get; init; } = string.Empty;
    public string PairId { get; init; } = string.Empty;
    public string Type { get; init; } = "EN"; // "EN" or "VI"
    public string Content { get; init; } = string.Empty;
    public string? SubContent { get; init; }
}

public record WordMatchInitResponse
{
    public Guid SessionId { get; init; }
    public string GameType => "WordMatch";
    public int TimeLimitSeconds { get; init; } = 60;
    public List<WordMatchCardDto> Cards { get; init; } = new();
}

public record SpeedFallingWordItemDto
{
    public string WordId { get; init; } = string.Empty;
    public string Term { get; init; } = string.Empty;
    public string? Phonetic { get; init; }
    public string CorrectDefinitionVi { get; init; } = string.Empty;
    public List<string> Options { get; init; } = new();
    public int BaseFallDurationMs { get; init; } = 5000;
}

public record SpeedFallingInitResponse
{
    public Guid SessionId { get; init; }
    public string GameType => "SpeedFalling";
    public int InitialLives { get; init; } = 3;
    public List<SpeedFallingWordItemDto> Words { get; init; } = new();
}

public record TokenChipDto
{
    public string Id { get; init; } = string.Empty;
    public string Word { get; init; } = string.Empty;
}

public record SentenceScrambleItemDto
{
    public string SentenceId { get; init; } = string.Empty;
    public string VietnameseTranslation { get; init; } = string.Empty;
    public List<TokenChipDto> ShuffledTokens { get; init; } = new();
    public List<string> CorrectOrderTokens { get; init; } = new();
    public string? HintText { get; init; }
}

public record SentenceScrambleInitResponse
{
    public Guid SessionId { get; init; }
    public string GameType => "SentenceScramble";
    public int TotalTimeLimitSeconds { get; init; } = 180;
    public List<SentenceScrambleItemDto> Sentences { get; init; } = new();
}

public record CompleteSessionRequest
{
    public Guid SessionId { get; init; }
    public int Score { get; init; }
    public int DurationSeconds { get; init; }
    public int TotalAttempts { get; init; }
    public int CorrectAnswers { get; init; }
    public int MaxCombo { get; init; }
    public string Status { get; init; } = "Completed";
}

public record UnlockedBadgeDto
{
    public string BadgeCode { get; init; } = string.Empty;
    public string BadgeName { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string IconUrl { get; init; } = string.Empty;
}

public record CompleteSessionResponse
{
    public Guid SessionId { get; init; }
    public int Score { get; init; }
    public int XpEarned { get; init; }
    public decimal AccuracyRate { get; init; }
    public bool IsNewLevel { get; init; }
    public int? NewLevel { get; init; }
    public int TotalXp { get; init; }
    public int CurrentStreak { get; init; }
    public bool StreakIncrementedToday { get; init; }
    public List<UnlockedBadgeDto> UnlockedBadges { get; init; } = new();
}
