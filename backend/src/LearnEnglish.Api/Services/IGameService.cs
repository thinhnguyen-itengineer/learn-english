using LearnEnglish.Api.DTOs;

namespace LearnEnglish.Api.Services;

public interface IGameService
{
    Task<object> StartGameSessionAsync(Guid userId, StartGameRequest request);
    Task<CompleteSessionResponse> CompleteGameSessionAsync(Guid userId, CompleteSessionRequest request);
}
