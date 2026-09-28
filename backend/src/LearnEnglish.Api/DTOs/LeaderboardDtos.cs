namespace LearnEnglish.Api.DTOs;

public record LeaderboardRankDto
{
    public int Rank { get; init; }
    public string DisplayName { get; init; } = string.Empty;
    public int WeeklyXp { get; init; }
    public int CurrentLevel { get; init; }
    public string? AvatarUrl { get; init; }
}

public record LeaderboardResponse
{
    public int TotalParticipants { get; init; }
    public LeaderboardRankDto? MyRank { get; init; }
    public List<LeaderboardRankDto> TopRankings { get; init; } = new();
}
