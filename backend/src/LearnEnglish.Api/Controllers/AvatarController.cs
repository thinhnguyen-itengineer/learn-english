using System.Security.Claims;
using System.Text.Json;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.Domain.Entities;
using LearnEnglish.Api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Controllers;

[ApiController]
[Route("api/v1/avatar")]
[Authorize]
public class AvatarController : ControllerBase
{
    private readonly AppDbContext _context;

    public AvatarController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("config")]
    public async Task<ActionResult<AvatarConfigDto>> GetConfig()
    {
        var userId = GetCurrentUserId();
        var config = await _context.AvatarConfigs.FirstOrDefaultAsync(c => c.UserId == userId);
        if (config == null)
        {
            config = new AvatarConfig
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                BodyType = "neutral",
                SkinColor = "#E8B898",
                HairStyleId = "short_crop",
                HairColor = "#1C1917",
                EyeExpression = "friendly_smile",
                MouthExpression = "smile_open",
                TopsId = "starter_tee_white",
                BottomsId = "starter_jeans_blue",
                FootwearId = "starter_sneakers_white",
                AuraBackgroundId = "pedestal_wood_circle",
                IsActive = true,
                UpdatedAt = DateTime.UtcNow
            };
            _context.AvatarConfigs.Add(config);
            await _context.SaveChangesAsync();
        }

        return Ok(ToDto(config));
    }

    [HttpPut("config")]
    public async Task<ActionResult> UpdateConfig([FromBody] AvatarConfigDto dto)
    {
        var userId = GetCurrentUserId();
        var config = await _context.AvatarConfigs.FirstOrDefaultAsync(c => c.UserId == userId);
        if (config == null)
        {
            config = new AvatarConfig { Id = Guid.NewGuid(), UserId = userId };
            _context.AvatarConfigs.Add(config);
        }

        // Validate items: starter items are always allowed. Other clothing/accessory items must exist in inventory.
        var starterCodes = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "starter_tee_white", "starter_jeans_blue", "starter_sneakers_white", "pedestal_wood_circle"
        };

        var ownedItemCodes = await _context.UserInventories
            .Where(i => i.UserId == userId)
            .Include(i => i.Item)
            .Select(i => i.Item.ItemCode)
            .ToListAsync();

        var ownedSet = new HashSet<string>(ownedItemCodes, StringComparer.OrdinalIgnoreCase);

        string? CheckItemAllowed(string? itemCode)
        {
            if (string.IsNullOrWhiteSpace(itemCode)) return null;
            if (starterCodes.Contains(itemCode) || ownedSet.Contains(itemCode)) return itemCode;
            return null;
        }

        if (!starterCodes.Contains(dto.TopsId) && !ownedSet.Contains(dto.TopsId))
        {
            return BadRequest(new { error = $"Vật phẩm '{dto.TopsId}' chưa được sở hữu trong tủ đồ." });
        }
        if (!starterCodes.Contains(dto.BottomsId) && !ownedSet.Contains(dto.BottomsId))
        {
            return BadRequest(new { error = $"Vật phẩm '{dto.BottomsId}' chưa được sở hữu trong tủ đồ." });
        }
        if (!starterCodes.Contains(dto.FootwearId) && !ownedSet.Contains(dto.FootwearId))
        {
            return BadRequest(new { error = $"Vật phẩm '{dto.FootwearId}' chưa được sở hữu trong tủ đồ." });
        }

        config.BodyType = string.IsNullOrWhiteSpace(dto.BodyType) ? "neutral" : dto.BodyType;
        config.SkinColor = string.IsNullOrWhiteSpace(dto.SkinColor) ? "#E8B898" : dto.SkinColor;
        config.HairStyleId = string.IsNullOrWhiteSpace(dto.HairStyleId) ? "short_crop" : dto.HairStyleId;
        config.HairColor = string.IsNullOrWhiteSpace(dto.HairColor) ? "#1C1917" : dto.HairColor;
        config.EyeExpression = string.IsNullOrWhiteSpace(dto.EyeExpression) ? "friendly_smile" : dto.EyeExpression;
        config.MouthExpression = string.IsNullOrWhiteSpace(dto.MouthExpression) ? "smile_open" : dto.MouthExpression;
        config.TopsId = dto.TopsId;
        config.BottomsId = dto.BottomsId;
        config.FootwearId = dto.FootwearId;
        config.HeadwearId = CheckItemAllowed(dto.HeadwearId);
        config.EyewearId = CheckItemAllowed(dto.EyewearId);
        config.NeckwearId = CheckItemAllowed(dto.NeckwearId);
        config.HandheldId = CheckItemAllowed(dto.HandheldId);
        config.AuraBackgroundId = string.IsNullOrWhiteSpace(dto.AuraBackgroundId) ? "pedestal_wood_circle" : dto.AuraBackgroundId;
        config.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { success = true, updatedConfig = ToDto(config) });
    }

    [HttpGet("presets")]
    public async Task<ActionResult<List<OutfitPresetDto>>> GetPresets()
    {
        var userId = GetCurrentUserId();
        var presets = await _context.AvatarPresets
            .Where(p => p.UserId == userId)
            .OrderBy(p => p.PresetIndex)
            .ToListAsync();

        var result = presets.Select(p =>
        {
            AvatarConfigDto cfg;
            try
            {
                cfg = JsonSerializer.Deserialize<AvatarConfigDto>(p.ConfigData, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                      ?? new AvatarConfigDto();
            }
            catch
            {
                cfg = new AvatarConfigDto();
            }

            return new OutfitPresetDto
            {
                PresetIndex = p.PresetIndex,
                PresetName = p.PresetName,
                ConfigData = cfg,
                UpdatedAt = p.UpdatedAt
            };
        }).ToList();

        return Ok(result);
    }

    [HttpPut("presets/{index:int}")]
    public async Task<ActionResult<OutfitPresetDto>> SavePreset(int index, [FromBody] SavePresetRequest request)
    {
        if (index < 1 || index > 3)
        {
            return BadRequest(new { message = "Chỉ hỗ trợ lưu trong slot preset 1, 2 hoặc 3." });
        }

        var userId = GetCurrentUserId();
        var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null)
        {
            return NotFound(new { message = "Không tìm thấy hồ sơ người dùng." });
        }

        if (index > profile.UnlockedPresetSlots)
        {
            return BadRequest(new { message = $"Slot {index} chưa được mở khóa. Hãy mở thêm slot trong cửa hàng." });
        }

        var configDto = request.Config;
        if (configDto == null)
        {
            var activeConfig = await _context.AvatarConfigs.FirstOrDefaultAsync(c => c.UserId == userId);
            configDto = activeConfig != null ? ToDto(activeConfig) : new AvatarConfigDto();
        }

        var preset = await _context.AvatarPresets.FirstOrDefaultAsync(p => p.UserId == userId && p.PresetIndex == index);
        if (preset == null)
        {
            preset = new AvatarPreset
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                PresetIndex = index
            };
            _context.AvatarPresets.Add(preset);
        }

        preset.PresetName = string.IsNullOrWhiteSpace(request.PresetName) 
            ? $"Bộ Trang Phục {index}" 
            : request.PresetName.Trim();
        preset.ConfigData = JsonSerializer.Serialize(configDto);
        preset.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new OutfitPresetDto
        {
            PresetIndex = preset.PresetIndex,
            PresetName = preset.PresetName,
            ConfigData = configDto,
            UpdatedAt = preset.UpdatedAt
        });
    }

    [HttpPost("presets/{index:int}/apply")]
    public async Task<ActionResult> ApplyPreset(int index)
    {
        var userId = GetCurrentUserId();
        var preset = await _context.AvatarPresets.FirstOrDefaultAsync(p => p.UserId == userId && p.PresetIndex == index);
        if (preset == null)
        {
            return NotFound(new { message = $"Chưa có cấu hình preset cho slot {index}." });
        }

        AvatarConfigDto? presetConfig;
        try
        {
            presetConfig = JsonSerializer.Deserialize<AvatarConfigDto>(preset.ConfigData, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        catch
        {
            return BadRequest(new { message = "Dữ liệu cấu hình preset bị hỏng." });
        }

        if (presetConfig == null)
        {
            return BadRequest(new { message = "Cấu hình preset trống." });
        }

        var config = await _context.AvatarConfigs.FirstOrDefaultAsync(c => c.UserId == userId);
        if (config == null)
        {
            config = new AvatarConfig { Id = Guid.NewGuid(), UserId = userId };
            _context.AvatarConfigs.Add(config);
        }

        config.BodyType = presetConfig.BodyType;
        config.SkinColor = presetConfig.SkinColor;
        config.HairStyleId = presetConfig.HairStyleId;
        config.HairColor = presetConfig.HairColor;
        config.EyeExpression = presetConfig.EyeExpression;
        config.MouthExpression = presetConfig.MouthExpression;
        config.TopsId = presetConfig.TopsId;
        config.BottomsId = presetConfig.BottomsId;
        config.FootwearId = presetConfig.FootwearId;
        config.HeadwearId = presetConfig.HeadwearId;
        config.EyewearId = presetConfig.EyewearId;
        config.NeckwearId = presetConfig.NeckwearId;
        config.HandheldId = presetConfig.HandheldId;
        config.AuraBackgroundId = presetConfig.AuraBackgroundId;
        config.UpdatedAt = DateTime.UtcNow;

        var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile != null)
        {
            profile.ActivePresetSlot = index;
            profile.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return Ok(new { success = true, activeConfig = ToDto(config) });
    }

    private static AvatarConfigDto ToDto(AvatarConfig config)
    {
        return new AvatarConfigDto
        {
            BodyType = config.BodyType,
            SkinColor = config.SkinColor,
            HairStyleId = config.HairStyleId,
            HairColor = config.HairColor,
            EyeExpression = config.EyeExpression,
            MouthExpression = config.MouthExpression,
            TopsId = config.TopsId,
            BottomsId = config.BottomsId,
            FootwearId = config.FootwearId,
            HeadwearId = config.HeadwearId,
            EyewearId = config.EyewearId,
            NeckwearId = config.NeckwearId,
            HandheldId = config.HandheldId,
            AuraBackgroundId = config.AuraBackgroundId
        };
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                 ?? User.FindFirst("sub")?.Value;

        if (Guid.TryParse(claim, out var id))
        {
            return id;
        }

        throw new UnauthorizedAccessException("Người dùng chưa được xác thực danh tính.");
    }
}
