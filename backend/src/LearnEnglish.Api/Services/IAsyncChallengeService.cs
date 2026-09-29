using LearnEnglish.Api.DTOs;

namespace LearnEnglish.Api.Services;

public interface IAsyncChallengeService
{
    Task<CreateChallengeResponse> CreateChallengeAsync(Guid creatorUserId, CreateChallengeRequest request);
    Task<ChallengeDetailResponse> GetChallengeByTokenAsync(string token);
    Task<SubmitChallengeAttemptResponse> SubmitAttemptAsync(string token, Guid? participantUserId, SubmitChallengeAttemptRequest request);
}
