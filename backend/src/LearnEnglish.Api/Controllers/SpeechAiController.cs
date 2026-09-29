using LearnEnglish.Api.DTOs;
using LearnEnglish.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LearnEnglish.Api.Controllers;

[ApiController]
[Route("api/v1/speech")]
[Route("api/speech")]
public class SpeechAiController : ControllerBase
{
    private readonly ISpeechAiService _speechService;

    public SpeechAiController(ISpeechAiService speechService)
    {
        _speechService = speechService;
    }

    [HttpPost("evaluate-phoneme")]
    public async Task<ActionResult<EvaluatePhonemeResponse>> EvaluatePhoneme([FromBody] EvaluatePhonemeRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ReferenceText))
        {
            return BadRequest(new { error = "ReferenceText là bắt buộc." });
        }

        var result = await _speechService.EvaluatePhonemeAsync(request);
        return Ok(result);
    }

    [HttpPost("roleplay/chat")]
    public async Task<ActionResult<SpeechRoleplayResponse>> RoleplayChat([FromBody] SpeechRoleplayRequest request)
    {
        var result = await _speechService.RoleplayChatAsync(request);
        return Ok(result);
    }
}
