using System.Text.Json;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.Domain.Entities;
using LearnEnglish.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Services;

public class Avatar3DService : IAvatar3DService
{
    private readonly AppDbContext _context;
    private readonly ILogger<Avatar3DService> _logger;

    private static readonly List<string> Master42Bones = new()
    {
        "Root", "Hips", "Spine", "Spine1", "Chest", "Neck", "Head",
        "LeftShoulder", "LeftArm", "LeftForeArm", "LeftHand",
        "RightShoulder", "RightArm", "RightForeArm", "RightHand",
        "LeftUpLeg", "LeftLeg", "LeftFoot", "LeftToeBase",
        "RightUpLeg", "RightLeg", "RightFoot", "RightToeBase",
        "LeftHandThumb1", "LeftHandThumb2", "LeftHandIndex1", "LeftHandIndex2", "LeftHandMiddle1", "LeftHandMiddle2",
        "RightHandThumb1", "RightHandThumb2", "RightHandIndex1", "RightHandIndex2", "RightHandMiddle1", "RightHandMiddle2",
        "LeftEye", "RightEye", "Jaw", "HairRoot", "HairTailLeft", "HairTailRight", "WingRoot"
    };

    public Avatar3DService(AppDbContext context, ILogger<Avatar3DService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public Task<Manifest3DDto> GetManifestAsync()
    {
        var manifest = new Manifest3DDto
        {
            Version = "1.0.0",
            MasterSkeletonBonesCount = Master42Bones.Count,
            MasterBones = Master42Bones,
            DefaultCamera = new CameraConfig3D(),
            LightingRig = new LightingRigConfig3D(),
            AvailableAnimations = new List<string>
            {
                "IDLE", "THINKING", "CORRECT", "STREAK", "CONFUSED", "TRYON", "VICTORY", "DEFEAT"
            }
        };

        return Task.FromResult(manifest);
    }

    public async Task<UserAvatar3DConfigDto> GetEquippedAsync(Guid userId)
    {
        var equip = await _context.UserAvatarEquips3D
            .Include(e => e.BaseBody)
            .Include(e => e.Hair)
            .Include(e => e.Top)
            .Include(e => e.Bottom)
            .Include(e => e.Shoes)
            .Include(e => e.Accessory)
            .FirstOrDefaultAsync(e => e.UserId == userId);

        if (equip == null)
        {
            // Create default equip for Aoi
            equip = new UserAvatarEquip3D
            {
                UserId = userId,
                ActiveGender = "FEMALE",
                BaseBodyId = "body_chibi_female_aoi",
                HairId = "hair_twin_tails_cherry_01",
                TopId = "top_chibi_female_sailor_01",
                BottomId = "bottom_chibi_female_pleated_01",
                ShoesId = "shoes_chibi_female_oxford_01",
                AccessoryId = "acc_chibi_female_star_clip_01",
                UpdatedAt = DateTime.UtcNow
            };
            _context.UserAvatarEquips3D.Add(equip);
            await _context.SaveChangesAsync();

            // Reload includes
            equip = await _context.UserAvatarEquips3D
                .Include(e => e.BaseBody)
                .Include(e => e.Hair)
                .Include(e => e.Top)
                .Include(e => e.Bottom)
                .Include(e => e.Shoes)
                .Include(e => e.Accessory)
                .FirstAsync(e => e.UserId == userId);
        }

        return BuildDto(equip);
    }

    public async Task<UserAvatar3DConfigDto> EquipAsync(Guid userId, string slot, string itemId)
    {
        var equip = await _context.UserAvatarEquips3D
            .Include(e => e.BaseBody)
            .Include(e => e.Hair)
            .Include(e => e.Top)
            .Include(e => e.Bottom)
            .Include(e => e.Shoes)
            .Include(e => e.Accessory)
            .FirstOrDefaultAsync(e => e.UserId == userId);

        if (equip == null)
        {
            equip = new UserAvatarEquip3D
            {
                UserId = userId,
                ActiveGender = "FEMALE",
                BaseBodyId = "body_chibi_female_aoi",
                HairId = "hair_twin_tails_cherry_01",
                TopId = "top_chibi_female_sailor_01",
                BottomId = "bottom_chibi_female_pleated_01",
                ShoesId = "shoes_chibi_female_oxford_01",
                AccessoryId = "acc_chibi_female_star_clip_01",
                UpdatedAt = DateTime.UtcNow
            };
            _context.UserAvatarEquips3D.Add(equip);
        }

        var item = await _context.AvatarItems3D.FirstOrDefaultAsync(i => i.Id == itemId && i.IsActive);
        if (item == null)
        {
            throw new KeyNotFoundException($"Vật phẩm 3D '{itemId}' không tồn tại hoặc đã ngừng hoạt động.");
        }

        var normalizedSlot = slot.ToUpperInvariant();
        if (item.Slot.ToUpperInvariant() != normalizedSlot)
        {
            throw new InvalidOperationException($"Vật phẩm '{itemId}' thuộc slot '{item.Slot}', không thể trang bị vào slot '{slot}'.");
        }

        switch (normalizedSlot)
        {
            case "BASE_BODY":
                equip.BaseBodyId = itemId;
                break;
            case "HAIR":
                equip.HairId = itemId;
                break;
            case "TOP":
                equip.TopId = itemId;
                break;
            case "BOTTOM":
                equip.BottomId = itemId;
                break;
            case "SHOES":
                equip.ShoesId = itemId;
                break;
            case "ACCESSORY":
                equip.AccessoryId = itemId;
                break;
            default:
                throw new ArgumentException($"Slot '{slot}' không hợp lệ.");
        }

        equip.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Reload
        equip = await _context.UserAvatarEquips3D
            .Include(e => e.BaseBody)
            .Include(e => e.Hair)
            .Include(e => e.Top)
            .Include(e => e.Bottom)
            .Include(e => e.Shoes)
            .Include(e => e.Accessory)
            .FirstAsync(e => e.UserId == userId);

        return BuildDto(equip);
    }

    public async Task<List<AvatarPreset3DDto>> GetPresetsAsync(Guid userId)
    {
        var presets = await _context.AvatarPresets3D
            .Where(p => p.UserId == userId)
            .OrderBy(p => p.PresetSlot)
            .ToListAsync();

        return presets.Select(p => new AvatarPreset3DDto
        {
            Id = p.Id,
            UserId = p.UserId,
            PresetSlot = p.PresetSlot,
            PresetName = p.PresetName,
            Config = JsonSerializer.Deserialize<object>(p.Config) ?? new { },
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt
        }).ToList();
    }

    public async Task<AvatarPreset3DDto> SavePresetAsync(Guid userId, SavePreset3DRequest request)
    {
        if (request.PresetSlot < 1 || request.PresetSlot > 5)
        {
            throw new ArgumentOutOfRangeException(nameof(request.PresetSlot), "Preset slot phải từ 1 đến 5.");
        }

        var existing = await _context.AvatarPresets3D
            .FirstOrDefaultAsync(p => p.UserId == userId && p.PresetSlot == request.PresetSlot);

        string configJson;
        if (request.Config != null)
        {
            configJson = JsonSerializer.Serialize(request.Config);
        }
        else
        {
            var current = await GetEquippedAsync(userId);
            configJson = JsonSerializer.Serialize(current);
        }

        if (existing != null)
        {
            existing.PresetName = string.IsNullOrWhiteSpace(request.PresetName) ? $"Bộ Trang Phục {request.PresetSlot}" : request.PresetName;
            existing.Config = configJson;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            existing = new AvatarPreset3D
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                PresetSlot = request.PresetSlot,
                PresetName = string.IsNullOrWhiteSpace(request.PresetName) ? $"Bộ Trang Phục {request.PresetSlot}" : request.PresetName,
                Config = configJson,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.AvatarPresets3D.Add(existing);
        }

        await _context.SaveChangesAsync();

        return new AvatarPreset3DDto
        {
            Id = existing.Id,
            UserId = existing.UserId,
            PresetSlot = existing.PresetSlot,
            PresetName = existing.PresetName,
            Config = JsonSerializer.Deserialize<object>(existing.Config) ?? new { },
            CreatedAt = existing.CreatedAt,
            UpdatedAt = existing.UpdatedAt
        };
    }

    public async Task<UserAvatar3DConfigDto> ApplyPresetAsync(Guid userId, Guid presetId)
    {
        var preset = await _context.AvatarPresets3D
            .FirstOrDefaultAsync(p => p.Id == presetId && p.UserId == userId);

        if (preset == null)
        {
            throw new KeyNotFoundException($"Không tìm thấy Preset 3D với ID '{presetId}'.");
        }

        var config = JsonSerializer.Deserialize<UserAvatar3DConfigDto>(preset.Config, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        if (config == null)
        {
            throw new InvalidOperationException("Dữ liệu cấu hình trong preset không hợp lệ.");
        }

        var equip = await _context.UserAvatarEquips3D.FirstOrDefaultAsync(e => e.UserId == userId);
        if (equip == null)
        {
            equip = new UserAvatarEquip3D { UserId = userId };
            _context.UserAvatarEquips3D.Add(equip);
        }

        if (!string.IsNullOrEmpty(config.BaseBodyId)) equip.BaseBodyId = config.BaseBodyId;
        if (!string.IsNullOrEmpty(config.HairId)) equip.HairId = config.HairId;
        if (!string.IsNullOrEmpty(config.TopId)) equip.TopId = config.TopId;
        if (!string.IsNullOrEmpty(config.BottomId)) equip.BottomId = config.BottomId;
        if (!string.IsNullOrEmpty(config.ShoesId)) equip.ShoesId = config.ShoesId;
        equip.AccessoryId = config.AccessoryId;
        equip.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetEquippedAsync(userId);
    }

    public async Task<ActiveCharacterDto> GetActiveCharacterAsync(Guid userId)
    {
        var equipped = await GetEquippedAsync(userId);
        var isMale = string.Equals(equipped.ActiveGender, "MALE", StringComparison.OrdinalIgnoreCase);
        var isDuo = string.Equals(equipped.ActiveGender, "DUO", StringComparison.OrdinalIgnoreCase);

        if (isMale)
        {
            return new ActiveCharacterDto
            {
                ActiveGender = "MALE",
                CharacterName = "Ren",
                VietnameseName = "Tuệ Minh",
                Height = "0.98m",
                Role = "Đọc & Viết (Reading & Writing)",
                BaseBodyId = equipped.BaseBodyId,
                EquippedConfig = equipped
            };
        }
        else if (isDuo)
        {
            return new ActiveCharacterDto
            {
                ActiveGender = "DUO",
                CharacterName = "Aoi & Ren",
                VietnameseName = "Ánh Dương & Tuệ Minh",
                Height = "0.95m / 0.98m",
                Role = "Song Hành Toàn Diện 4 Kỹ Năng",
                BaseBodyId = equipped.BaseBodyId,
                EquippedConfig = equipped
            };
        }

        return new ActiveCharacterDto
        {
            ActiveGender = "FEMALE",
            CharacterName = "Aoi",
            VietnameseName = "Ánh Dương",
            Height = "0.95m",
            Role = "Nói & Nghe (Speaking & Listening)",
            BaseBodyId = equipped.BaseBodyId,
            EquippedConfig = equipped
        };
    }

    public async Task<ActiveCharacterDto> SwitchActiveCharacterAsync(Guid userId, string gender)
    {
        var normalized = (gender ?? "FEMALE").Trim().ToUpperInvariant();
        if (normalized != "FEMALE" && normalized != "MALE" && normalized != "DUO")
        {
            normalized = "FEMALE";
        }

        var equip = await _context.UserAvatarEquips3D.FirstOrDefaultAsync(e => e.UserId == userId);
        if (equip == null)
        {
            await GetEquippedAsync(userId);
            equip = await _context.UserAvatarEquips3D.FirstAsync(e => e.UserId == userId);
        }

        equip.ActiveGender = normalized;

        // Auto-switch starter bodies and hair if currently on opposite gender defaults
        if (normalized == "MALE")
        {
            if (equip.BaseBodyId == "body_chibi_female_aoi" || equip.BaseBodyId == "body_chibi_female_01")
            {
                equip.BaseBodyId = "body_chibi_male_ren";
                equip.HairId = "hair_side_part_scholar_01";
                equip.TopId = "top_chibi_male_vest_gilet_01";
                equip.BottomId = "bottom_chibi_male_slacks_01";
                equip.ShoesId = "shoes_chibi_male_sneaker_cyan_01";
                equip.AccessoryId = "acc_chibi_male_cyber_headset_01";
            }
        }
        else if (normalized == "FEMALE")
        {
            if (equip.BaseBodyId == "body_chibi_male_ren" || equip.BaseBodyId == "body_chibi_male_01")
            {
                equip.BaseBodyId = "body_chibi_female_aoi";
                equip.HairId = "hair_twin_tails_cherry_01";
                equip.TopId = "top_chibi_female_sailor_01";
                equip.BottomId = "bottom_chibi_female_pleated_01";
                equip.ShoesId = "shoes_chibi_female_oxford_01";
                equip.AccessoryId = "acc_chibi_female_star_clip_01";
            }
        }

        equip.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return await GetActiveCharacterAsync(userId);
    }

    private static UserAvatar3DConfigDto BuildDto(UserAvatarEquip3D equip)
    {
        var hiddenSlots = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var maskedParts = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        var items = new[] { equip.BaseBody, equip.Hair, equip.Top, equip.Bottom, equip.Shoes, equip.Accessory };
        foreach (var item in items)
        {
            if (item == null) continue;
            if (item.HideSlotsWhenEquipped != null)
            {
                foreach (var s in item.HideSlotsWhenEquipped) hiddenSlots.Add(s);
            }
            if (item.MaskedBodyParts != null)
            {
                foreach (var m in item.MaskedBodyParts) maskedParts.Add(m);
            }
        }

        return new UserAvatar3DConfigDto
        {
            UserId = equip.UserId,
            ActiveGender = string.IsNullOrWhiteSpace(equip.ActiveGender) ? "FEMALE" : equip.ActiveGender,
            BaseBodyId = equip.BaseBodyId,
            HairId = equip.HairId,
            TopId = equip.TopId,
            BottomId = equip.BottomId,
            ShoesId = equip.ShoesId,
            AccessoryId = equip.AccessoryId,
            ActiveAnimation = "IDLE",
            UpdatedAt = equip.UpdatedAt,
            HiddenSlots = hiddenSlots.ToList(),
            MaskedBodyParts = maskedParts.ToList()
        };
    }
}
