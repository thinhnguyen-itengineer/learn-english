using System.Security.Claims;
using LearnEnglish.Api.DTOs;
using LearnEnglish.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnEnglish.Api.Controllers;

[ApiController]
[Route("api/v1/challenges")]
[Route("api/challenges")]
public class AsyncChallengesController : ControllerBase
{
    private readonly IAsyncChallengeService _challengeService;

    public AsyncChallengesController(IAsyncChallengeService challengeService)
    {
        _challengeService = challengeService;
    }

    [Authorize]
    [HttpPost("create")]
    public async Task<ActionResult<CreateChallengeResponse>> CreateChallenge([FromBody] CreateChallengeRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var response = await _challengeService.CreateChallengeAsync(userId.Value, request);
        return Ok(response);
    }

    [HttpGet("{token}")]
    public async Task<ActionResult<ChallengeDetailResponse>> GetChallenge(string token)
    {
        try
        {
            var response = await _challengeService.GetChallengeByTokenAsync(token);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    [HttpPost("{token}/attempt")]
    public async Task<ActionResult<SubmitChallengeAttemptResponse>> SubmitAttempt(
        string token,
        [FromBody] SubmitChallengeAttemptRequest request)
    {
        var userId = GetUserId();
        try
        {
            var response = await _challengeService.SubmitAttemptAsync(token, userId, request);
            return Ok(response);
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

    private Guid? GetUserId()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return Guid.TryParse(userIdStr, out var id) ? id : null;
    }
}
