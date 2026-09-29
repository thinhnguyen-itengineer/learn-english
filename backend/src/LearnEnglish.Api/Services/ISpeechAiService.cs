using LearnEnglish.Api.DTOs;

namespace LearnEnglish.Api.Services;

public interface ISpeechAiService
{
    Task<EvaluatePhonemeResponse> EvaluatePhonemeAsync(EvaluatePhonemeRequest request);
    Task<SpeechRoleplayResponse> RoleplayChatAsync(SpeechRoleplayRequest request);
}
