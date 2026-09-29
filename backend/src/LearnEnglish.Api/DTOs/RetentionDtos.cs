namespace LearnEnglish.Api.DTOs;

#region SRS Clinic DTOs
public class MistakesSummaryResponse
{
    public int TotalDueToday { get; set; }
    public int LearningCount { get; set; }
    public int ReviewingCount { get; set; }
    public int MasteredCount { get; set; }
    public Dictionary<string, int> BySkill { get; set; } = new();
}

public class ClinicSessionResponse
{
    public string SessionId { get; set; } = Guid.NewGuid().ToString();
    public List<ClinicCardDto> Cards { get; set; } = new();
}

public class ClinicCardDto
{
    public Guid Id { get; set; }
    public string QuestionId { get; set; } = string.Empty;
    public string OriginGameType { get; set; } = string.Empty;
    public string SkillType { get; set; } = string.Empty;
    public string Prompt { get; set; } = string.Empty;
    public string? Phonetic { get; set; }
    public string? AudioUrl { get; set; }
    public string? ContextSentence { get; set; }
    public string CorrectAnswer { get; set; } = string.Empty;
    public List<string> WrongAttempts { get; set; } = new();
    public List<string> Options { get; set; } = new();
    public int TimeLimitSeconds { get; set; } = 15;
}

public class ClinicSubmitRequest
{
    public Guid MistakeId { get; set; }
    public string SelectedAnswer { get; set; } = string.Empty;
    public int ResponseTimeMs { get; set; }
    public bool UsedHint { get; set; }
}

public class ClinicSubmitResponse
{
    public Guid MistakeId { get; set; }
    public bool IsCorrect { get; set; }
    public int QualityScore { get; set; }
    public decimal NewEaseFactor { get; set; }
    public int NewIntervalDays { get; set; }
    public DateTime NextReviewDate { get; set; }
    public bool IsGraduated { get; set; }
    public int AwardedCoins { get; set; }
    public int AwardedXp { get; set; }
    public string CorrectAnswer { get; set; } = string.Empty;
    public string? Explanation { get; set; }
}

public class CaptureMistakeRequest
{
    public string QuestionId { get; set; } = string.Empty;
    public string OriginGameType { get; set; } = string.Empty;
    public string SkillType { get; set; } = "General";
    public string Prompt { get; set; } = string.Empty;
    public string? Phonetic { get; set; }
    public string? AudioUrl { get; set; }
    public string? ContextSentence { get; set; }
    public string CorrectAnswer { get; set; } = string.Empty;
    public string UserWrongAnswer { get; set; } = string.Empty;
    public string? Explanation { get; set; }
}
#endregion

#region Habits & Chests DTOs
public class HabitSummaryResponse
{
    public int CurrentStreak { get; set; }
    public int MaxStreak { get; set; }
    public int StreakFreezeCount { get; set; }
    public int MaxAllowedFreeze { get; set; } = 2;
    public bool IsStreakProtectedToday { get; set; }
    public bool IsStreakInGracePeriod { get; set; }
    public DateTime? GracePeriodExpiresAt { get; set; }
    public ChestsOverviewDto Chests { get; set; } = new();
}

public class ChestsOverviewDto
{
    public ChestStatusDto EarlyBird { get; set; } = new();
    public ChestStatusDto Midday { get; set; } = new();
    public ChestStatusDto NightOwl { get; set; } = new();
}

public class ChestStatusDto
{
    public bool Available { get; set; }
    public bool Claimed { get; set; }
    public string Window { get; set; } = string.Empty;
}

