using LearnEnglish.Api.DTOs;

namespace LearnEnglish.Api.Services;

public interface ISkillService
{
    Task<SkillsOverviewResponse> GetSkillsOverviewAsync(Guid? userId);
    Task<SkillDomainDto> GetSkillDomainDetailsAsync(string domainCode, Guid? userId);
    Task<DailyBalancedStatusDto> GetDailyBalancedStatusAsync(Guid userId);
    Task<ClaimBonusResponse> ClaimBalancedBonusAsync(Guid userId);
    Task<RecommendedSkillDto> GetRecommendedSkillAsync(Guid? userId);
    Task RecordSkillProgressOnGameCompleteAsync(Guid userId, string gameTypeCode, decimal accuracy, int xpEarned);
}
