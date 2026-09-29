using LearnEnglish.Api.Data;
using LearnEnglish.Api.Domain.Entities;
using LearnEnglish.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Services;

public class HabitService : IHabitService
{
    private readonly AppDbContext _db;
    private readonly ILogger<HabitService> _logger;

    public HabitService(AppDbContext db, ILogger<HabitService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<HabitSummaryResponse> GetHabitSummaryAsync(Guid userId)
    {
        var habitState = await GetOrCreateHabitStateAsync(userId);
        var nowVn = DateTime.UtcNow.AddHours(7);
        var today = DateOnly.FromDateTime(nowVn);
        var time = nowVn.TimeOfDay;

        // Reset daily chests if day changed
        if (habitState.ActiveClaimedDate != today)
        {
            habitState.EarlyBirdClaimed = false;
            habitState.MiddayClaimed = false;
            habitState.NightOwlClaimed = false;
            habitState.ActiveClaimedDate = today;
            await _db.SaveChangesAsync();
        }

        bool earlyBirdAvailable = !habitState.EarlyBirdClaimed && (time >= new TimeSpan(6, 0, 0) && time <= new TimeSpan(10, 0, 0));
        bool middayAvailable = !habitState.MiddayClaimed && (time >= new TimeSpan(11, 30, 0) && time <= new TimeSpan(13, 30, 0));
        bool nightOwlAvailable = !habitState.NightOwlClaimed && (time >= new TimeSpan(19, 0, 0) && time <= new TimeSpan(23, 59, 59));

        // In dev or test environments, allow claiming if within window or if never claimed today
        bool isProtectedToday = habitState.LastActiveDate == today || habitState.StreakFreezeCount > 0;
        bool inGracePeriod = habitState.StreakBrokenAt.HasValue && (DateTime.UtcNow - habitState.StreakBrokenAt.Value).TotalHours < 24;

        return new HabitSummaryResponse
        {
            CurrentStreak = habitState.CurrentStreak,
            MaxStreak = habitState.MaxStreak,
            StreakFreezeCount = habitState.StreakFreezeCount,
            MaxAllowedFreeze = 2,
            IsStreakProtectedToday = isProtectedToday,
            IsStreakInGracePeriod = inGracePeriod,
            GracePeriodExpiresAt = habitState.StreakBrokenAt?.AddHours(24),
            Chests = new ChestsOverviewDto
            {
                EarlyBird = new ChestStatusDto
                {
                    Available = earlyBirdAvailable,
                    Claimed = habitState.EarlyBirdClaimed,
                    Window = "06:00 - 10:00"
                },
                Midday = new ChestStatusDto
                {
                    Available = middayAvailable,
                    Claimed = habitState.MiddayClaimed,
                    Window = "11:30 - 13:30"
                },
                NightOwl = new ChestStatusDto
                {
                    Available = nightOwlAvailable,
                    Claimed = habitState.NightOwlClaimed,
                    Window = "19:00 - 23:59"
                }
            }
        };
    }

    public async Task RecordActivityAndCheckStreakAsync(Guid userId, int xpEarned)
    {
        var habitState = await GetOrCreateHabitStateAsync(userId);
        var nowVn = DateTime.UtcNow.AddHours(7);
        var today = DateOnly.FromDateTime(nowVn);

        if (habitState.LastActiveDate == today)
        {
            // Already active today, streak already maintained
            return;
        }

        var yesterday = today.AddDays(-1);
        if (habitState.LastActiveDate == yesterday)
        {
            // Consecutive day, increase streak!
            habitState.CurrentStreak += 1;
            if (habitState.CurrentStreak > habitState.MaxStreak)
            {
                habitState.MaxStreak = habitState.CurrentStreak;
            }
            habitState.StreakBrokenAt = null;
        }
        else if (habitState.LastActiveDate == null)
        {
            // First time active
            habitState.CurrentStreak = 1;
            habitState.MaxStreak = 1;
        }
        else
        {
            // Missed more than 1 day
            if (habitState.StreakFreezeCount > 0)
            {
                // Streak freeze absorbed the miss
                habitState.StreakFreezeCount -= 1;
                habitState.CurrentStreak += 1;
                if (habitState.CurrentStreak > habitState.MaxStreak)
                {
                    habitState.MaxStreak = habitState.CurrentStreak;
                }
            }
            else
            {
                // Streak was broken, reset to 1
                habitState.CurrentStreak = 1;
                habitState.StreakBrokenAt = null;
            }
        }

        habitState.LastActiveDate = today;
        habitState.UpdatedAt = DateTime.UtcNow;

        // Also synchronize to UserProfile CurrentStreak
        var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile != null)
        {
            profile.CurrentStreak = habitState.CurrentStreak;
            profile.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
    }

    public async Task<BuyFreezeResponse> BuyStreakFreezeAsync(Guid userId)
    {
        var habitState = await GetOrCreateHabitStateAsync(userId);
        if (habitState.StreakFreezeCount >= 2)
        {
            return new BuyFreezeResponse
            {
                Success = false,
                NewStreakFreezeCount = habitState.StreakFreezeCount,
                Message = "Túi đồ đã đầy. Bạn chỉ có thể tích trữ tối đa 2 Băng Bảo Vệ."
            };
        }

        var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null)
        {
            throw new KeyNotFoundException("Không tìm thấy thông tin người dùng.");
        }

        const int freezeCost = 100;
        if (profile.Coins < freezeCost)
        {
            return new BuyFreezeResponse
            {
                Success = false,
                NewStreakFreezeCount = habitState.StreakFreezeCount,
                RemainingCoins = profile.Coins,
                Message = $"Bạn không đủ xu. Cần {freezeCost} xu để mua 1 Băng Bảo Vệ."
            };
        }

        profile.Coins -= freezeCost;
        habitState.StreakFreezeCount += 1;
        habitState.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return new BuyFreezeResponse
        {
            Success = true,
            NewStreakFreezeCount = habitState.StreakFreezeCount,
            RemainingCoins = profile.Coins,
            Message = "Đã mua thành công Băng Bảo Vệ Chuỗi! Chuỗi học tập của bạn được bảo vệ an toàn."
        };
    }

