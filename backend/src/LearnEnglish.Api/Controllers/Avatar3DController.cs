using System.Security.Claims;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.DTOs;
using LearnEnglish.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Controllers;

[ApiController]
[Route("api/v1/avatar-3d")]
public class Avatar3DController : ControllerBase
{
    private readonly IAvatar3DService _avatar3DService;
    private readonly AppDbContext _context;
    private readonly ILogger<Avatar3DController> _logger;

    public Avatar3DController(
        IAvatar3DService avatar3DService,
        AppDbContext context,
        ILogger<Avatar3DController> logger)
    {
        _avatar3DService = avatar3DService;
        _context = context;
        _logger = logger;
    }

    [HttpGet("manifest")]
    [AllowAnonymous]
    public async Task<ActionResult<Manifest3DDto>> GetManifest()
    {
        var manifest = await _avatar3DService.GetManifestAsync();
        return Ok(manifest);
    }

    [HttpGet("equipped")]
    public async Task<ActionResult<UserAvatar3DConfigDto>> GetEquipped()
    {
        var userId = await GetCurrentUserIdAsync();
        var config = await _avatar3DService.GetEquippedAsync(userId);
        return Ok(config);
    }

    [HttpPut("equip")]
    public async Task<ActionResult<Equip3DResponse>> Equip([FromBody] Equip3DRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Slot) || string.IsNullOrWhiteSpace(request.ItemId))
        {
            return BadRequest(new { message = "Slot và ItemId không được để trống." });
        }

        try
        {
            var userId = await GetCurrentUserIdAsync();
            var updatedConfig = await _avatar3DService.EquipAsync(userId, request.Slot, request.ItemId);
            return Ok(new Equip3DResponse
            {
                Success = true,
                Message = $"Trang bị vật phẩm '{request.ItemId}' vào slot '{request.Slot}' thành công.",
                Data = updatedConfig
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi trang bị vật phẩm 3D");
            return StatusCode(500, new { message = "Lỗi máy chủ khi trang bị vật phẩm 3D." });
        }
    }

    [HttpGet("presets")]
    public async Task<ActionResult<List<AvatarPreset3DDto>>> GetPresets()
    {
        var userId = await GetCurrentUserIdAsync();
        var presets = await _avatar3DService.GetPresetsAsync(userId);
        return Ok(presets);
    }

    [HttpPost("presets")]
    public async Task<ActionResult<AvatarPreset3DDto>> SavePreset([FromBody] SavePreset3DRequest request)
    {
        try
        {
            var userId = await GetCurrentUserIdAsync();
            var preset = await _avatar3DService.SavePresetAsync(userId, request);
            return Ok(preset);
        }
        catch (ArgumentOutOfRangeException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lưu Preset 3D");
            return StatusCode(500, new { message = "Lỗi máy chủ khi lưu preset." });
        }
    }

    [HttpPost("presets/{id:guid}/apply")]
    public async Task<ActionResult<UserAvatar3DConfigDto>> ApplyPreset(Guid id)
    {
        try
        {
            var userId = await GetCurrentUserIdAsync();
            var config = await _avatar3DService.ApplyPresetAsync(userId, id);
            return Ok(config);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi áp dụng Preset 3D");
            return StatusCode(500, new { message = "Lỗi máy chủ khi áp dụng preset." });
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
