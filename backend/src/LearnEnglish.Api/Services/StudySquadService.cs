using LearnEnglish.Api.Data;
using LearnEnglish.Api.Domain.Entities;
using LearnEnglish.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Services;

public class StudySquadService : IStudySquadService
{
    private readonly AppDbContext _db;
    private readonly ILogger<StudySquadService> _logger;

    public StudySquadService(AppDbContext db, ILogger<StudySquadService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<MySquadResponse?> GetMySquadAsync(Guid userId)
    {
        var membership = await _db.SquadMembers
            .Include(m => m.Squad)
            .ThenInclude(s => s.Members)
            .ThenInclude(sm => sm.User)
            .ThenInclude(u => u.Profile)
            .FirstOrDefaultAsync(m => m.UserId == userId);

        if (membership == null)
        {
            return null;
        }

        var squad = membership.Squad;
        int totalWeeklyXp = squad.Members.Sum(m => m.WeeklyContributedXp);
        bool isEligible = membership.WeeklyContributedXp >= 100 && totalWeeklyXp >= 5000;

        var memberDtos = squad.Members
            .OrderByDescending(m => m.WeeklyContributedXp)
            .Select(m => new SquadMemberDto
            {
                UserId = m.UserId,
                UserName = m.UserId == userId ? $"{m.User?.Profile?.DisplayName ?? m.User?.Username ?? "Bạn"} (Bạn)" : (m.User?.Profile?.DisplayName ?? m.User?.Username ?? "Thành viên"),
                AvatarUrl = m.User?.Profile?.AvatarUrl,
                Role = m.Role,
                WeeklyXp = m.WeeklyContributedXp,
                HasReachedThreshold = m.WeeklyContributedXp >= 100,
                IsCurrentUser = m.UserId == userId
            })
            .ToList();

        return new MySquadResponse
        {
            SquadId = squad.Id,
            SquadCode = squad.SquadCode,
            Name = squad.Name,
            Description = squad.Description,
            MemberCount = squad.Members.Count,
            MaxMembers = squad.MaxMembers,
            WeeklyGoalXp = 5000,
            CurrentWeeklyXp = totalWeeklyXp,
            CurrentUserContributionXp = membership.WeeklyContributedXp,
            IsEligibleForReward = isEligible,
            HasClaimedReward = membership.HasClaimedWeeklyChest,
            Members = memberDtos
        };
    }

    public async Task<MySquadResponse> CreateSquadAsync(Guid userId, CreateSquadRequest request)
    {
        var existingMembership = await _db.SquadMembers.FirstOrDefaultAsync(m => m.UserId == userId);
        if (existingMembership != null)
        {
            throw new InvalidOperationException("Bạn đã là thành viên của một nhóm khác. Hãy rời nhóm trước khi tạo nhóm mới.");
        }

        string code = GenerateSquadCode();
        var squad = new StudySquad
        {
            SquadCode = code,
            Name = string.IsNullOrWhiteSpace(request.Name) ? $"Squad {code}" : request.Name.Trim(),
            Description = request.Description,
            LeaderUserId = userId,
            MaxMembers = 10,
            CurrentMembersCount = 1,
            TotalAccumulatedXp = 0,
            CreatedAt = DateTime.UtcNow
        };

        _db.StudySquads.Add(squad);

        var member = new SquadMember
        {
            SquadId = squad.Id,
            UserId = userId,
            Role = "Leader",
            WeeklyContributedXp = 0,
            HasClaimedWeeklyChest = false,
            JoinedAt = DateTime.UtcNow
        };

        _db.SquadMembers.Add(member);
        await _db.SaveChangesAsync();

        return (await GetMySquadAsync(userId))!;
    }

    public async Task<MySquadResponse> JoinSquadAsync(Guid userId, JoinSquadRequest request)
    {
        var existingMembership = await _db.SquadMembers.FirstOrDefaultAsync(m => m.UserId == userId);
        if (existingMembership != null)
        {
            throw new InvalidOperationException("Bạn đã là thành viên của một nhóm khác.");
        }

        var squad = await _db.StudySquads
            .Include(s => s.Members)
            .FirstOrDefaultAsync(s => s.SquadCode == request.SquadCode.Trim().ToUpperInvariant());

        if (squad == null)
        {
            throw new KeyNotFoundException($"Không tìm thấy nhóm học tập với mã {request.SquadCode}.");
        }

        if (squad.Members.Count >= squad.MaxMembers)
        {
            throw new InvalidOperationException("Nhóm này đã đủ tối đa 10 thành viên.");
        }

        var member = new SquadMember
        {
            SquadId = squad.Id,
            UserId = userId,
            Role = "Member",
            WeeklyContributedXp = 0,
            HasClaimedWeeklyChest = false,
            JoinedAt = DateTime.UtcNow
        };

        _db.SquadMembers.Add(member);
        squad.CurrentMembersCount += 1;
        await _db.SaveChangesAsync();

        return (await GetMySquadAsync(userId))!;
    }

    public async Task RecordSquadXpAsync(Guid userId, int xpEarned)
    {
        if (xpEarned <= 0) return;
        var member = await _db.SquadMembers
            .Include(m => m.Squad)
            .FirstOrDefaultAsync(m => m.UserId == userId);

        if (member != null)
        {
            member.WeeklyContributedXp += xpEarned;
            member.Squad.TotalAccumulatedXp += xpEarned;
            await _db.SaveChangesAsync();
        }
    }

    public async Task<ClaimSquadRewardResponse> ClaimWeeklyRewardAsync(Guid userId)
    {
        var member = await _db.SquadMembers
            .Include(m => m.Squad)
            .ThenInclude(s => s.Members)
            .FirstOrDefaultAsync(m => m.UserId == userId);

        if (member == null)
        {
            throw new KeyNotFoundException("Bạn chưa tham gia nhóm học tập nào.");
        }

        int totalXp = member.Squad.Members.Sum(m => m.WeeklyContributedXp);
        if (totalXp < 5000)
        {
            return new ClaimSquadRewardResponse
            {
                Success = false,
                Message = $"Nhóm của bạn mới đạt {totalXp}/5,000 XP tuần. Chưa đủ điều kiện mở Rương Siêu Cấp."
            };
        }

        if (member.WeeklyContributedXp < 100)
        {
            return new ClaimSquadRewardResponse
            {
                Success = false,
                Message = $"Bạn cần đóng góp ít nhất 100 XP cho nhóm trong tuần (hiện tại: {member.WeeklyContributedXp} XP)."
            };
        }

        if (member.HasClaimedWeeklyChest)
        {
            return new ClaimSquadRewardResponse
            {
                Success = false,
                Message = "Bạn đã nhận phần thưởng Rương Siêu Cấp tuần này rồi."
            };
        }

        member.HasClaimedWeeklyChest = true;

        var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile != null)
        {
            profile.Coins += 150;
        }

        var habit = await _db.UserHabitStates.FirstOrDefaultAsync(h => h.UserId == userId);
        if (habit != null && habit.StreakFreezeCount < 2)
        {
            habit.StreakFreezeCount += 1;
        }

        await _db.SaveChangesAsync();

        return new ClaimSquadRewardResponse
        {
            Success = true,
            AwardedCoins = 150,
            AwardedBoosterHours = 1,
            AwardedFreeze = 1,
            Message = "Chúc mừng! Bạn đã nhận thành công Hòm Siêu Cấp Nhóm: +150 Xu và +1 Băng Bảo Vệ Chuỗi!"
        };
    }

    public async Task ResetWeeklySquadXpAsync()
    {
        var members = await _db.SquadMembers.ToListAsync();
        foreach (var m in members)
        {
            m.WeeklyContributedXp = 0;
            m.HasClaimedWeeklyChest = false;
        }
        await _db.SaveChangesAsync();
        _logger.LogInformation("Reset weekly squad contributions for {Count} members.", members.Count);
    }

    private static string GenerateSquadCode()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var rnd = new Random();
        return new string(Enumerable.Repeat(chars, 6).Select(s => s[rnd.Next(s.Length)]).ToArray());
    }
}
