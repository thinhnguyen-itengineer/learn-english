using LearnEnglish.Api.Data;
using LearnEnglish.Api.Domain.Entities;
using LearnEnglish.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Services;

public class SkillService : ISkillService
{
    private readonly AppDbContext _context;

    public SkillService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<SkillsOverviewResponse> GetSkillsOverviewAsync(Guid? userId)
    {
        var domains = await _context.SkillDomains
            .Where(d => d.IsActive)
            .OrderBy(d => d.DisplayOrder)
            .Include(d => d.Games.Where(g => g.IsActive).OrderBy(g => g.DisplayOrder))
            .ToListAsync();

        var userProgressMap = new Dictionary<string, UserSkillProgress>(StringComparer.OrdinalIgnoreCase);
        if (userId.HasValue)
        {
            var userProgresses = await _context.UserSkillProgresses
                .Where(p => p.UserId == userId.Value)
                .ToListAsync();

            foreach (var prog in userProgresses)
            {
                userProgressMap[prog.SkillDomainCode] = prog;
            }
        }

        var skillDtos = new List<SkillDomainDto>();
        decimal listeningMastery = 0m;
        decimal readingMastery = 0m;
        decimal writingMastery = 0m;
        decimal speakingMastery = 0m;

        foreach (var d in domains)
        {
            userProgressMap.TryGetValue(d.Code, out var prog);

            decimal mastery = prog?.MasteryScore ?? 0m;
            int totalXp = prog?.TotalXp ?? 0;
            int gamesPlayed = prog?.GamesPlayed ?? 0;
            int perfectGames = prog?.PerfectGames ?? 0;

            var (badgeTier, badgeTitle) = CalculateSkillBadge(d.Code, mastery);

            switch (d.Code.ToUpperInvariant())
            {
                case SkillDomainConstants.Listening:
                    listeningMastery = mastery;
                    break;
                case SkillDomainConstants.Reading:
                    readingMastery = mastery;
                    break;
                case SkillDomainConstants.Writing:
                    writingMastery = mastery;
                    break;
                case SkillDomainConstants.Speaking:
                    speakingMastery = mastery;
                    break;
            }

            var gameDtos = d.Games.Select(g => new SkillDomainGameDto
            {
                Id = g.Id,
                SkillDomainCode = g.SkillDomainCode,
                GameTypeCode = g.GameTypeCode,
                DisplayTitle = g.DisplayTitle,
                DifficultyTier = g.DifficultyTier,
                IsPrimary = g.IsPrimary,
                DisplayOrder = g.DisplayOrder
            }).ToList();

            skillDtos.Add(new SkillDomainDto
            {
                Code = d.Code,
                NameVi = d.NameVi,
                NameEn = d.NameEn,
                Description = d.Description,
                IconName = d.IconName,
                ThemeColor = d.ThemeColor,
                DisplayOrder = d.DisplayOrder,
                MasteryScore = mastery,
                TotalXp = totalXp,
                GamesPlayed = gamesPlayed,
                PerfectGames = perfectGames,
                BadgeTier = badgeTier,
                BadgeLevel = badgeTitle,
                Games = gameDtos
            });
        }

        // Radar calculation
        var scores = new Dictionary<string, decimal>
        {
            [SkillDomainConstants.Speaking] = speakingMastery,
            [SkillDomainConstants.Writing] = writingMastery,
            [SkillDomainConstants.Reading] = readingMastery,
            [SkillDomainConstants.Listening] = listeningMastery
        };

        var weakestSkill = scores.OrderBy(kv => kv.Value).First().Key;
        var strongestSkill = scores.OrderByDescending(kv => kv.Value).First().Key;

        var (recCode, recTitle) = GetRecommendedGameForSkill(weakestSkill);

        var radar = new SkillRadarDto
        {
            Listening = listeningMastery,
            Reading = readingMastery,
            Writing = writingMastery,
            Speaking = speakingMastery,
            WeakestSkill = weakestSkill,
            StrongestSkill = strongestSkill,
            RecommendedGameCode = recCode,
            RecommendedGameTitle = recTitle
        };

        return new SkillsOverviewResponse
        {
            Skills = skillDtos,
            Radar = radar
        };
    }

