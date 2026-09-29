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

    [HttpGet("battle")]
    public async Task<ActionResult<BattleLeaderboardResponse>> GetBattleLeaderboard(
        [FromQuery] string type = "Season",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50
    )
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var activeSeason = await _context.Seasons.FirstOrDefaultAsync(s => s.IsActive);
        var seasonInfo = activeSeason != null ? new SeasonInfoDto
        {
            Id = activeSeason.Id,
            SeasonNumber = activeSeason.SeasonNumber,
            Name = activeSeason.Name,
            DaysRemaining = Math.Max(0, (int)(activeSeason.EndAt - DateTime.UtcNow).TotalDays)
        } : null;

        var query = _context.UserRanks
            .Include(r => r.User)
                .ThenInclude(u => u.Profile)
            .OrderByDescending(r => r.Trophy)
            .ThenByDescending(r => r.Wins);

        var totalCount = await query.CountAsync();

        var rankedList = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = rankedList.Select((r, index) =>
        {
            double winRate = r.TotalMatches > 0 ? Math.Round((double)r.Wins / r.TotalMatches * 100, 1) : 0;
            return new BattleLeaderboardItemDto
            {
                RankPosition = (page - 1) * pageSize + index + 1,
                UserId = r.UserId,
                DisplayName = r.User.Profile?.DisplayName ?? r.User.Username,
                AvatarUrl = r.User.Profile?.AvatarUrl ?? $"https://api.dicebear.com/7.x/bottts/svg?seed={r.User.Username}",
                Tier = r.Tier.ToString(),
                Division = r.Division,
                Trophy = r.Trophy,
                WinRate = winRate,
                WinStreak = r.WinStreak
            };
        }).ToList();

        BattleLeaderboardItemDto? myRank = null;
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (Guid.TryParse(userIdStr, out var currentUserId))
        {
            var myUserRank = await _context.UserRanks
                .Include(r => r.User)
                    .ThenInclude(u => u.Profile)
                .FirstOrDefaultAsync(r => r.UserId == currentUserId);

            if (myUserRank != null)
            {
                var higherCount = await _context.UserRanks.CountAsync(r => r.Trophy > myUserRank.Trophy);
                double myWinRate = myUserRank.TotalMatches > 0 ? Math.Round((double)myUserRank.Wins / myUserRank.TotalMatches * 100, 1) : 0;
                myRank = new BattleLeaderboardItemDto
                {
                    RankPosition = higherCount + 1,
                    UserId = myUserRank.UserId,
                    DisplayName = myUserRank.User.Profile?.DisplayName ?? myUserRank.User.Username,
                    AvatarUrl = myUserRank.User.Profile?.AvatarUrl ?? $"https://api.dicebear.com/7.x/bottts/svg?seed={myUserRank.User.Username}",
                    Tier = myUserRank.Tier.ToString(),
                    Division = myUserRank.Division,
                    Trophy = myUserRank.Trophy,
                    WinRate = myWinRate,
                    WinStreak = myUserRank.WinStreak
                };
            }
        }

        return Ok(new BattleLeaderboardResponse
        {
            Season = seasonInfo,
            MyRank = myRank,
            Items = items,
            TotalCount = totalCount
        });
    }
}
