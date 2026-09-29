using LearnEnglish.Api.DTOs;

namespace LearnEnglish.Api.Services;

public interface IStudySquadService
{
    Task<MySquadResponse?> GetMySquadAsync(Guid userId);
    Task<MySquadResponse> CreateSquadAsync(Guid userId, CreateSquadRequest request);
    Task<MySquadResponse> JoinSquadAsync(Guid userId, JoinSquadRequest request);
    Task RecordSquadXpAsync(Guid userId, int xpEarned);
    Task<ClaimSquadRewardResponse> ClaimWeeklyRewardAsync(Guid userId);
    Task ResetWeeklySquadXpAsync();
}
