using System.Security.Claims;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.Domain.Entities;
using LearnEnglish.Api.DTOs;
using LearnEnglish.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Controllers;

[ApiController]
[Route("api/v1/profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ITokenLedgerService _tokenLedgerService;

    public ProfileController(AppDbContext context, ITokenLedgerService tokenLedgerService)
    {
        _context = context;
        _tokenLedgerService = tokenLedgerService;
    }

    [HttpGet]
    [HttpGet("me")]
    public async Task<ActionResult<FullUserProfileDto>> GetProfile()
    {
        var userId = GetCurrentUserId();
        var profile = await _context.UserProfiles
            .Include(p => p.AvatarConfig)
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
        {
            return NotFound(new { message = "Không tìm thấy hồ sơ người dùng." });
        }

        // Auto-create avatar config if missing
        if (profile.AvatarConfig == null)
        {
            profile.AvatarConfig = new AvatarConfig
            {
                Id = Guid.NewGuid(),
                UserId = profile.UserId,
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
            _context.AvatarConfigs.Add(profile.AvatarConfig);
            await _context.SaveChangesAsync();
        }

        // Query skill domain mastery
        var skillProgress = await _context.UserSkillProgresses
            .Where(sp => sp.UserId == userId)
            .ToListAsync();

        var skillsMastery = new SkillsMasteryDto
        {
            ListeningScore = skillProgress.FirstOrDefault(s => s.SkillDomainCode == "listening")?.MasteryScore ?? 75m,
            ReadingScore = skillProgress.FirstOrDefault(s => s.SkillDomainCode == "reading")?.MasteryScore ?? 80m,
            WritingScore = skillProgress.FirstOrDefault(s => s.SkillDomainCode == "writing")?.MasteryScore ?? 70m,
            SpeakingScore = skillProgress.FirstOrDefault(s => s.SkillDomainCode == "speaking")?.MasteryScore ?? 65m
        };

        var cfg = profile.AvatarConfig;
        var avatarDto = new AvatarConfigDto
        {
            BodyType = cfg.BodyType,
            SkinColor = cfg.SkinColor,
            HairStyleId = cfg.HairStyleId,
            HairColor = cfg.HairColor,
            EyeExpression = cfg.EyeExpression,
            MouthExpression = cfg.MouthExpression,
            TopsId = cfg.TopsId,
            BottomsId = cfg.BottomsId,
            FootwearId = cfg.FootwearId,
            HeadwearId = cfg.HeadwearId,
            EyewearId = cfg.EyewearId,
            NeckwearId = cfg.NeckwearId,
            HandheldId = cfg.HandheldId,
            AuraBackgroundId = cfg.AuraBackgroundId
        };

        return Ok(new FullUserProfileDto
        {
            Id = profile.UserId,
            UserId = profile.UserId,
            DisplayName = profile.DisplayName,
            CurrentTitle = profile.CustomTitle,
            Bio = profile.Bio,
            AvatarUrl = profile.AvatarUrl,
            TokenBalance = profile.TokenBalance,
            TotalTokensEarned = profile.TotalTokensEarned,
            DailyTokensEarned = profile.DailyTokensEarned,
            DailyTokensCap = 600,
            Level = profile.CurrentLevel,
            Xp = profile.TotalXp,
            TotalXp = profile.TotalXp,
            CurrentStreak = profile.CurrentStreak,
            HighestStreak = profile.HighestStreak,
            StreakDays = profile.CurrentStreak,
            UnlockedPresetSlots = profile.UnlockedPresetSlots,
            ActivePresetSlot = profile.ActivePresetSlot,
            AvatarConfig = avatarDto,
            SkillsMastery = skillsMastery
        });
    }

    [HttpPatch("title")]
    public async Task<ActionResult> UpdateTitle([FromBody] UpdateTitleRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.NewTitle))
        {
            return BadRequest(new { message = "Danh hiệu không được để trống." });
        }

        var userId = GetCurrentUserId();
        var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null)
        {
            return NotFound(new { message = "Không tìm thấy hồ sơ người dùng." });
        }

        profile.CustomTitle = request.NewTitle.Trim();
        profile.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { success = true, currentTitle = profile.CustomTitle });
    }

    [HttpPatch("bio")]
    public async Task<ActionResult> UpdateBio([FromBody] UpdateBioRequest request)
    {
        var userId = GetCurrentUserId();
        var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null)
        {
            return NotFound(new { message = "Không tìm thấy hồ sơ người dùng." });
        }

        profile.Bio = request.Bio?.Trim();
        profile.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { success = true, bio = profile.Bio });
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
