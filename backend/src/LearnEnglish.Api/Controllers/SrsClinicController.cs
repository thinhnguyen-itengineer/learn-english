using System.Security.Claims;
using LearnEnglish.Api.DTOs;
using LearnEnglish.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnEnglish.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/srs")]
[Route("api/srs")]
public class SrsClinicController : ControllerBase
{
    private readonly ISrsClinicService _srsService;

    public SrsClinicController(ISrsClinicService srsService)
    {
        _srsService = srsService;
    }

    [HttpGet("mistakes/summary")]
    public async Task<ActionResult<MistakesSummaryResponse>> GetMistakesSummary()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var summary = await _srsService.GetMistakesSummaryAsync(userId.Value);
        return Ok(summary);
    }

    [HttpGet("clinic/session")]
    public async Task<ActionResult<ClinicSessionResponse>> GetClinicSession()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var session = await _srsService.GetClinicSessionAsync(userId.Value);
        return Ok(session);
    }

    [HttpPost("clinic/submit")]
    public async Task<ActionResult<ClinicSubmitResponse>> SubmitClinicCard([FromBody] ClinicSubmitRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        try
        {
            var response = await _srsService.SubmitClinicCardAsync(userId.Value, request);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    [HttpPost("mistakes/capture")]
    public async Task<ActionResult> CaptureMistake([FromBody] CaptureMistakeRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        await _srsService.CaptureMistakeAsync(userId.Value, request);
        return Ok(new { success = true });
    }

    private Guid? GetUserId()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return Guid.TryParse(userIdStr, out var id) ? id : null;
    }
}
