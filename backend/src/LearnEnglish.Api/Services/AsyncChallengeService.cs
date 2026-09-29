using System.Text.Json;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.Domain.Entities;
using LearnEnglish.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Services;

public class AsyncChallengeService : IAsyncChallengeService
{
    private readonly AppDbContext _db;
    private readonly ILogger<AsyncChallengeService> _logger;

    public AsyncChallengeService(AppDbContext db, ILogger<AsyncChallengeService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<CreateChallengeResponse> CreateChallengeAsync(Guid creatorUserId, CreateChallengeRequest request)
    {
        string token = GenerateToken();
        var snapshotJson = request.QuestionSnapshot != null
            ? JsonSerializer.Serialize(request.QuestionSnapshot)
            : "[]";

        var challenge = new AsyncChallenge
        {
            ChallengeToken = token,
            CreatorUserId = creatorUserId,
            GameType = string.IsNullOrWhiteSpace(request.GameType) ? "SpeedFalling" : request.GameType,
            CreatorScore = request.Score,
            QuestionSnapshotJson = snapshotJson,
            AttemptCount = 0,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        };

        _db.AsyncChallenges.Add(challenge);
        await _db.SaveChangesAsync();

        return new CreateChallengeResponse
        {
            ChallengeToken = token,
            ShareUrl = $"/challenge/{token}",
            ExpiresAt = challenge.ExpiresAt
        };
    }

    public async Task<ChallengeDetailResponse> GetChallengeByTokenAsync(string token)
    {
        var challenge = await _db.AsyncChallenges
            .Include(c => c.Creator)
            .ThenInclude(u => u.Profile)
            .Include(c => c.Attempts)
            .FirstOrDefaultAsync(c => c.ChallengeToken == token);

        if (challenge == null)
        {
            throw new KeyNotFoundException($"Không tìm thấy thử thách với mã {token}.");
        }

        object? snapshot = null;
        try
        {
            if (!string.IsNullOrWhiteSpace(challenge.QuestionSnapshotJson))
            {
                snapshot = JsonSerializer.Deserialize<object>(challenge.QuestionSnapshotJson);
            }
        }
        catch
        {
            // Ignore parse error
        }

        var attempts = challenge.Attempts
            .OrderByDescending(a => a.Score)
            .Select(a => new ChallengeAttemptDto
            {
                ParticipantName = a.ParticipantName,
                Score = a.Score,
                IsWinner = a.IsWinner,
                CompletedAt = a.CompletedAt
            })
            .ToList();

        return new ChallengeDetailResponse
        {
            ChallengeToken = challenge.ChallengeToken,
            CreatorId = challenge.CreatorUserId,
            CreatorName = challenge.Creator?.Profile?.DisplayName ?? challenge.Creator?.Username ?? "Bạn bè",
            GameType = challenge.GameType,
            CreatorScore = challenge.CreatorScore,
            QuestionSnapshot = snapshot,
            ExpiresAt = challenge.ExpiresAt,
            IsExpired = challenge.ExpiresAt <= DateTime.UtcNow,
            AttemptCount = challenge.AttemptCount,
            Attempts = attempts
        };
    }

    public async Task<SubmitChallengeAttemptResponse> SubmitAttemptAsync(
        string token,
        Guid? participantUserId,
        SubmitChallengeAttemptRequest request)
    {
        var challenge = await _db.AsyncChallenges
            .Include(c => c.Creator)
            .ThenInclude(u => u.Profile)
            .FirstOrDefaultAsync(c => c.ChallengeToken == token);

        if (challenge == null)
        {
            throw new KeyNotFoundException($"Không tìm thấy thử thách với mã {token}.");
        }

        if (challenge.ExpiresAt <= DateTime.UtcNow)
        {
            throw new InvalidOperationException("Thử thách này đã hết hạn.");
        }

        bool isWinner = request.Score >= challenge.CreatorScore;
        int coins = isWinner ? 50 : 10;

        var attempt = new AsyncChallengeAttempt
        {
            ChallengeId = challenge.Id,
            ParticipantUserId = participantUserId,
            ParticipantName = string.IsNullOrWhiteSpace(request.ParticipantName) ? "Đối thủ bí ẩn" : request.ParticipantName.Trim(),
            Score = request.Score,
            IsWinner = isWinner,
            CompletedAt = DateTime.UtcNow
        };

        _db.AsyncChallengeAttempts.Add(attempt);
        challenge.AttemptCount += 1;

        if (participantUserId.HasValue)
        {
            var pProfile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == participantUserId.Value);
            if (pProfile != null)
            {
                pProfile.Coins += coins;
            }
        }

        if (isWinner && challenge.Creator?.Profile != null)
        {
            // Creator gets bonus coins when challenged
            challenge.Creator.Profile.Coins += 20;
        }

        await _db.SaveChangesAsync();

        string msg = isWinner
            ? $"Tuyệt vời! Bạn đã phá kỷ lục {challenge.CreatorScore} điểm và nhận +{coins} Xu!"
            : $"Ván đấu hoàn tất! Bạn đạt {request.Score} điểm (Kỷ lục: {challenge.CreatorScore}) và nhận +{coins} Xu khích lệ!";

        return new SubmitChallengeAttemptResponse
        {
            IsWinner = isWinner,
            CreatorScore = challenge.CreatorScore,
            UserScore = request.Score,
            AwardedCoins = coins,
            Message = msg
        };
    }

    private static string GenerateToken()
    {
        const string chars = "abcdefghjkmnpqrstuvwxyz23456789";
        var rnd = new Random();
        return new string(Enumerable.Repeat(chars, 8).Select(s => s[rnd.Next(s.Length)]).ToArray());
    }
}