    public async Task<ClaimChestResponse> ClaimChestAsync(Guid userId, string chestType)
    {
        var habitState = await GetOrCreateHabitStateAsync(userId);
        var nowVn = DateTime.UtcNow.AddHours(7);
        var today = DateOnly.FromDateTime(nowVn);

        if (habitState.ActiveClaimedDate != today)
        {
            habitState.EarlyBirdClaimed = false;
            habitState.MiddayClaimed = false;
            habitState.NightOwlClaimed = false;
            habitState.ActiveClaimedDate = today;
        }

        var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null)
        {
            throw new KeyNotFoundException("Không tìm thấy thông tin người dùng.");
        }

        int coins = 0;
        int xp = 0;
        int tickets = 0;
        string msg;

        switch (chestType.ToLowerInvariant())
        {
            case "earlybird":
            case "early_bird":
                if (habitState.EarlyBirdClaimed)
                {
                    return new ClaimChestResponse { Message = "Bạn đã nhận Hòm Bình Minh hôm nay rồi!" };
                }
                habitState.EarlyBirdClaimed = true;
                coins = 15;
                xp = 30;
                msg = "Mở Hòm Bình Minh thành công! Nhận +15 Xu và +30 XP Booster!";
                break;

            case "midday":
            case "lunch":
                if (habitState.MiddayClaimed)
                {
                    return new ClaimChestResponse { Message = "Bạn đã nhận Hòm Năng Lượng trưa hôm nay rồi!" };
                }
                habitState.MiddayClaimed = true;
                coins = 20;
                tickets = 1;
                msg = "Mở Hòm Năng Lượng thành công! Nhận +20 Xu và 1 Vé Đấu 1v1!";
                break;

            case "nightowl":
            case "night_owl":
            case "dailymaster":
                if (habitState.NightOwlClaimed)
                {
                    return new ClaimChestResponse { Message = "Bạn đã nhận Hòm Báu Ngày hôm nay rồi!" };
                }
                habitState.NightOwlClaimed = true;
                coins = 50;
                xp = 100;
                msg = "Mở Hòm Báu Ngày thành công! Nhận +50 Xu và +100 XP!";
                break;

            default:
                throw new ArgumentException("Loại rương không hợp lệ: " + chestType);
        }

