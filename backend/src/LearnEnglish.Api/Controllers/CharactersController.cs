using System.Security.Claims;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.DTOs;
using LearnEnglish.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Controllers;

[ApiController]
[Route("api/v1/characters")]
public class CharactersController : ControllerBase
{
    private readonly IAvatar3DService _avatar3DService;
    private readonly AppDbContext _context;
    private readonly ILogger<CharactersController> _logger;

    public CharactersController(
        IAvatar3DService avatar3DService,
        AppDbContext context,
        ILogger<CharactersController> logger)
    {
        _avatar3DService = avatar3DService;
        _context = context;
        _logger = logger;
    }

    [HttpGet("active")]
    public async Task<ActionResult<ActiveCharacterDto>> GetActiveCharacter()
    {
        var userId = await GetCurrentUserIdAsync();
        var character = await _avatar3DService.GetActiveCharacterAsync(userId);
        return Ok(character);
    }

    [HttpPost("switch")]
    public async Task<ActionResult<ActiveCharacterDto>> SwitchCharacter([FromBody] SwitchCharacterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request?.Gender))
        {
            return BadRequest(new { message = "Giới tính nhân vật (FEMALE, MALE, DUO) không được để trống." });
        }

        try
        {
            var userId = await GetCurrentUserIdAsync();
            var character = await _avatar3DService.SwitchActiveCharacterAsync(userId, request.Gender);
            return Ok(character);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi chuyển đổi nhân vật 3D sang {Gender}", request.Gender);
            return StatusCode(500, new { message = "Lỗi máy chủ khi đổi nhân vật." });
        }
    }

    private async Task<Guid> GetCurrentUserIdAsync()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                 ?? User.FindFirst("sub")?.Value;

        if (Guid.TryParse(claim, out var id))
        {
            return id;
        }

        var firstUser = await _context.Users.OrderBy(u => u.CreatedAt).FirstOrDefaultAsync();
        if (firstUser != null)
        {
            return firstUser.Id;
        }

        throw new UnauthorizedAccessException("Người dùng chưa được xác thực danh tính.");
    }
}
