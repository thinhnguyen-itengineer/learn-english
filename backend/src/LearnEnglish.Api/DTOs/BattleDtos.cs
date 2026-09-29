using LearnEnglish.Api.Domain.Entities;

namespace LearnEnglish.Api.DTOs;

public class UserRankProfileDto
{
    public Guid UserId { get; set; }
    public int Trophy { get; set; }
    public int HighestTrophy { get; set; }
    public string Tier { get; set; } = "Bronze";
    public string Division { get; set; } = "III";
    public int WinStreak { get; set; }
    public int HighestWinStreak { get; set; }
    public int ProtectionGamesLeft { get; set; }
    public int TotalMatches { get; set; }
    public int Wins { get; set; }
    public int Losses { get; set; }
    public int Draws { get; set; }
    public double WinRate { get; set; }
    public DateTime? PenaltyUntil { get; set; }
}

public class MatchPlayerDto
{
    public Guid UserId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public string Tier { get; set; } = "Bronze";
    public string Division { get; set; } = "III";
    public int CurrentTrophy { get; set; }
    public bool IsBot { get; set; }
}

public class WordPairDto
{
    public string Id { get; set; } = string.Empty;
    public string English { get; set; } = string.Empty;
    public string Vietnamese { get; set; } = string.Empty;
}

public class MatchFoundPayload
{
    public Guid MatchId { get; set; }
    public int DurationSeconds { get; set; } = 60;
    public Guid TopicId { get; set; }
    public string TopicName { get; set; } = string.Empty;
    public MatchPlayerDto Opponent { get; set; } = null!;
    public List<WordPairDto> Pairs { get; set; } = new();
}

public class PlayerProgressDto
{
    public Guid MatchId { get; set; }
    public int CurrentScore { get; set; }
    public int CompletedPairsCount { get; set; }
    public int CurrentCombo { get; set; }
    public bool IsCompleted { get; set; }
}

public class OpponentProgressPayload
{
    public Guid MatchId { get; set; }
    public Guid OpponentUserId { get; set; }
    public int CurrentScore { get; set; }
    public int CompletedPairsCount { get; set; }
    public int CurrentCombo { get; set; }
    public bool IsCompleted { get; set; }
}

public class FinishMatchRequest
{
    public Guid MatchId { get; set; }
    public int TotalTimeMs { get; set; }
}

public class ForfeitMatchRequest
{
    public Guid MatchId { get; set; }
}

public class ReconnectMatchRequest
{
    public Guid MatchId { get; set; }
}

public class JoinQueueRequest
{
    public Guid? PreferredTopicId { get; set; }
}

public class QueueStatusPayload
{
    public int QueueTimeSeconds { get; set; }
    public int SearchRangeTrophy { get; set; }
}

public class BattleStartedPayload
{
    public DateTime StartTimeUtc { get; set; } = DateTime.UtcNow;
}

public class DisconnectGracePayload
{
    public int GracePeriodSeconds { get; set; } = 15;
}

public class MatchResultPayload
{
    public Guid MatchId { get; set; }
    public bool IsWinner { get; set; }
    public bool IsDraw { get; set; }
    public string FinishReason { get; set; } = "NormalCompletion";
    public int MyFinalScore { get; set; }
    public int OpponentFinalScore { get; set; }
    public int TrophyChange { get; set; }
    public int NewTrophy { get; set; }
    public string NewTier { get; set; } = "Bronze";
    public string NewDivision { get; set; } = "III";
    public int EarnedXp { get; set; }
    public int WinStreak { get; set; }
    public bool IsPromotion { get; set; }
    public bool IsDemoted { get; set; }
}

public class SeasonInfoDto
{
    public Guid Id { get; set; }
    public int SeasonNumber { get; set; }
    public string Name { get; set; } = string.Empty;
    public int DaysRemaining { get; set; }
}

public class BattleLeaderboardItemDto
{
    public int RankPosition { get; set; }
    public Guid UserId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public string Tier { get; set; } = "Bronze";
    public string Division { get; set; } = "III";
    public int Trophy { get; set; }
    public double WinRate { get; set; }
    public int WinStreak { get; set; }
}

public class BattleLeaderboardResponse
{
    public SeasonInfoDto? Season { get; set; }
    public BattleLeaderboardItemDto? MyRank { get; set; }
    public List<BattleLeaderboardItemDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
}

public class OpponentSummaryDto
{
    public string DisplayName { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public string Tier { get; set; } = "Bronze";
    public string Division { get; set; } = "III";
}

public class MatchHistoryItemDto
{
    public Guid MatchId { get; set; }
    public string TopicName { get; set; } = string.Empty;
    public OpponentSummaryDto Opponent { get; set; } = null!;
    public string Result { get; set; } = "Pending";
    public int MyScore { get; set; }
    public int OpponentScore { get; set; }
    public int TrophyChange { get; set; }
    public int DurationSeconds { get; set; }
    public DateTime PlayedAt { get; set; }
}

public class MatchHistorySummaryDto
{
    public int TotalMatches { get; set; }
    public int Wins { get; set; }
    public int Losses { get; set; }
    public int Draws { get; set; }
    public double WinRate { get; set; }
    public int CurrentWinStreak { get; set; }
    public int HighestWinStreak { get; set; }
    public int CurrentTrophy { get; set; }
    public int HighestTrophy { get; set; }
    public string CurrentTier { get; set; } = "Bronze";
    public string CurrentDivision { get; set; } = "III";
}

public class MatchHistoryResponse
{
    public MatchHistorySummaryDto Summary { get; set; } = new();
    public List<MatchHistoryItemDto> History { get; set; } = new();
}