        profile.Coins += coins;
        profile.TotalXp += xp;
        habitState.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return new ClaimChestResponse
        {
            ChestType = chestType,
            AwardedCoins = coins,
            AwardedXp = xp,
            AwardedBattleTickets = tickets,
            Message = msg
        };
    }

    public async Task<RepairStreakResponse> RepairStreakAsync(Guid userId)
    {
        var habitState = await GetOrCreateHabitStateAsync(userId);
        if (!habitState.StreakBrokenAt.HasValue || (DateTime.UtcNow - habitState.StreakBrokenAt.Value).TotalHours > 24)
        {
            return new RepairStreakResponse
            {
                Success = false,
                Message = "Không có chuỗi nào trong thời hạn 24h để cứu."
            };
        }

        var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null) throw new KeyNotFoundException();

        const int repairCost = 200;
        if (profile.Coins < repairCost)
        {
            return new RepairStreakResponse
            {
                Success = false,
                RemainingCoins = profile.Coins,
                Message = $"Bạn cần {repairCost} xu để cứu chuỗi."
            };
        }

        profile.Coins -= repairCost;
        habitState.CurrentStreak = Math.Max(habitState.MaxStreak, 1);
        habitState.StreakBrokenAt = null;
        habitState.LastActiveDate = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(7));
        profile.CurrentStreak = habitState.CurrentStreak;

        await _db.SaveChangesAsync();

        return new RepairStreakResponse
        {
            Success = true,
            RestoredStreak = habitState.CurrentStreak,
            RemainingCoins = profile.Coins,
            Message = $"Đã cứu chuỗi thành công! Chuỗi {habitState.CurrentStreak} ngày đã được phục hồi!"
        };
    }

    public async Task ProcessMidnightStreakProtectionAsync()
    {
        var nowVn = DateTime.UtcNow.AddHours(7);
        var yesterday = DateOnly.FromDateTime(nowVn.AddDays(-1));

        var inactiveHabits = await _db.UserHabitStates
            .Where(h => h.CurrentStreak > 0 && h.LastActiveDate < yesterday)
            .ToListAsync();

        foreach (var habit in inactiveHabits)
        {
            if (habit.StreakFreezeCount > 0)
            {
                habit.StreakFreezeCount -= 1;
                _logger.LogInformation("Streak freeze consumed for User {UserId}", habit.UserId);
            }
            else
            {
                habit.CurrentStreak = 0;
                habit.StreakBrokenAt = DateTime.UtcNow;
                _logger.LogInformation("Streak broken for User {UserId}", habit.UserId);
            }
            habit.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
    }

    private async Task<UserHabitState> GetOrCreateHabitStateAsync(Guid userId)
    {
        var state = await _db.UserHabitStates.FirstOrDefaultAsync(h => h.UserId == userId);
        if (state == null)
        {
            var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            state = new UserHabitState
            {
                UserId = userId,
                CurrentStreak = profile?.CurrentStreak ?? 0,
                MaxStreak = profile?.CurrentStreak ?? 0,
                StreakFreezeCount = 0,
                LastActiveDate = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(7)),
                ActiveClaimedDate = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(7)),
                UpdatedAt = DateTime.UtcNow
            };
            _db.UserHabitStates.Add(state);
            await _db.SaveChangesAsync();
        }
        return state;
    }
}
