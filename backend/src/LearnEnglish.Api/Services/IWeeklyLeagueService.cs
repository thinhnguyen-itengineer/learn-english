using LearnEnglish.Api.DTOs;

namespace LearnEnglish.Api.Services;

public interface IWeeklyLeagueService
{
    Task<WeeklyLeagueCurrentResponse> GetCurrentLeagueAsync(Guid userId);
    Task RecordLeagueXpAsync(Guid userId, int xpEarned);
    Task FinalizeCurrentWeekLeaguesAsync();
}
