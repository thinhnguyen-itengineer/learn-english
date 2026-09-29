using System.Security.Claims;
using LearnEnglish.Api.DTOs;
using LearnEnglish.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnEnglish.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/habits")]
[Route("api/habits")]
public class HabitsController : ControllerBase
{
    private readonly IHabitService _habitService;

    public HabitsController(IHabitService habitService)
    {
        _habitService = habitService;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<HabitSummaryResponse>> GetSummary()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var summary = await _habitService.GetHabitSummaryAsync(userId.Value);
        return Ok(summary);
    }

    [HttpPost("shop/buy-freeze")]
    public async Task<ActionResult<BuyFreezeResponse>> BuyFreeze()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var response = await _habitService.BuyStreakFreezeAsync(userId.Value);
        if (!response.Success)
        {
            return BadRequest(response);
        }
        return Ok(response);
    }

    [HttpPost("chests/claim")]
    public async Task<ActionResult<ClaimChestResponse>> ClaimChest([FromBody] ClaimChestRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        try
        {
            var response = await _habitService.ClaimChestAsync(userId.Value, request.ChestType);
            return Ok(response);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("streak/repair")]
    public async Task<ActionResult<RepairStreakResponse>> RepairStreak()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var response = await _habitService.RepairStreakAsync(userId.Value);
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
