using LearnEnglish.Api.DTOs;

namespace LearnEnglish.Api.Services;

public interface ISrsClinicService
{
    Task<MistakesSummaryResponse> GetMistakesSummaryAsync(Guid userId);
    Task<ClinicSessionResponse> GetClinicSessionAsync(Guid userId);
    Task<ClinicSubmitResponse> SubmitClinicCardAsync(Guid userId, ClinicSubmitRequest request);
    Task CaptureMistakeAsync(Guid userId, CaptureMistakeRequest request);
}
