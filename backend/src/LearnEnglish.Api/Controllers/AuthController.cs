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
[Route("api/v1")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ITokenService _tokenService;

    public AuthController(AppDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("auth/guest")]
    public async Task<ActionResult<GuestAuthResponse>> CreateGuestSession()
    {
        var randomSuffix = Random.Shared.Next(1000, 9999);
        var guestUser = new User
        {
            Id = Guid.NewGuid(),
            Username = $"guest_{Guid.NewGuid():N}"[..12],
            IsGuest = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var profile = new UserProfile
        {
            UserId = guestUser.Id,
            DisplayName = $"Người học mới #{randomSuffix}",
            AvatarUrl = $"https://api.dicebear.com/7.x/bottts/svg?seed={guestUser.Username}",
            TotalXp = 0,
            CurrentLevel = 1,
            CurrentStreak = 0,
            HighestStreak = 0,
            StreakFreezeCount = 1,
            UpdatedAt = DateTime.UtcNow
        };

        guestUser.Profile = profile;
        _context.Users.Add(guestUser);
        await _context.SaveChangesAsync();

        var (token, expiresAt) = _tokenService.GenerateJwtToken(guestUser);

        return Ok(new GuestAuthResponse
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = new UserSummaryDto
            {
                Id = guestUser.Id,
                Username = guestUser.Username,
                DisplayName = profile.DisplayName,
                IsGuest = true,
                TotalXp = profile.TotalXp,
                Coins = profile.Coins,
                CurrentLevel = profile.CurrentLevel,
                CurrentStreak = profile.CurrentStreak
            }
        });
    }

    [Authorize]
    [HttpGet("users/me/profile")]
    public async Task<ActionResult<UserProfileDto>> GetMyProfile()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (!Guid.TryParse(userIdStr, out var userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null || user.Profile == null)
        {
            return Unauthorized(new { error = "Hồ sơ người dùng không tồn tại hoặc phiên đăng nhập đã hết hạn." });
        }

        var profile = user.Profile;
        int level = profile.CurrentLevel;
        int currentLevelBaseXp = (int)(100 * Math.Pow(level - 1, 1.5));
        int nextLevelBaseXp = (int)(100 * Math.Pow(level, 1.5));

        return Ok(new UserProfileDto
        {
            UserId = user.Id,
            Username = user.Username,
            DisplayName = profile.DisplayName,
            AvatarUrl = profile.AvatarUrl,
            TotalXp = profile.TotalXp,
            Coins = profile.Coins,
            CurrentLevel = profile.CurrentLevel,
            CurrentLevelXp = Math.Max(0, profile.TotalXp - currentLevelBaseXp),
            NextLevelXp = Math.Max(100, nextLevelBaseXp - currentLevelBaseXp),
            CurrentStreak = profile.CurrentStreak,
            HighestStreak = profile.HighestStreak,
            StreakFreezeCount = profile.StreakFreezeCount,
            DailyXpEarned = 120, // Sample daily progress
            DailyXpCap = 1000
        });
    }
}
