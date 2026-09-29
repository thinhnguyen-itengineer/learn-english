using System.Text.Json;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.Domain.Entities;
using LearnEnglish.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Services;

public class SrsClinicService : ISrsClinicService
{
    private readonly AppDbContext _db;
    private readonly ILogger<SrsClinicService> _logger;

    public SrsClinicService(AppDbContext db, ILogger<SrsClinicService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<MistakesSummaryResponse> GetMistakesSummaryAsync(Guid userId)
    {
        var now = DateTime.UtcNow;
        var mistakes = await _db.UserMistakeBanks
            .Where(m => m.UserId == userId)
            .ToListAsync();

        var totalDueToday = mistakes.Count(m => m.Status != "Mastered" && m.NextReviewDate <= now);
        var learningCount = mistakes.Count(m => m.Status == "Learning");
        var reviewingCount = mistakes.Count(m => m.Status == "Reviewing");
        var masteredCount = mistakes.Count(m => m.Status == "Mastered");

        var bySkill = mistakes
            .GroupBy(m => string.IsNullOrWhiteSpace(m.SkillType) ? "General" : m.SkillType)
            .ToDictionary(g => g.Key, g => g.Count(m => m.Status != "Mastered" && m.NextReviewDate <= now));

        // Ensure primary skills are present in the dictionary
        string[] standardSkills = ["Listening", "Reading", "Writing", "Speaking"];
        foreach (var skill in standardSkills)
        {
            if (!bySkill.ContainsKey(skill))
            {
                bySkill[skill] = 0;
            }
        }

        return new MistakesSummaryResponse
        {
            TotalDueToday = totalDueToday,
            LearningCount = learningCount,
            ReviewingCount = reviewingCount,
            MasteredCount = masteredCount,
            BySkill = bySkill
        };
    }

    public async Task<ClinicSessionResponse> GetClinicSessionAsync(Guid userId)
    {
        var now = DateTime.UtcNow;

        // Prioritize due mistakes, then non-mastered
        var candidateMistakes = await _db.UserMistakeBanks
            .Where(m => m.UserId == userId && m.Status != "Mastered")
            .OrderBy(m => m.NextReviewDate <= now ? 0 : 1)
            .ThenBy(m => m.NextReviewDate)
            .Take(10)
            .ToListAsync();

        if (candidateMistakes.Count == 0)
        {
            // If all mastered or empty, pick recent mistakes for practice
            candidateMistakes = await _db.UserMistakeBanks
                .Where(m => m.UserId == userId)
                .OrderByDescending(m => m.LastFailedAt)
                .Take(10)
                .ToListAsync();
        }

        var cards = candidateMistakes.Select(m =>
        {
            List<string> wrongList = new();
            try
            {
                if (!string.IsNullOrWhiteSpace(m.WrongAttemptsJson))
                {
                    wrongList = JsonSerializer.Deserialize<List<string>>(m.WrongAttemptsJson) ?? new();
                }
            }
            catch
            {
                // Ignore deserialize error
            }

            // Build 4 multiple choice options
            var options = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { m.CorrectAnswer };
            foreach (var w in wrongList.Where(w => !string.IsNullOrWhiteSpace(w)))
            {
                options.Add(w);
                if (options.Count >= 4) break;
            }

            // Fallback options if not enough wrong attempts
            string[] genericFallbacks = ["Incomprehensible", "Comprehending", "Misunderstand", "Perception", "Cognition", "Expression"];
            foreach (var fallback in genericFallbacks)
            {
                if (options.Count >= 4) break;
                if (!options.Contains(fallback) && !fallback.Equals(m.CorrectAnswer, StringComparison.OrdinalIgnoreCase))
                {
                    options.Add(fallback);
                }
            }

            var shuffledOptions = options.OrderBy(_ => Guid.NewGuid()).ToList();

            return new ClinicCardDto
            {
                Id = m.Id,
                QuestionId = m.QuestionId,
                OriginGameType = m.OriginGameType,
                SkillType = m.SkillType,
                Prompt = m.Prompt,
                Phonetic = m.Phonetic,
                AudioUrl = m.AudioUrl,
                ContextSentence = m.ContextSentence,
                CorrectAnswer = m.CorrectAnswer,
                WrongAttempts = wrongList,
                Options = shuffledOptions,
                TimeLimitSeconds = 15
            };
        }).ToList();

        return new ClinicSessionResponse
        {
            SessionId = Guid.NewGuid().ToString(),
            Cards = cards
        };
    }

    public async Task<ClinicSubmitResponse> SubmitClinicCardAsync(Guid userId, ClinicSubmitRequest request)
    {
        var mistake = await _db.UserMistakeBanks
            .FirstOrDefaultAsync(m => m.Id == request.MistakeId && m.UserId == userId);

        if (mistake == null)
        {
            throw new KeyNotFoundException("Thẻ câu hỏi không tồn tại hoặc không thuộc quyền sở hữu của bạn.");
        }

        bool isCorrect = string.Equals(request.SelectedAnswer.Trim(), mistake.CorrectAnswer.Trim(), StringComparison.OrdinalIgnoreCase);

        int qualityScore;
        if (!isCorrect)
        {
            qualityScore = request.ResponseTimeMs <= 5000 ? 2 : 1;
        }
        else
        {
            if (request.ResponseTimeMs < 3000 && !request.UsedHint)
                qualityScore = 5; // Easy / Perfect
            else if (request.ResponseTimeMs <= 7000 && !request.UsedHint)
                qualityScore = 4; // Good
            else
                qualityScore = 3; // Hard
        }

        var sm2Result = Sm2SpacedRepetitionCalculator.Calculate(
            mistake.EaseFactor,
            mistake.IntervalDays,
            mistake.RepetitionCount,
            mistake.ConsecutiveSuccesses,
            qualityScore,
            DateTime.UtcNow);

        // Update entity state
        mistake.EaseFactor = sm2Result.NewEaseFactor;
        mistake.IntervalDays = sm2Result.NewIntervalDays;
        mistake.RepetitionCount = sm2Result.RepetitionCount;
        mistake.ConsecutiveSuccesses = sm2Result.ConsecutiveSuccesses;
        mistake.NextReviewDate = sm2Result.NextReviewDate;
        mistake.LastEvaluatedQuality = qualityScore;
        mistake.UpdatedAt = DateTime.UtcNow;

        if (sm2Result.IsGraduated)
        {
            mistake.Status = "Mastered";
        }
        else if (sm2Result.RepetitionCount > 0)
        {
            mistake.Status = "Reviewing";
        }
        else
        {
            mistake.Status = "Learning";
            mistake.LastFailedAt = DateTime.UtcNow;
        }

        // Award Coins & XP to UserProfile
        var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile != null)
        {
            profile.TotalXp += sm2Result.AwardedXp;
            profile.Coins += sm2Result.AwardedCoins;
            profile.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();

        return new ClinicSubmitResponse
        {
            MistakeId = mistake.Id,
            IsCorrect = isCorrect,
            QualityScore = qualityScore,
            NewEaseFactor = sm2Result.NewEaseFactor,
            NewIntervalDays = sm2Result.NewIntervalDays,
            NextReviewDate = sm2Result.NextReviewDate,
            IsGraduated = sm2Result.IsGraduated,
            AwardedCoins = sm2Result.AwardedCoins,
            AwardedXp = sm2Result.AwardedXp,
            CorrectAnswer = mistake.CorrectAnswer,
            Explanation = mistake.Explanation
        };
    }

    public async Task CaptureMistakeAsync(Guid userId, CaptureMistakeRequest request)
    {
        var existing = await _db.UserMistakeBanks
            .FirstOrDefaultAsync(m => m.UserId == userId && m.QuestionId == request.QuestionId);

        var now = DateTime.UtcNow;
        if (existing != null)
        {
            existing.Status = "Learning";
            existing.RepetitionCount = 0;
            existing.ConsecutiveSuccesses = 0;
            existing.IntervalDays = 1;
            existing.NextReviewDate = now.AddDays(1);
            existing.LastFailedAt = now;
            existing.UpdatedAt = now;

            try
            {
                var wrongList = JsonSerializer.Deserialize<List<string>>(existing.WrongAttemptsJson) ?? new();
                if (!string.IsNullOrWhiteSpace(request.UserWrongAnswer) && !wrongList.Contains(request.UserWrongAnswer))
                {
                    wrongList.Add(request.UserWrongAnswer);
                    existing.WrongAttemptsJson = JsonSerializer.Serialize(wrongList);
                }
            }
            catch
            {
                existing.WrongAttemptsJson = JsonSerializer.Serialize(new List<string> { request.UserWrongAnswer });
            }
        }
        else
        {
            var wrongList = new List<string>();
            if (!string.IsNullOrWhiteSpace(request.UserWrongAnswer))
            {
                wrongList.Add(request.UserWrongAnswer);
            }

            var newMistake = new UserMistakeBank
            {
                UserId = userId,
                QuestionId = request.QuestionId,
                OriginGameType = request.OriginGameType,
                SkillType = string.IsNullOrWhiteSpace(request.SkillType) ? "General" : request.SkillType,
                Prompt = request.Prompt,
                Phonetic = request.Phonetic,
                AudioUrl = request.AudioUrl,
                ContextSentence = request.ContextSentence,
                CorrectAnswer = request.CorrectAnswer,
                WrongAttemptsJson = JsonSerializer.Serialize(wrongList),
                Explanation = request.Explanation,
                EaseFactor = 2.50m,
                IntervalDays = 1,
                RepetitionCount = 0,
                ConsecutiveSuccesses = 0,
                Status = "Learning",
                NextReviewDate = now.AddDays(1),
                LastFailedAt = now,
                CreatedAt = now,
                UpdatedAt = now
            };

            _db.UserMistakeBanks.Add(newMistake);
        }

        await _db.SaveChangesAsync();
    }
}