public class BuyFreezeResponse
{
    public bool Success { get; set; }
    public int NewStreakFreezeCount { get; set; }
    public int RemainingCoins { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class ClaimChestRequest
{
    public string ChestType { get; set; } = string.Empty; // EarlyBird, Midday, NightOwl
}

public class ClaimChestResponse
{
    public string ChestType { get; set; } = string.Empty;
    public int AwardedCoins { get; set; }
    public int AwardedXp { get; set; }
    public int AwardedBattleTickets { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class RepairStreakResponse
{
    public bool Success { get; set; }
    public int RestoredStreak { get; set; }
    public int RemainingCoins { get; set; }
    public string Message { get; set; } = string.Empty;
}
#endregion

#region Weekly Leagues DTOs
public class WeeklyLeagueCurrentResponse
{
    public int LeagueTier { get; set; }
    public string LeagueTierName { get; set; } = "Bronze";
    public string RoomCode { get; set; } = string.Empty;
    public long TimeRemainingSeconds { get; set; }
    public int CurrentUserRank { get; set; }
    public int CurrentUserXp { get; set; }
    public List<LeagueMemberDto> Leaderboard { get; set; } = new();
}

public class LeagueMemberDto
{
    public int Rank { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public int WeeklyXp { get; set; }
    public string Zone { get; set; } = "Safe"; // Promotion, Safe, Demotion
    public bool IsCurrentUser { get; set; }
}
#endregion

#region Study Squads DTOs
public class MySquadResponse
{
    public Guid SquadId { get; set; }
    public string SquadCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int MemberCount { get; set; }
    public int MaxMembers { get; set; } = 10;
    public int WeeklyGoalXp { get; set; } = 5000;
    public int CurrentWeeklyXp { get; set; }
    public int CurrentUserContributionXp { get; set; }
    public bool IsEligibleForReward { get; set; }
    public bool HasClaimedReward { get; set; }
    public List<SquadMemberDto> Members { get; set; } = new();
}

public class SquadMemberDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Role { get; set; } = "Member";
    public int WeeklyXp { get; set; }
    public bool HasReachedThreshold { get; set; }
    public bool IsCurrentUser { get; set; }
}

public class CreateSquadRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class JoinSquadRequest
{
    public string SquadCode { get; set; } = string.Empty;
}

public class ClaimSquadRewardResponse
{
    public bool Success { get; set; }
    public int AwardedCoins { get; set; }
    public int AwardedBoosterHours { get; set; }
    public int AwardedFreeze { get; set; }
    public string Message { get; set; } = string.Empty;
}
#endregion

#region Async Challenges DTOs
public class CreateChallengeRequest
{
    public string GameType { get; set; } = string.Empty;
    public int Score { get; set; }
    public object? QuestionSnapshot { get; set; }
}

public class CreateChallengeResponse
{
    public string ChallengeToken { get; set; } = string.Empty;
    public string ShareUrl { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}

public class ChallengeDetailResponse
{
    public string ChallengeToken { get; set; } = string.Empty;
    public Guid CreatorId { get; set; }
    public string CreatorName { get; set; } = string.Empty;
    public string GameType { get; set; } = string.Empty;
    public int CreatorScore { get; set; }
    public object? QuestionSnapshot { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsExpired { get; set; }
    public int AttemptCount { get; set; }
    public List<ChallengeAttemptDto> Attempts { get; set; } = new();
}

public class ChallengeAttemptDto
{
    public string ParticipantName { get; set; } = string.Empty;
    public int Score { get; set; }
    public bool IsWinner { get; set; }
    public DateTime CompletedAt { get; set; }
}

public class SubmitChallengeAttemptRequest
{
    public string ParticipantName { get; set; } = string.Empty;
    public int Score { get; set; }
}

public class SubmitChallengeAttemptResponse
{
    public bool IsWinner { get; set; }
    public int CreatorScore { get; set; }
    public int UserScore { get; set; }
    public int AwardedCoins { get; set; }
    public string Message { get; set; } = string.Empty;
}
#endregion

#region Speech & Phoneme Evaluation DTOs
public class EvaluatePhonemeRequest
{
    public string ReferenceText { get; set; } = string.Empty;
    public string? ReferenceIpa { get; set; }
    public string? AudioData { get; set; } // Base64 audio chunk or speech recording
    public string? UserTranscription { get; set; } // Text from Web Speech API
}

public class PhonemeScoreDto
{
    public string Phoneme { get; set; } = string.Empty;
    public int Score { get; set; } // 0 - 100
    public string Status { get; set; } = "green"; // green, yellow, red
    public string? Feedback { get; set; }
}

public class EvaluatePhonemeResponse
{
    public int OverallScore { get; set; }
    public List<PhonemeScoreDto> Phonemes { get; set; } = new();
    public string ActionableTip { get; set; } = string.Empty;
    public string RecognizedText { get; set; } = string.Empty;
}

public class SpeechRoleplayRequest
{
    public string Scenario { get; set; } = "CoffeeShop";
    public List<RoleplayTurnDto> History { get; set; } = new();
    public string UserInputText { get; set; } = string.Empty;
}

public class RoleplayTurnDto
{
    public string Speaker { get; set; } = "user"; // ai, user
    public string Text { get; set; } = string.Empty;
}

public class SpeechRoleplayResponse
{
    public string AiResponseText { get; set; } = string.Empty;
    public int FluencyScore { get; set; }
    public int GrammarAccuracyScore { get; set; }
    public string VocabularyFeedback { get; set; } = string.Empty;
    public bool IsScenarioCompleted { get; set; }
}
#endregion