    public async Task<SkillDomainDto> GetSkillDomainDetailsAsync(string domainCode, Guid? userId)
    {
        var domain = await _context.SkillDomains
            .Where(d => d.Code.ToUpper() == domainCode.ToUpper())
            .Include(d => d.Games.Where(g => g.IsActive).OrderBy(g => g.DisplayOrder))
            .FirstOrDefaultAsync();

        if (domain == null)
        {
            throw new KeyNotFoundException($"Không tìm thấy kỹ năng có mã '{domainCode}'.");
        }

        UserSkillProgress? prog = null;
        if (userId.HasValue)
        {
            prog = await _context.UserSkillProgresses
                .FirstOrDefaultAsync(p => p.UserId == userId.Value && p.SkillDomainCode.ToUpper() == domain.Code.ToUpper());
        }

        decimal mastery = prog?.MasteryScore ?? 0m;
        int totalXp = prog?.TotalXp ?? 0;
        int gamesPlayed = prog?.GamesPlayed ?? 0;
        int perfectGames = prog?.PerfectGames ?? 0;

        var (badgeTier, badgeTitle) = CalculateSkillBadge(domain.Code, mastery);

        var gameDtos = domain.Games.Select(g => new SkillDomainGameDto
        {
            Id = g.Id,
            SkillDomainCode = g.SkillDomainCode,
            GameTypeCode = g.GameTypeCode,
            DisplayTitle = g.DisplayTitle,
            DifficultyTier = g.DifficultyTier,
            IsPrimary = g.IsPrimary,
            DisplayOrder = g.DisplayOrder
        }).ToList();

        return new SkillDomainDto
        {
            Code = domain.Code,
            NameVi = domain.NameVi,
            NameEn = domain.NameEn,
            Description = domain.Description,
            IconName = domain.IconName,
            ThemeColor = domain.ThemeColor,
            DisplayOrder = domain.DisplayOrder,
            MasteryScore = mastery,
            TotalXp = totalXp,
            GamesPlayed = gamesPlayed,
            PerfectGames = perfectGames,
            BadgeTier = badgeTier,
            BadgeLevel = badgeTitle,
            Games = gameDtos
        };
    }

    public async Task<DailyBalancedStatusDto> GetDailyBalancedStatusAsync(Guid userId)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            throw new UnauthorizedAccessException("Người dùng không tồn tại hoặc phiên đăng nhập đã hết hạn.");
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var daily = await _context.DailyBalancedProgresses
            .FirstOrDefaultAsync(d => d.UserId == userId && d.PracticeDate == today);

        if (daily == null)
        {
            daily = new DailyBalancedProgress
            {
                UserId = userId,
                PracticeDate = today,
                CompletedListening = false,
                CompletedReading = false,
                CompletedWriting = false,
                CompletedSpeaking = false,
                BonusClaimed = false
            };
            _context.DailyBalancedProgresses.Add(daily);
            await _context.SaveChangesAsync();
        }

        int count = 0;
        if (daily.CompletedListening) count++;
        if (daily.CompletedReading) count++;
        if (daily.CompletedWriting) count++;
        if (daily.CompletedSpeaking) count++;

