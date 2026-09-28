using LearnEnglish.Api.Data;
using LearnEnglish.Api.Domain.Entities;
using LearnEnglish.Api.Domain.Enums;
using LearnEnglish.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Services;

public class GameService : IGameService
{
    private readonly AppDbContext _context;

    public GameService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<object> StartGameSessionAsync(Guid userId, StartGameRequest request)
    {
        var topic = await _context.Topics
            .Include(t => t.Words)
            .Include(t => t.Sentences)
            .FirstOrDefaultAsync(t => t.Id == request.TopicId);

        if (topic == null)
        {
            throw new KeyNotFoundException("Chủ đề không tồn tại.");
        }

        var session = new GameSession
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TopicId = request.TopicId,
            GameType = request.GameType,
            Status = GameSessionStatus.InProgress,
            StartedAt = DateTime.UtcNow
        };

        _context.GameSessions.Add(session);
        await _context.SaveChangesAsync();

        var rnd = new Random();

        switch (request.GameType)
        {
            case GameType.WordMatch:
            {
                var wordList = topic.Words.ToList();
                if (wordList.Count == 0)
                {
                    // Fallback to any words in DB
                    wordList = await _context.Words.Take(10).ToListAsync();
                }

                int pairsCount = request.DifficultyLevel.ToLower() switch
                {
                    "hard" => Math.Min(8, wordList.Count),
                    "medium" => Math.Min(6, wordList.Count),
                    _ => Math.Min(4, wordList.Count)
                };

                var selectedWords = wordList.OrderBy(_ => rnd.Next()).Take(pairsCount).ToList();
                var cards = new List<WordMatchCardDto>();

                for (int i = 0; i < selectedWords.Count; i++)
                {
                    var word = selectedWords[i];
                    var pairId = $"pair_{word.Id:N}";

                    cards.Add(new WordMatchCardDto
                    {
                        Id = $"c_en_{word.Id:N}",
                        PairId = pairId,
                        Type = "EN",
                        Content = word.Term,
                        SubContent = word.Phonetic
                    });

                    cards.Add(new WordMatchCardDto
                    {
                        Id = $"c_vi_{word.Id:N}",
                        PairId = pairId,
                        Type = "VI",
                        Content = word.DefinitionVi,
                        SubContent = null
                    });
                }

                // Shuffle cards
                var shuffledCards = cards.OrderBy(_ => rnd.Next()).ToList();

                return new WordMatchInitResponse
                {
                    SessionId = session.Id,
                    TimeLimitSeconds = pairsCount * 12,
                    Cards = shuffledCards
                };
            }

            case GameType.SpeedFalling:
            {
                var wordList = topic.Words.ToList();
                if (wordList.Count == 0)
                {
                    wordList = await _context.Words.Take(10).ToListAsync();
                }

                var allDefinitions = await _context.Words
                    .Select(w => w.DefinitionVi)
                    .Distinct()
                    .ToListAsync();

                var selectedWords = wordList.OrderBy(_ => rnd.Next()).Take(8).ToList();
                var items = new List<SpeedFallingWordItemDto>();

                int baseSpeedMs = request.DifficultyLevel.ToLower() switch
                {
                    "hard" => 4000,
                    "medium" => 5500,
                    _ => 7000
                };

                foreach (var word in selectedWords)
                {
                    var options = new List<string> { word.DefinitionVi };
                    var distractors = allDefinitions
                        .Where(d => d != word.DefinitionVi)
                        .OrderBy(_ => rnd.Next())
                        .Take(3)
                        .ToList();

                    options.AddRange(distractors);
                    var shuffledOptions = options.OrderBy(_ => rnd.Next()).ToList();

                    items.Add(new SpeedFallingWordItemDto
                    {
                        WordId = word.Id.ToString(),
                        Term = word.Term,
                        Phonetic = word.Phonetic,
                        CorrectDefinitionVi = word.DefinitionVi,
                        Options = shuffledOptions,
                        BaseFallDurationMs = baseSpeedMs
                    });
                }

                return new SpeedFallingInitResponse
                {
                    SessionId = session.Id,
                    InitialLives = 3,
                    Words = items
                };
            }

            case GameType.SentenceScramble:
            {
                var sentenceList = topic.Sentences.ToList();
                if (sentenceList.Count == 0)
                {
                    sentenceList = await _context.Sentences.Take(5).ToListAsync();
                }

                var selectedSentences = sentenceList.OrderBy(_ => rnd.Next()).Take(4).ToList();
                var items = new List<SentenceScrambleItemDto>();

                foreach (var sentence in selectedSentences)
                {
                    var tokens = sentence.Tokens;
                    if (tokens.Count == 0)
                    {
                        tokens = sentence.EnglishText.Split(' ', StringSplitOptions.RemoveEmptyEntries).ToList();
                    }

                    var tokenChips = tokens.Select((token, index) => new TokenChipDto
                    {
                        Id = $"tok_{sentence.Id:N}_{index}",
                        Word = token
                    }).OrderBy(_ => rnd.Next()).ToList();

                    items.Add(new SentenceScrambleItemDto
                    {
                        SentenceId = sentence.Id.ToString(),
                        VietnameseTranslation = sentence.VietnameseTranslation,
                        ShuffledTokens = tokenChips,
                        CorrectOrderTokens = tokens,
                        HintText = sentence.HintText
                    });
                }

                return new SentenceScrambleInitResponse
                {
                    SessionId = session.Id,
                    TotalTimeLimitSeconds = 180,
                    Sentences = items
                };
            }

            default:
                throw new ArgumentOutOfRangeException(nameof(request.GameType), "Game type không hợp lệ.");
        }
    }

    public async Task<CompleteSessionResponse> CompleteGameSessionAsync(Guid userId, CompleteSessionRequest request)
    {
        var session = await _context.GameSessions
            .FirstOrDefaultAsync(s => s.Id == request.SessionId && s.UserId == userId);

        if (session == null)
        {
            throw new KeyNotFoundException("Phiên chơi không tồn tại hoặc không thuộc người dùng này.");
        }

        var profile = await _context.UserProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
        {
            profile = new UserProfile
            {
                UserId = userId,
                DisplayName = "Học viên",
                TotalXp = 0,
                CurrentLevel = 1,
                CurrentStreak = 0,
                HighestStreak = 0,
                StreakFreezeCount = 1
            };
            _context.UserProfiles.Add(profile);
        }

        // Calculate accuracy
        decimal accuracy = request.TotalAttempts > 0
            ? Math.Round(((decimal)request.CorrectAnswers / request.TotalAttempts) * 100m, 2)
            : 0m;

        // Calculate XP
        double accuracyMultiplier = (double)accuracy switch
        {
            >= 90.0 => 1.25,
            >= 75.0 => 1.0,
            >= 50.0 => 0.8,
            _ => 0.5
        };

        int baseScoreXp = request.Score / 10;
        int comboBonus = request.MaxCombo * 5;
        int xpEarned = Math.Max(15, (int)(baseScoreXp * accuracyMultiplier) + comboBonus);

        // Update session
        session.Score = request.Score;
        session.DurationSeconds = request.DurationSeconds;
        session.AccuracyRate = accuracy;
        session.MaxCombo = request.MaxCombo;
        session.XpEarned = xpEarned;
        session.Status = GameSessionStatus.Completed;
        session.CompletedAt = DateTime.UtcNow;

        // Update user XP
        int oldLevel = profile.CurrentLevel;
        profile.TotalXp += xpEarned;

        // Calculate new level: level = (int)Math.Pow(totalXp / 100.0, 1.0 / 1.5) + 1
        int calculatedLevel = Math.Max(1, (int)Math.Pow(profile.TotalXp / 100.0, 0.6667) + 1);
        bool isNewLevel = calculatedLevel > oldLevel;
        profile.CurrentLevel = calculatedLevel;

        // Update streak
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        bool streakIncremented = false;

        if (profile.LastActiveDate == null)
        {
            profile.CurrentStreak = 1;
            streakIncremented = true;
        }
        else if (profile.LastActiveDate.Value == today.AddDays(-1))
        {
            profile.CurrentStreak += 1;
            streakIncremented = true;
        }
        else if (profile.LastActiveDate.Value < today.AddDays(-1))
        {
            if (profile.StreakFreezeCount > 0)
            {
                profile.StreakFreezeCount--;
                // Streak preserved
            }
            else
            {
                profile.CurrentStreak = 1;
                streakIncremented = true;
            }
        }

        profile.HighestStreak = Math.Max(profile.HighestStreak, profile.CurrentStreak);
        profile.LastActiveDate = today;
        profile.UpdatedAt = DateTime.UtcNow;

        // Badges
        var badges = new List<UnlockedBadgeDto>();
        if (request.MaxCombo >= 5)
        {
            badges.Add(new UnlockedBadgeDto
            {
                BadgeCode = "COMBO_MASTER_5",
                BadgeName = "Bậc thầy Combo",
                Description = "Đạt chuỗi liên hoàn 5+ câu trả lời chính xác!",
                IconUrl = "Flame"
            });
        }
        if (accuracy >= 100m && request.TotalAttempts >= 4)
        {
            badges.Add(new UnlockedBadgeDto
            {
                BadgeCode = "PERFECT_ACCURACY",
                BadgeName = "Bách phát bách trúng",
                Description = "Hoàn thành bài tập với tỷ lệ chính xác tuyệt đối 100%!",
                IconUrl = "Target"
            });
        }
        if (isNewLevel)
        {
            badges.Add(new UnlockedBadgeDto
            {
                BadgeCode = $"LEVEL_UP_{calculatedLevel}",
                BadgeName = $"Thăng Cấp {calculatedLevel}",
                Description = $"Chúc mừng bạn đã đạt cấp độ {calculatedLevel}!",
                IconUrl = "Trophy"
            });
        }

        await _context.SaveChangesAsync();

        return new CompleteSessionResponse
        {
            SessionId = session.Id,
            Score = session.Score,
            XpEarned = xpEarned,
            AccuracyRate = accuracy,
            IsNewLevel = isNewLevel,
            NewLevel = isNewLevel ? calculatedLevel : null,
            TotalXp = profile.TotalXp,
            CurrentStreak = profile.CurrentStreak,
            StreakIncrementedToday = streakIncremented,
            UnlockedBadges = badges
        };
    }
}
