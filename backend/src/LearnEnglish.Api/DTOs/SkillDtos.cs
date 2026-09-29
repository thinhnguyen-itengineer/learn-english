namespace LearnEnglish.Api.DTOs;

public static class SkillDomainConstants
{
    public const string Listening = "LISTENING";
    public const string Reading = "READING";
    public const string Writing = "WRITING";
    public const string Speaking = "SPEAKING";
}

public class SkillDomainDto
{
    public string Code { get; set; } = null!; // LISTENING, READING, WRITING, SPEAKING
    public string NameVi { get; set; } = null!;
    public string NameEn { get; set; } = null!;
    public string? Description { get; set; }
    public string IconName { get; set; } = null!;
    public string ThemeColor { get; set; } = null!;
    public int DisplayOrder { get; set; }
    public decimal MasteryScore { get; set; } // 0.00 to 100.00
    public int TotalXp { get; set; }
    public int GamesPlayed { get; set; }
    public int PerfectGames { get; set; }
    public string BadgeLevel { get; set; } = "Bronze"; // Descriptive title e.g. "Master Decoder"
    public string BadgeTier { get; set; } = "Bronze"; // 'Bronze' | 'Silver' | 'Gold' | 'Diamond'
    public List<SkillDomainGameDto> Games { get; set; } = new();
}

public class SkillDomainGameDto
{
    public Guid Id { get; set; }
    public string SkillDomainCode { get; set; } = null!;
    public string GameTypeCode { get; set; } = null!;
    public string DisplayTitle { get; set; } = null!;
    public string DifficultyTier { get; set; } = "B1_B2";
    public bool IsPrimary { get; set; }
    public int DisplayOrder { get; set; }
}

public class SkillRadarDto
{
    public decimal Listening { get; set; }
    public decimal Reading { get; set; }
    public decimal Writing { get; set; }
    public decimal Speaking { get; set; }
    public string WeakestSkill { get; set; } = SkillDomainConstants.Speaking;
    public string StrongestSkill { get; set; } = SkillDomainConstants.Listening;
    public string RecommendedGameCode { get; set; } = "MINIMAL_PAIRS";
    public string RecommendedGameTitle { get; set; } = "Minimal Pairs Duel (Đấu Sĩ Cặp Âm)";
}

public class SkillsOverviewResponse
{
    public List<SkillDomainDto> Skills { get; set; } = new();
    public SkillRadarDto Radar { get; set; } = new();
}

public class DailyBalancedStatusDto
{
    public string PracticeDate { get; set; } = null!;
    public bool CompletedListening { get; set; }
    public bool CompletedReading { get; set; }
    public bool CompletedWriting { get; set; }
    public bool CompletedSpeaking { get; set; }
    public int CompletedCount { get; set; }
    public bool AllCompleted { get; set; }
    public bool BonusClaimed { get; set; }
    public int RewardCoins { get; set; } = 50;
    public int RewardXp { get; set; } = 100;
}

public class ClaimBonusResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public int RewardCoins { get; set; }
    public int RewardXp { get; set; }
    public int TotalCoins { get; set; }
    public int TotalXp { get; set; }
}

public class RecommendedSkillDto
{
    public string SkillDomainCode { get; set; } = null!;
    public string SkillNameVi { get; set; } = null!;
    public string SkillNameEn { get; set; } = null!;
    public decimal CurrentMastery { get; set; }
    public string Reason { get; set; } = null!;
    public string RecommendedGameCode { get; set; } = null!;
    public string RecommendedGameTitle { get; set; } = null!;
    public string DifficultyTier { get; set; } = "A1_A2";
}
