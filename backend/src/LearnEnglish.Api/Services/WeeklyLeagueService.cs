using LearnEnglish.Api.Data;
using LearnEnglish.Api.Domain.Entities;
using LearnEnglish.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Services;

public class WeeklyLeagueService : IWeeklyLeagueService
{
    private readonly AppDbContext _db;
    private readonly ILogger<WeeklyLeagueService> _logger;

    private static readonly string[] TierNames = ["", "Bronze", "Silver", "Gold", "Sapphire", "Diamond"];

    public WeeklyLeagueService(AppDbContext db, ILogger<WeeklyLeagueService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<WeeklyLeagueCurrentResponse> GetCurrentLeagueAsync(Guid userId)
    {
        var (weekStart, weekEnd) = GetCurrentWeekBounds();
        var leagueMember = await GetOrCreateUserLeagueMemberAsync(userId, weekStart, weekEnd);

        var allMembers = await _db.WeeklyLeagueMembers
            .Where(m => m.LeagueId == leagueMember.LeagueId)
            .Include(m => m.User)
            .ThenInclude(u => u.Profile)
            .OrderByDescending(m => m.WeeklyXp)
            .ThenBy(m => m.JoinedAt)
            .ToListAsync();

        var league = await _db.WeeklyLeagues.FirstAsync(l => l.Id == leagueMember.LeagueId);

        var endDateTime = weekEnd.ToDateTime(new TimeOnly(23, 59, 59), DateTimeKind.Utc);
        var timeRemaining = Math.Max(0, (long)(endDateTime - DateTime.UtcNow).TotalSeconds);

        int rank = 1;
        int userRank = 1;
        int userXp = 0;
        var leaderboard = new List<LeagueMemberDto>();

        foreach (var m in allMembers)
        {
            string zone = "Safe";
            if (rank <= 7) zone = "Promotion";
            else if (rank >= 26 && league.LeagueTier > 1) zone = "Demotion";

            bool isMe = m.UserId == userId;
            if (isMe)
            {
                userRank = rank;
                userXp = m.WeeklyXp;
            }

            leaderboard.Add(new LeagueMemberDto
            {
                Rank = rank,
                UserId = m.UserId,
                UserName = isMe ? $"{m.User?.Profile?.DisplayName ?? m.User?.Username ?? "Bạn"} (Bạn)" : (m.User?.Profile?.DisplayName ?? m.User?.Username ?? $"Học viên {rank}"),
                AvatarUrl = m.User?.Profile?.AvatarUrl,
                WeeklyXp = m.WeeklyXp,
                Zone = zone,
                IsCurrentUser = isMe
            });

            rank++;
        }

        string tierName = league.LeagueTier >= 1 && league.LeagueTier <= 5 ? TierNames[league.LeagueTier] : "Bronze";

        return new WeeklyLeagueCurrentResponse
        {
            LeagueTier = league.LeagueTier,
            LeagueTierName = tierName,
            RoomCode = league.RoomCode,
            TimeRemainingSeconds = timeRemaining,
            CurrentUserRank = userRank,
            CurrentUserXp = userXp,
            Leaderboard = leaderboard
        };
    }

    public async Task RecordLeagueXpAsync(Guid userId, int xpEarned)
    {
        if (xpEarned <= 0) return;
        var (weekStart, weekEnd) = GetCurrentWeekBounds();
        var leagueMember = await GetOrCreateUserLeagueMemberAsync(userId, weekStart, weekEnd);
        leagueMember.WeeklyXp += xpEarned;
        await _db.SaveChangesAsync();
    }

    public async Task FinalizeCurrentWeekLeaguesAsync()
    {
        var (weekStart, weekEnd) = GetCurrentWeekBounds();
        var activeLeagues = await _db.WeeklyLeagues
            .Where(l => l.Status == "Active" && l.WeekEndDate <= weekEnd)
            .Include(l => l.Members)
            .ToListAsync();

        foreach (var league in activeLeagues)
        {
            var orderedMembers = league.Members
                .OrderByDescending(m => m.WeeklyXp)
                .ThenBy(m => m.JoinedAt)
                .ToList();

            int r = 1;
            foreach (var member in orderedMembers)
            {
                member.FinalRank = r;
                if (r <= 7)
                {
                    member.OutcomeStatus = "Promoted";
                    // Reward bonus coins for promotion
                    var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == member.UserId);
                    if (profile != null)
                    {
                        profile.Coins += (r <= 3 ? 100 : 50);
                    }
                }
                else if (r >= 26 && league.LeagueTier > 1)
                {
                    member.OutcomeStatus = "Demoted";
                }
                else
                {
                    member.OutcomeStatus = "Safe";
                }
                r++;
            }

            league.Status = "Finalized";
        }

        await _db.SaveChangesAsync();
        _logger.LogInformation("Finalized {Count} weekly leagues.", activeLeagues.Count);
    }

