using System.Security.Claims;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Controllers;

[ApiController]
[Route("api/v1/leaderboard")]
public class LeaderboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public LeaderboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("weekly")]
    public async Task<ActionResult<LeaderboardResponse>> GetWeeklyLeaderboard([FromQuery] int limit = 20, [FromQuery] int offset = 0)
    {
        var profiles = await _context.UserProfiles
            .OrderByDescending(p => p.TotalXp)
            .Skip(offset)
            .Take(limit)
            .ToListAsync();

        var topRankings = profiles.Select((p, index) => new LeaderboardRankDto
        {
            Rank = offset + index + 1,
            DisplayName = p.DisplayName,
            WeeklyXp = p.TotalXp,
            CurrentLevel = p.CurrentLevel,
            AvatarUrl = p.AvatarUrl
        }).ToList();

        var totalParticipants = await _context.UserProfiles.CountAsync();

        LeaderboardRankDto? myRank = null;
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (Guid.TryParse(userIdStr, out var currentUserId))
        {
            var myProfile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == currentUserId);
            if (myProfile != null)
            {
                var higherCount = await _context.UserProfiles.CountAsync(p => p.TotalXp > myProfile.TotalXp);
                myRank = new LeaderboardRankDto
                {
                    Rank = higherCount + 1,
                    DisplayName = myProfile.DisplayName,
                    WeeklyXp = myProfile.TotalXp,
                    CurrentLevel = myProfile.CurrentLevel,
                    AvatarUrl = myProfile.AvatarUrl
                };
            }
        }

        return Ok(new LeaderboardResponse
        {
            TotalParticipants = totalParticipants,
            MyRank = myRank,
            TopRankings = topRankings
        });
    }
}
