using System.Security.Claims;
using LearnEnglish.Api.DTOs;
using LearnEnglish.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LearnEnglish.Api.Controllers;

[ApiController]
[Route("api/v1/skills")]
public class SkillsController : ControllerBase
{
    private readonly ISkillService _skillService;

    public SkillsController(ISkillService skillService)
    {
        _skillService = skillService;
    }

    /// <summary>
    /// Danh sách 4 kỹ năng kèm tiến độ của user và radar chart
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<SkillsOverviewResponse>> GetSkills()
    {
        var userId = GetCurrentUserId();
        var response = await _skillService.GetSkillsOverviewAsync(userId);
        return Ok(response);
    }

    /// <summary>
    /// Trạng thái nhiệm vụ cân bằng 4 kỹ năng trong ngày
    /// </summary>
    [HttpGet("daily-status")]
    public async Task<ActionResult<DailyBalancedStatusDto>> GetDailyStatus()
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(new { error = "Yêu cầu đăng nhập hoặc phiên học viên khách." });
        }

        try
        {
            var result = await _skillService.GetDailyBalancedStatusAsync(userId.Value);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Nhận thưởng +50 Coins, +100 XP khi hoàn thành cả 4 kỹ năng trong ngày
    /// </summary>
    [HttpPost("claim-balanced-bonus")]
    public async Task<ActionResult<ClaimBonusResponse>> ClaimBalancedBonus()
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(new { error = "Yêu cầu đăng nhập hoặc phiên học viên khách." });
        }

        try
        {
            var result = await _skillService.ClaimBalancedBonusAsync(userId.Value);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Gợi ý kỹ năng cần luyện tập (Smart Pick)
    /// </summary>
    [HttpGet("recommended")]
    public async Task<ActionResult<RecommendedSkillDto>> GetRecommended()
    {
        var userId = GetCurrentUserId();
        var result = await _skillService.GetRecommendedSkillAsync(userId);
        return Ok(result);
    }

    /// <summary>
    /// Chi tiết kỹ năng và danh mục trò chơi theo mã kỹ năng
    /// </summary>
    [HttpGet("{domainCode}")]
    public async Task<ActionResult<SkillDomainDto>> GetSkillDetail(string domainCode)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _skillService.GetSkillDomainDetailsAsync(domainCode, userId);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    private Guid? GetCurrentUserId()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (Guid.TryParse(userIdStr, out var userId))
        {
            return userId;
        }
        return null;
    }
}
