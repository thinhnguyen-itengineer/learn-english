using System.Security.Claims;
using LearnEnglish.Api.DTOs;
using LearnEnglish.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnEnglish.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/leagues")]
[Route("api/leagues")]
public class WeeklyLeaguesController : ControllerBase
{
    private readonly IWeeklyLeagueService _leagueService;

    public WeeklyLeaguesController(IWeeklyLeagueService leagueService)
    {
        _leagueService = leagueService;
    }

    [HttpGet("current")]
    public async Task<ActionResult<WeeklyLeagueCurrentResponse>> GetCurrentLeague()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var league = await _leagueService.GetCurrentLeagueAsync(userId.Value);
        return Ok(league);
    }

    private Guid? GetUserId()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return Guid.TryParse(userIdStr, out var id) ? id : null;
    }
}