        return new DailyBalancedStatusDto
        {
            PracticeDate = today.ToString("yyyy-MM-dd"),
            CompletedListening = daily.CompletedListening,
            CompletedReading = daily.CompletedReading,
            CompletedWriting = daily.CompletedWriting,
            CompletedSpeaking = daily.CompletedSpeaking,
            CompletedCount = count,
            AllCompleted = count == 4,
            BonusClaimed = daily.BonusClaimed,
            RewardCoins = 50,
            RewardXp = 100
        };
    }

    public async Task<ClaimBonusResponse> ClaimBalancedBonusAsync(Guid userId)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            throw new UnauthorizedAccessException("Người dùng không tồn tại hoặc phiên đăng nhập đã hết hạn.");
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var daily = await _context.DailyBalancedProgresses
            .FirstOrDefaultAsync(d => d.UserId == userId && d.PracticeDate == today);

        if (daily == null)
        {
            throw new InvalidOperationException("Chưa có tiến trình học tập hôm nay. Hãy hoàn thành cả 4 kỹ năng trước khi nhận thưởng.");
        }

        int count = 0;
        if (daily.CompletedListening) count++;
        if (daily.CompletedReading) count++;
        if (daily.CompletedWriting) count++;
        if (daily.CompletedSpeaking) count++;

        if (count < 4)
        {
            throw new InvalidOperationException($"Bạn mới hoàn thành {count}/4 kỹ năng hôm nay. Hãy hoàn thành đủ cả 4 kỹ năng (Nghe, Đọc, Viết, Nói) để mở khóa phần thưởng Balanced Learner!");
        }

        if (daily.BonusClaimed)
        {
            throw new InvalidOperationException("Bạn đã nhận phần thưởng Balanced Learner của ngày hôm nay rồi.");
        }

        daily.BonusClaimed = true;
        daily.BonusClaimedAt = DateTime.UtcNow;
        daily.UpdatedAt = DateTime.UtcNow;

        var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile != null)
        {
            profile.Coins += 50;
            profile.TotalXp += 100;
            profile.CurrentLevel = Math.Max(1, (int)Math.Pow(profile.TotalXp / 100.0, 0.6667) + 1);
            profile.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return new ClaimBonusResponse
        {
            Success = true,
            Message = "Chúc mừng! Bạn đã nhận thưởng +50 Coins và +100 XP danh hiệu Toàn Diện 4 Kỹ Năng!",
            RewardCoins = 50,
            RewardXp = 100,
            TotalCoins = profile?.Coins ?? 50,
            TotalXp = profile?.TotalXp ?? 100
        };
    }

    public async Task<RecommendedSkillDto> GetRecommendedSkillAsync(Guid? userId)
    {
        var domains = await _context.SkillDomains
            .Where(d => d.IsActive)
            .OrderBy(d => d.DisplayOrder)
            .ToListAsync();

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        DailyBalancedProgress? daily = null;
        var progressMap = new Dictionary<string, UserSkillProgress>(StringComparer.OrdinalIgnoreCase);

        if (userId.HasValue)
        {
            daily = await _context.DailyBalancedProgresses
                .FirstOrDefaultAsync(d => d.UserId == userId.Value && d.PracticeDate == today);

            var progs = await _context.UserSkillProgresses
                .Where(p => p.UserId == userId.Value)
                .ToListAsync();

            foreach (var p in progs)
            {
                progressMap[p.SkillDomainCode] = p;
            }
        }

        // Check if there is an uncompleted skill for today's daily balanced quest
        string targetDomainCode = SkillDomainConstants.Speaking;
        string reason = "Kỹ năng cần được rèn luyện thêm để cân bằng năng lực toàn diện.";

        if (daily != null)
        {
            if (!daily.CompletedSpeaking)
            {
                targetDomainCode = SkillDomainConstants.Speaking;
                reason = "Bạn chưa luyện kỹ năng Nói hôm nay. Hãy hoàn thành để nhận +50 Coins!";
            }
            else if (!daily.CompletedWriting)
            {
                targetDomainCode = SkillDomainConstants.Writing;
                reason = "Bạn chưa luyện kỹ năng Viết hôm nay. Hoàn thành để mở khóa Balanced Quest!";
            }
            else if (!daily.CompletedListening)
            {
                targetDomainCode = SkillDomainConstants.Listening;
                reason = "Bạn chưa luyện kỹ năng Nghe hôm nay. Thử ngay Audio Blitz hoặc Dictation Dash!";
            }
            else if (!daily.CompletedReading)
            {
                targetDomainCode = SkillDomainConstants.Reading;
                reason = "Bạn chưa luyện kỹ năng Đọc hôm nay. Củng cố vốn từ cùng Word Match!";
            }
            else
            {
                // Find weakest mastery
                var sorted = domains
                    .Select(d => new
                    {
                        Domain = d,
                        Score = progressMap.TryGetValue(d.Code, out var pr) ? pr.MasteryScore : 0m
                    })
                    .OrderBy(x => x.Score)
                    .First();

                targetDomainCode = sorted.Domain.Code;
                reason = $"Kỹ năng {sorted.Domain.NameVi} của bạn đang ở mức {sorted.Score}% Mastery, hãy luyện tập để nâng cao!";
            }
        }
        else
        {
            var sorted = domains
                .Select(d => new
                {
                    Domain = d,
                    Score = progressMap.TryGetValue(d.Code, out var pr) ? pr.MasteryScore : 0m
                })
                .OrderBy(x => x.Score)
                .First();

            targetDomainCode = sorted.Domain.Code;
            reason = $"Kỹ năng {sorted.Domain.NameVi} của bạn đang cần được rèn luyện thêm!";
        }

        var domain = domains.FirstOrDefault(d => d.Code.Equals(targetDomainCode, StringComparison.OrdinalIgnoreCase)) ?? domains.First();
        decimal currentMastery = progressMap.TryGetValue(domain.Code, out var userProg) ? userProg.MasteryScore : 0m;
        var (recGameCode, recGameTitle) = GetRecommendedGameForSkill(domain.Code);

        return new RecommendedSkillDto
        {
            SkillDomainCode = domain.Code,
            SkillNameVi = domain.NameVi,
            SkillNameEn = domain.NameEn,
            CurrentMastery = currentMastery,
            Reason = reason,
            RecommendedGameCode = recGameCode,
            RecommendedGameTitle = recGameTitle,
            DifficultyTier = "A1_A2"
        };
    }

    public async Task RecordSkillProgressOnGameCompleteAsync(Guid userId, string gameTypeCode, decimal accuracy, int xpEarned)
    {
        string? skillCode = MapGameTypeToSkillDomain(gameTypeCode);
        if (skillCode == null) return;

        // 1. Update UserSkillProgress
        var prog = await _context.UserSkillProgresses
            .FirstOrDefaultAsync(p => p.UserId == userId && p.SkillDomainCode.ToUpper() == skillCode.ToUpper());

        if (prog == null)
        {
            prog = new UserSkillProgress
            {
                UserId = userId,
                SkillDomainCode = skillCode,
                MasteryScore = 0m,
                TotalXp = 0,
                GamesPlayed = 0,
                PerfectGames = 0
            };
            _context.UserSkillProgresses.Add(prog);
        }

        prog.GamesPlayed += 1;
        prog.TotalXp += xpEarned;
        if (accuracy >= 100m)
        {
            prog.PerfectGames += 1;
        }
        prog.LastPracticedAt = DateTime.UtcNow;
        prog.UpdatedAt = DateTime.UtcNow;

        // Mastery progress: +2.5% if >= 80%, +1.0% if >= 50%
        decimal masteryIncrement = accuracy switch
        {
            >= 80.0m => 2.5m,
            >= 50.0m => 1.0m,
            _ => 0m
        };

        prog.MasteryScore = Math.Min(100m, prog.MasteryScore + masteryIncrement);

        // 2. Update DailyBalancedProgress
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var daily = await _context.DailyBalancedProgresses
            .FirstOrDefaultAsync(d => d.UserId == userId && d.PracticeDate == today);

        if (daily == null)
        {
            daily = new DailyBalancedProgress
            {
                UserId = userId,
                PracticeDate = today
            };
            _context.DailyBalancedProgresses.Add(daily);
        }

        switch (skillCode)
        {
            case SkillDomainConstants.Listening:
                daily.CompletedListening = true;
                break;
            case SkillDomainConstants.Reading:
                daily.CompletedReading = true;
                break;
            case SkillDomainConstants.Writing:
                daily.CompletedWriting = true;
                break;
            case SkillDomainConstants.Speaking:
                daily.CompletedSpeaking = true;
                break;
        }

        daily.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    private static (string Tier, string Title) CalculateSkillBadge(string domainCode, decimal masteryScore)
    {
        string tier = masteryScore switch
        {
            >= 100m => "Diamond",
            >= 75m => "Gold",
            >= 50m => "Silver",
            _ => "Bronze"
        };

        string title = (domainCode.ToUpperInvariant(), tier) switch
        {
            (SkillDomainConstants.Listening, "Bronze") => "Bronze Ear",
            (SkillDomainConstants.Listening, "Silver") => "Silver Listener",
            (SkillDomainConstants.Listening, "Gold") => "Master Decoder",
            (SkillDomainConstants.Listening, "Diamond") => "Ultimate Sonic Native",

            (SkillDomainConstants.Reading, "Bronze") => "Word Seeker",
            (SkillDomainConstants.Reading, "Silver") => "Agile Scanner",
            (SkillDomainConstants.Reading, "Gold") => "Critical Reader",
            (SkillDomainConstants.Reading, "Diamond") => "Lexical Scholar",

            (SkillDomainConstants.Writing, "Bronze") => "Sentence Builder",
            (SkillDomainConstants.Writing, "Silver") => "Clause Architect",
            (SkillDomainConstants.Writing, "Gold") => "Stylistic Writer",
            (SkillDomainConstants.Writing, "Diamond") => "Master Wordsmith",

            (SkillDomainConstants.Speaking, "Bronze") => "Echo Apprentice",
            (SkillDomainConstants.Speaking, "Silver") => "Clear Speaker",
            (SkillDomainConstants.Speaking, "Gold") => "Rhythmic Voice",
            (SkillDomainConstants.Speaking, "Diamond") => "Native Fluency Titan",

            _ => "Học viên"
        };

        return (tier, title);
    }

    private static (string GameCode, string GameTitle) GetRecommendedGameForSkill(string domainCode)
    {
        return domainCode.ToUpperInvariant() switch
        {
            SkillDomainConstants.Listening => ("AUDIO_BLITZ", "Audio Blitz (Nghe & Điền Chính Tả)"),
            SkillDomainConstants.Reading => ("WORD_MATCH", "Word Match (Ghép Thẻ Từ Vựng & Nghĩa)"),
            SkillDomainConstants.Writing => ("SENTENCE_SCRAMBLE", "Sentence Scramble (Sắp Xếp Trật Tự Câu)"),
            SkillDomainConstants.Speaking => ("MINIMAL_PAIRS", "Minimal Pairs Duel (Đấu Sĩ Phân Biệt Cặp Âm)"),
            _ => ("WORD_MATCH", "Word Match")
        };
    }

    private static string? MapGameTypeToSkillDomain(string gameTypeCode)
    {
        var code = gameTypeCode.Trim().ToUpperInvariant();
        return code switch
        {
            "AUDIOBLITZ" or "AUDIO_BLITZ" or "DICTATIONDASH" or "DICTATION_DASH" or "SPEEDAUDIOMATCH" or "SPEED_AUDIO_MATCH" or "SHADOWINGBEAT" or "SHADOWING_BEAT" => SkillDomainConstants.Listening,
            "WORDMATCH" or "WORD_MATCH" or "SPEEDFALLING" or "SPEED_FALLING" or "FALLING_WORDS" or "CLOZEMASTER" or "CLOZE_MASTER" or "SKIMSCANSPRINT" or "SKIM_SCAN_SPRINT" => SkillDomainConstants.Reading,
            "SENTENCESCRAMBLE" or "SENTENCE_SCRAMBLE" or "GRAMMARDETECTIVE" or "GRAMMAR_DETECTIVE" or "COLLOCATIONCHAIN" or "COLLOCATION_CHAIN" or "PARAPHRASERUSH" or "PARAPHRASE_RUSH" => SkillDomainConstants.Writing,
            "MINIMALPAIRS" or "MINIMAL_PAIRS" or "STRESSHUNTER" or "STRESS_HUNTER" or "INTONATIONCURVE" or "INTONATION_CURVE" or "FLUENCYSPRINT" or "FLUENCY_SPRINT" => SkillDomainConstants.Speaking,
            _ => null
        };
    }
}
