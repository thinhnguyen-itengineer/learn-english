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

            case GameType.AudioBlitz:
            {
                var questions = await _context.AudioBlitzQuestions
                    .Where(q => q.TopicId == request.TopicId)
                    .ToListAsync();

                if (questions.Count == 0)
                {
                    questions = await _context.AudioBlitzQuestions.Take(8).ToListAsync();
                }

                var items = new List<AudioBlitzItemDto>();
                if (questions.Count > 0)
                {
                    var selected = questions.OrderBy(_ => rnd.Next()).Take(8).ToList();
                    foreach (var q in selected)
                    {
                        var targetWord = q.TargetWord.Trim().ToUpperInvariant();
                        var letters = targetWord.Select(c => c.ToString()).ToList();
                        
                        var distractorsSource = string.IsNullOrEmpty(q.DistractorLetters) ? "ETAOIN" : q.DistractorLetters;
                        var distractorChars = distractorsSource.ToUpperInvariant()
                            .Where(char.IsLetter)
                            .OrderBy(_ => rnd.Next())
                            .Take(3)
                            .Select(c => c.ToString())
                            .ToList();

                        letters.AddRange(distractorChars);
                        var letterBank = letters.OrderBy(_ => rnd.Next()).ToList();

                        items.Add(new AudioBlitzItemDto
                        {
                            QuestionId = q.Id.ToString(),
                            TargetWord = targetWord,
                            AudioUrl = q.AudioUrl,
                            SlowAudioUrl = q.SlowAudioUrl,
                            Phonetic = q.Phonetic,
                            PartOfSpeech = q.PartOfSpeech,
                            DefinitionVi = q.DefinitionVi,
                            ContextSentence = q.ContextSentence,
                            TargetWordLength = targetWord.Length,
                            LetterBank = letterBank,
                            TimeLimitSeconds = 15
                        });
                    }
                }
                else
                {
                    var words = topic.Words.Take(8).ToList();
                    foreach (var w in words)
                    {
                        var target = w.Term.Trim().ToUpperInvariant();
                        var letters = target.Select(c => c.ToString()).ToList();
                        var distractors = "ETAOINSRHD".Where(c => !target.Contains(c)).OrderBy(_ => rnd.Next()).Take(3).Select(c => c.ToString());
                        letters.AddRange(distractors);

                        items.Add(new AudioBlitzItemDto
                        {
                            QuestionId = w.Id.ToString(),
                            TargetWord = target,
                            AudioUrl = w.AudioUrl ?? "",
                            SlowAudioUrl = null,
                            Phonetic = w.Phonetic ?? "",
                            PartOfSpeech = w.PartOfSpeech ?? "word",
                            DefinitionVi = w.DefinitionVi,
                            ContextSentence = string.IsNullOrEmpty(w.ExampleSentence) 
                                ? $"Listen and spell: {w.Term}" 
                                : w.ExampleSentence.Replace(w.Term, "______", StringComparison.OrdinalIgnoreCase),
                            TargetWordLength = target.Length,
                            LetterBank = letters.OrderBy(_ => rnd.Next()).ToList(),
                            TimeLimitSeconds = 15
                        });
                    }
                }

                return new AudioBlitzInitResponse
                {
                    SessionId = session.Id,
                    InitialLives = 3,
                    Items = items
                };
            }

            case GameType.ClozeMaster:
            {
                var questions = await _context.ClozeQuestions
                    .Where(q => q.TopicId == request.TopicId)
                    .ToListAsync();

                if (questions.Count == 0)
                {
                    questions = await _context.ClozeQuestions.Take(10).ToListAsync();
                }

                var items = new List<ClozeQuestionDto>();
                var optionLetters = new[] { "A", "B", "C", "D" };

                if (questions.Count > 0)
                {
                    var selected = questions.OrderBy(_ => rnd.Next()).Take(10).ToList();
                    foreach (var q in selected)
                    {
                        var allOpts = new List<ClozeDistractorItem>
                        {
                            new() { Word = q.CorrectWord, DefinitionVi = q.CorrectDefinitionVi }
                        };
                        allOpts.AddRange(q.Distractors);

                        var shuffled = allOpts.OrderBy(_ => rnd.Next()).Take(4).ToList();
                        var optionDtos = shuffled.Select((opt, idx) => new ClozeOptionDto
                        {
                            Id = idx < optionLetters.Length ? optionLetters[idx] : $"{(char)('A' + idx)}",
                            Word = opt.Word,
                            DefinitionVi = opt.DefinitionVi
                        }).ToList();

                        items.Add(new ClozeQuestionDto
                        {
                            QuestionId = q.Id.ToString(),
                            ContextSentence = q.ContextSentence,
                            SentenceTranslationVi = q.SentenceTranslationVi,
                            PartOfSpeechHint = q.PartOfSpeechHint,
                            CorrectWord = q.CorrectWord,
                            Options = optionDtos,
                            ExplanationText = q.ExplanationText
                        });
                    }
                }
                else
                {
                    var sentences = topic.Sentences.Take(10).ToList();
                    foreach (var s in sentences)
                    {
                        var wordsInSentence = s.EnglishText.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                        var target = wordsInSentence.FirstOrDefault(w => w.Length > 4) ?? wordsInSentence[0];
                        var cleanTarget = new string(target.Where(char.IsLetter).ToArray());

                        var opts = new List<ClozeOptionDto>
                        {
                            new() { Id = "A", Word = cleanTarget, DefinitionVi = "Đáp án đúng ngữ cảnh" },
                            new() { Id = "B", Word = cleanTarget + "ing", DefinitionVi = "Dạng từ biến đổi" },
                            new() { Id = "C", Word = cleanTarget + "ly", DefinitionVi = "Dạng trạng từ" },
                            new() { Id = "D", Word = "un" + cleanTarget, DefinitionVi = "Dạng phủ định" }
                        }.OrderBy(_ => rnd.Next()).Select((opt, idx) => opt with { Id = optionLetters[idx] }).ToList();

                        items.Add(new ClozeQuestionDto
                        {
                            QuestionId = s.Id.ToString(),
                            ContextSentence = s.EnglishText.Replace(cleanTarget, "[ ________ ]", StringComparison.OrdinalIgnoreCase),
                            SentenceTranslationVi = s.VietnameseTranslation,
                            PartOfSpeechHint = "Từ vựng ngữ cảnh",
                            CorrectWord = cleanTarget,
                            Options = opts,
                            ExplanationText = $"Đáp án chuẩn xác là '{cleanTarget}' theo đúng cấu trúc câu."
                        });
                    }
                }

                return new ClozeMasterInitResponse
                {
                    SessionId = session.Id,
                    TimePerQuestionSeconds = 20,
                    TotalQuestions = items.Count,
                    Questions = items
                };
            }

            case GameType.GrammarDetective:
            {
                var questions = await _context.GrammarDetectiveQuestions
                    .Where(q => q.TopicId == request.TopicId)
                    .ToListAsync();

                if (questions.Count == 0)
                {
                    questions = await _context.GrammarDetectiveQuestions.Take(5).ToListAsync();
                }

                var cases = new List<GrammarDetectiveCaseDto>();
                if (questions.Count > 0)
                {
                    var selected = questions.OrderBy(_ => rnd.Next()).Take(5).ToList();
                    foreach (var q in selected)
                    {
                        var tokens = q.TokenSequence.Select(t => new GrammarTokenDto
                        {
                            Index = t.Index,
                            Text = t.Text
                        }).ToList();

                        cases.Add(new GrammarDetectiveCaseDto
                        {
                            CaseId = q.Id.ToString(),
                            CaseTitle = q.CaseTitle,
                            RawSentence = q.RawSentence,
                            Tokens = tokens,
                            ErrorTokenIndex = q.ErrorTokenIndex,
                            ErrorTokenText = q.ErrorTokenText,
                            CorrectionOptions = q.CorrectionOptions,
                            CorrectReplacement = q.CorrectReplacement,
                            GrammarRuleExplanation = q.GrammarRuleExplanation
                        });
                    }
                }
                else
                {
                    cases.Add(new GrammarDetectiveCaseDto
                    {
                        CaseId = Guid.NewGuid().ToString(),
                        CaseTitle = "Vụ Án #1: Giới Từ Thời Gian & Thì Hiện Tại Hoàn Thành",
                        RawSentence = "She has worked as a software engineer in this company since five years .",
                        Tokens = new List<GrammarTokenDto>
                        {
                            new() { Index = 0, Text = "She" },
                            new() { Index = 1, Text = "has" },
                            new() { Index = 2, Text = "worked" },
                            new() { Index = 3, Text = "as" },
                            new() { Index = 4, Text = "a" },
                            new() { Index = 5, Text = "software" },
                            new() { Index = 6, Text = "engineer" },
                            new() { Index = 7, Text = "in" },
                            new() { Index = 8, Text = "this" },
                            new() { Index = 9, Text = "company" },
                            new() { Index = 10, Text = "since" },
                            new() { Index = 11, Text = "five" },
                            new() { Index = 12, Text = "years" },
                            new() { Index = 13, Text = "." }
                        },
                        ErrorTokenIndex = 10,
                        ErrorTokenText = "since",
                        CorrectionOptions = new List<string> { "for", "during", "from" },
                        CorrectReplacement = "for",
                        GrammarRuleExplanation = "Với khoảng thời gian kéo dài ('five years'), ta phải dùng giới từ 'for'. Giới từ 'since' chỉ dùng với mốc thời gian xác định."
                    });
                }

                return new GrammarDetectiveInitResponse
                {
                    SessionId = session.Id,
                    InitialMagnifiers = 3,
                    TimePerCaseSeconds = 60,
                    TotalCases = cases.Count,
                    Cases = cases
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
        if (session.GameType == GameType.AudioBlitz && accuracy >= 90m)
        {
            badges.Add(new UnlockedBadgeDto
            {
                BadgeCode = "GOLDEN_EAR",
                BadgeName = "Đôi Tai Vàng",
                Description = "Hoàn thành bài luyện nghe Audio Blitz với độ chính xác trên 90%!",
                IconUrl = "Headphones"
            });
        }
        if (session.GameType == GameType.ClozeMaster && request.CorrectAnswers >= 5)
        {
            badges.Add(new UnlockedBadgeDto
            {
                BadgeCode = "CONTEXT_PRO",
                BadgeName = "Bậc Thầy Ngữ Cảnh",
                Description = "Trả lời xuất sắc các câu hỏi điền từ trong Cloze Master!",
                IconUrl = "BookOpen"
            });
        }
        if (session.GameType == GameType.GrammarDetective && request.CorrectAnswers >= 3)
        {
            badges.Add(new UnlockedBadgeDto
            {
                BadgeCode = "SHERLOCK_GRAMMAR",
                BadgeName = "Thám Tử Bắt Lỗi",
                Description = "Phá thành công các vụ án ngữ pháp trong Grammar Detective!",
                IconUrl = "Search"
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
