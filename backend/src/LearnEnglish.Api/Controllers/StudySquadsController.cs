using System.Security.Claims;
using LearnEnglish.Api.DTOs;
using LearnEnglish.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnEnglish.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/squads")]
[Route("api/squads")]
public class StudySquadsController : ControllerBase
{
    private readonly IStudySquadService _squadService;

    public StudySquadsController(IStudySquadService squadService)
    {
        _squadService = squadService;
    }

    [HttpGet("my-squad")]
    public async Task<ActionResult<MySquadResponse?>> GetMySquad()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var squad = await _squadService.GetMySquadAsync(userId.Value);
        return Ok(squad);
    }

    [HttpPost("create")]
    public async Task<ActionResult<MySquadResponse>> CreateSquad([FromBody] CreateSquadRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        try
        {
            var squad = await _squadService.CreateSquadAsync(userId.Value, request);
            return Ok(squad);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("join")]
    public async Task<ActionResult<MySquadResponse>> JoinSquad([FromBody] JoinSquadRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        try
        {
            var squad = await _squadService.JoinSquadAsync(userId.Value, request);
            return Ok(squad);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("claim-reward")]
    public async Task<ActionResult<ClaimSquadRewardResponse>> ClaimReward()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var response = await _squadService.ClaimWeeklyRewardAsync(userId.Value);
        if (!response.Success)
        {
            return BadRequest(response);
        }
        return Ok(response);
    }

    private Guid? GetUserId()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return Guid.TryParse(userIdStr, out var id) ? id : null;
    }
}
