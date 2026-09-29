using System.Security.Claims;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.Domain.Entities;
using LearnEnglish.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Controllers;

[ApiController]
[Route("api/v1/users")]
public class UserRankController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserRankController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}/rank")]
    public async Task<ActionResult<UserRankProfileDto>> GetUserRank(Guid userId)
    {
        var userRank = await _context.UserRanks
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (userRank == null)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
            {
                return NotFound(new { message = "User not found" });
            }

            userRank = new UserRank
            {
                UserId = userId,
                Trophy = 0,
                Tier = RankTier.Bronze,
                Division = "III"
            };
            _context.UserRanks.Add(userRank);
            await _context.SaveChangesAsync();
        }

        double winRate = userRank.TotalMatches > 0 
            ? Math.Round((double)userRank.Wins / userRank.TotalMatches * 100, 1) 
            : 0;

        return Ok(new UserRankProfileDto
        {
            UserId = userRank.UserId,
            Trophy = userRank.Trophy,
            HighestTrophy = userRank.HighestTrophy,
            Tier = userRank.Tier.ToString(),
            Division = userRank.Division,
            WinStreak = userRank.WinStreak,
            HighestWinStreak = userRank.HighestWinStreak,
            ProtectionGamesLeft = userRank.ProtectionGamesLeft,
            TotalMatches = userRank.TotalMatches,
            Wins = userRank.Wins,
            Losses = userRank.Losses,
            Draws = userRank.Draws,
            WinRate = winRate,
            PenaltyUntil = userRank.PenaltyUntil
        });
    }

    [HttpGet("me/rank")]
    public async Task<ActionResult<UserRankProfileDto>> GetMyRank()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (!Guid.TryParse(userIdStr, out var currentUserId))
        {
            return Unauthorized(new { message = "Authentication required" });
        }

        return await GetUserRank(currentUserId);
    }
}