    private async Task<WeeklyLeagueMember> GetOrCreateUserLeagueMemberAsync(Guid userId, DateOnly weekStart, DateOnly weekEnd)
    {
        var existing = await _db.WeeklyLeagueMembers
            .Include(m => m.League)
            .FirstOrDefaultAsync(m => m.UserId == userId && m.League.WeekStartDate == weekStart && m.League.Status == "Active");

        if (existing != null)
        {
            return existing;
        }

        // Determine user tier (default 1: Bronze, or based on previous week outcome)
        int tier = 1;
        var lastMember = await _db.WeeklyLeagueMembers
            .Include(m => m.League)
            .Where(m => m.UserId == userId && m.League.Status == "Finalized")
            .OrderByDescending(m => m.League.WeekStartDate)
            .FirstOrDefaultAsync();

        if (lastMember != null)
        {
            if (lastMember.OutcomeStatus == "Promoted")
            {
                tier = Math.Min(5, lastMember.League.LeagueTier + 1);
            }
            else if (lastMember.OutcomeStatus == "Demoted")
            {
                tier = Math.Max(1, lastMember.League.LeagueTier - 1);
            }
            else
            {
                tier = lastMember.League.LeagueTier;
            }
        }

        // Find an open active room with < 30 participants
        var room = await _db.WeeklyLeagues
            .Include(l => l.Members)
            .Where(l => l.WeekStartDate == weekStart && l.LeagueTier == tier && l.Status == "Active")
            .OrderBy(l => l.CreatedAt)
            .FirstOrDefaultAsync(l => l.Members.Count < l.MaxParticipants);

        if (room == null)
        {
            string tierName = TierNames[tier];
            int roomIndex = await _db.WeeklyLeagues.CountAsync(l => l.WeekStartDate == weekStart && l.LeagueTier == tier) + 1;
            room = new WeeklyLeague
            {
                LeagueTier = tier,
                WeekStartDate = weekStart,
                WeekEndDate = weekEnd,
                RoomCode = $"{tierName}-Room-{roomIndex:D3}",
                MaxParticipants = 30,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };
            _db.WeeklyLeagues.Add(room);
            await _db.SaveChangesAsync();

            // Populate room with some bot / simulated participants to feel like a real 30-player league
            await SeedSimulatedLeagueCompetitorsAsync(room);
        }

        var newMember = new WeeklyLeagueMember
        {
            LeagueId = room.Id,
            UserId = userId,
            WeeklyXp = 0,
            OutcomeStatus = "Pending",
            JoinedAt = DateTime.UtcNow
        };

        _db.WeeklyLeagueMembers.Add(newMember);
        await _db.SaveChangesAsync();

        return newMember;
    }

    private async Task SeedSimulatedLeagueCompetitorsAsync(WeeklyLeague room)
    {
        // Pick other registered users or seed active bot players
        var otherUsers = await _db.Users
            .Include(u => u.Profile)
            .Where(u => !u.LeagueMemberships.Any(m => m.LeagueId == room.Id))
            .Take(15)
            .ToListAsync();

        var rnd = new Random();
        foreach (var u in otherUsers)
        {
            if (room.Members.Count >= 25) break;
            _db.WeeklyLeagueMembers.Add(new WeeklyLeagueMember
            {
                LeagueId = room.Id,
                UserId = u.Id,
                WeeklyXp = rnd.Next(150, 1800),
                OutcomeStatus = "Pending",
                JoinedAt = DateTime.UtcNow.AddHours(-rnd.Next(1, 48))
            });
        }
        await _db.SaveChangesAsync();
    }

    private static (DateOnly WeekStart, DateOnly WeekEnd) GetCurrentWeekBounds()
    {
        var nowVn = DateTime.UtcNow.AddHours(7);
        var today = DateOnly.FromDateTime(nowVn);
        int diff = (7 + (int)today.DayOfWeek - (int)DayOfWeek.Monday) % 7;
        var monday = today.AddDays(-diff);
        var sunday = monday.AddDays(6);
        return (monday, sunday);
    }
}
