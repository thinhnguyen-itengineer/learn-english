using LearnEnglish.Api.DTOs;

namespace LearnEnglish.Api.Services;

public interface IHabitService
{
    Task<HabitSummaryResponse> GetHabitSummaryAsync(Guid userId);
    Task RecordActivityAndCheckStreakAsync(Guid userId, int xpEarned);
    Task<BuyFreezeResponse> BuyStreakFreezeAsync(Guid userId);
    Task<ClaimChestResponse> ClaimChestAsync(Guid userId, string chestType);
    Task<RepairStreakResponse> RepairStreakAsync(Guid userId);
    Task ProcessMidnightStreakProtectionAsync();
}
