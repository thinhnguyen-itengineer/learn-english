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

// 4. Audio Blitz DTOs
public record AudioBlitzItemDto
{
    public string QuestionId { get; init; } = string.Empty;
    public string TargetWord { get; init; } = string.Empty;
    public string AudioUrl { get; init; } = string.Empty;
    public string? SlowAudioUrl { get; init; }
    public string Phonetic { get; init; } = string.Empty;
    public string PartOfSpeech { get; init; } = string.Empty;
    public string DefinitionVi { get; init; } = string.Empty;
    public string ContextSentence { get; init; } = string.Empty;
    public int TargetWordLength { get; init; }
    public List<string> LetterBank { get; init; } = new();
    public int TimeLimitSeconds { get; init; } = 15;
}

public record AudioBlitzInitResponse
{
    public Guid SessionId { get; init; }
    public string GameType => "AudioBlitz";
    public int InitialLives { get; init; } = 3;
    public List<AudioBlitzItemDto> Items { get; init; } = new();
}

// 5. Cloze Master DTOs
public record ClozeOptionDto
{
    public string Id { get; init; } = string.Empty;
    public string Word { get; init; } = string.Empty;
    public string DefinitionVi { get; init; } = string.Empty;
}

public record ClozeQuestionDto
{
    public string QuestionId { get; init; } = string.Empty;
    public string ContextSentence { get; init; } = string.Empty;
    public string SentenceTranslationVi { get; init; } = string.Empty;
    public string PartOfSpeechHint { get; init; } = string.Empty;
    public string CorrectWord { get; init; } = string.Empty;
    public List<ClozeOptionDto> Options { get; init; } = new();
    public string ExplanationText { get; init; } = string.Empty;
}

public record ClozeMasterInitResponse
{
    public Guid SessionId { get; init; }
    public string GameType => "ClozeMaster";
    public int TimePerQuestionSeconds { get; init; } = 20;
    public int TotalQuestions { get; init; } = 10;
    public List<ClozeQuestionDto> Questions { get; init; } = new();
}

// 6. Grammar Detective DTOs
public record GrammarTokenDto
{
    public int Index { get; init; }
    public string Text { get; init; } = string.Empty;
}

public record GrammarDetectiveCaseDto
{
    public string CaseId { get; init; } = string.Empty;
    public string CaseTitle { get; init; } = string.Empty;
    public string RawSentence { get; init; } = string.Empty;
    public List<GrammarTokenDto> Tokens { get; init; } = new();
    public int ErrorTokenIndex { get; init; }
    public string ErrorTokenText { get; init; } = string.Empty;
    public List<string> CorrectionOptions { get; init; } = new();
    public string CorrectReplacement { get; init; } = string.Empty;
    public string GrammarRuleExplanation { get; init; } = string.Empty;
}

public record GrammarDetectiveInitResponse
{
    public Guid SessionId { get; init; }
    public string GameType => "GrammarDetective";
    public int InitialMagnifiers { get; init; } = 3;
    public int TimePerCaseSeconds { get; init; } = 60;
    public int TotalCases { get; init; } = 5;
    public List<GrammarDetectiveCaseDto> Cases { get; init; } = new();
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
