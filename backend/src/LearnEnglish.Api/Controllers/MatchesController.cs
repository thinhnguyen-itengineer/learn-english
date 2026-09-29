using System.Security.Claims;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Controllers;

[ApiController]
[Route("api/v1/matches")]
public class MatchesController : ControllerBase
{
    private readonly AppDbContext _context;

    public MatchesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("history")]
    public async Task<ActionResult<MatchHistoryResponse>> GetMatchHistory(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10
    )
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (!Guid.TryParse(userIdStr, out var currentUserId))
        {
            return Unauthorized(new { message = "Authentication required" });
        }

        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 50);

        // Fetch user rank for summary
        var userRank = await _context.UserRanks
            .FirstOrDefaultAsync(r => r.UserId == currentUserId);

        double winRate = (userRank != null && userRank.TotalMatches > 0)
            ? Math.Round((double)userRank.Wins / userRank.TotalMatches * 100, 1)
            : 0;

        var summary = new MatchHistorySummaryDto
        {
            TotalMatches = userRank?.TotalMatches ?? 0,
            Wins = userRank?.Wins ?? 0,
            Losses = userRank?.Losses ?? 0,
            Draws = userRank?.Draws ?? 0,
            WinRate = winRate,
            CurrentWinStreak = userRank?.WinStreak ?? 0,
            HighestWinStreak = userRank?.HighestWinStreak ?? 0,
            CurrentTrophy = userRank?.Trophy ?? 0,
            HighestTrophy = userRank?.HighestTrophy ?? 0,
            CurrentTier = userRank?.Tier.ToString() ?? "Bronze",
            CurrentDivision = userRank?.Division ?? "III"
        };

        // Fetch participants for this user
        var myParticipations = await _context.MatchParticipants
            .Include(p => p.Match)
                .ThenInclude(m => m.Topic)
            .Include(p => p.Match)
                .ThenInclude(m => m.Participants)
            .Where(p => p.UserId == currentUserId)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var historyItems = new List<MatchHistoryItemDto>();

        foreach (var myPart in myParticipations)
        {
            var match = myPart.Match;
            var oppPart = match.Participants.FirstOrDefault(p => p.Id != myPart.Id);

            string oppDisplayName = "Đối thủ";
            string oppAvatarUrl = "https://api.dicebear.com/7.x/bottts/svg?seed=opponent";
            string oppTier = "Bronze";
            string oppDivision = "III";

            if (oppPart != null)
            {
                if (oppPart.IsBot)
                {
                    oppDisplayName = "AI Bot (Tập luyện)";
                    oppAvatarUrl = "https://api.dicebear.com/7.x/bottts/svg?seed=bot";
                }
                else
                {
                    var oppUser = await _context.Users
                        .Include(u => u.Profile)
                        .Include(u => u.Rank)
                        .FirstOrDefaultAsync(u => u.Id == oppPart.UserId);

                    if (oppUser != null)
                    {
                        oppDisplayName = oppUser.Profile?.DisplayName ?? oppUser.Username;
                        oppAvatarUrl = oppUser.Profile?.AvatarUrl ?? $"https://api.dicebear.com/7.x/bottts/svg?seed={oppUser.Username}";
                        oppTier = oppUser.Rank?.Tier.ToString() ?? "Bronze";
                        oppDivision = oppUser.Rank?.Division ?? "III";
                    }
                }
            }

            historyItems.Add(new MatchHistoryItemDto
            {
                MatchId = match.Id,
                TopicName = match.Topic?.Name ?? "Từ Vựng Chung",
                Opponent = new OpponentSummaryDto
                {
                    DisplayName = oppDisplayName,
                    AvatarUrl = oppAvatarUrl,
                    Tier = oppTier,
                    Division = oppDivision
                },
                Result = myPart.Result.ToString(),
                MyScore = myPart.FinalScore,
                OpponentScore = oppPart?.FinalScore ?? 0,
                TrophyChange = myPart.TrophyChange,
                DurationSeconds = match.DurationSeconds,
                PlayedAt = match.StartedAt
            });
        }

        return Ok(new MatchHistoryResponse
        {
            Summary = summary,
            History = historyItems
        });
    }
}
