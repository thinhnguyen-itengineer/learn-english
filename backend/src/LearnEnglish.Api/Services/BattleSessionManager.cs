using System.Collections.Concurrent;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.Domain.Entities;
using LearnEnglish.Api.DTOs;
using LearnEnglish.Api.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Services;

public class BattleParticipantState
{
    public Guid UserId { get; set; }
    public string ConnectionId { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public RankTier Tier { get; set; } = RankTier.Bronze;
    public string Division { get; set; } = "III";
    public int InitialTrophy { get; set; }
    public bool IsBot { get; set; }
    public int Score { get; set; }
    public int CompletedPairs { get; set; }
    public int CurrentCombo { get; set; }
    public int MaxCombo { get; set; }
    public int CorrectCount { get; set; }
    public int WrongCount { get; set; }
    public int FinishTimeMs { get; set; }
    public bool IsCompleted { get; set; }
    public bool IsForfeit { get; set; }
    public bool IsDisconnected { get; set; }
    public CancellationTokenSource? DisconnectCts { get; set; }
}

public class ActiveBattleSession
{
    public Guid MatchId { get; set; }
    public Guid TopicId { get; set; }
    public string TopicName { get; set; } = string.Empty;
    public string QuestionSeed { get; set; } = string.Empty;
    public List<WordPairDto> Pairs { get; set; } = new();
    public BattleParticipantState Player1 { get; set; } = null!;
    public BattleParticipantState Player2 { get; set; } = null!;
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public int DurationSeconds { get; set; } = 60;
    public bool IsFinished { get; set; }
    public CancellationTokenSource MatchCts { get; set; } = new();
}

public interface IBattleSessionManager
{
    ActiveBattleSession CreateSession(
        BattleParticipantState p1,
        BattleParticipantState p2,
        Guid topicId,
        string topicName,
        List<WordPairDto> pairs
    );

    ActiveBattleSession? GetSession(Guid matchId);
    ActiveBattleSession? GetSessionByUser(Guid userId);
    Task HandlePlayerProgressAsync(Guid matchId, Guid userId, PlayerProgressDto progress);
    Task HandleFinishEarlyAsync(Guid matchId, Guid userId, int totalTimeMs);
    Task HandleForfeitAsync(Guid matchId, Guid userId);
    Task HandleDisconnectAsync(Guid userId, string connectionId);
    Task HandleReconnectAsync(Guid matchId, Guid userId, string newConnectionId);
    Task FinishMatchAsync(Guid matchId, string finishReason, Guid? forfeitUserId = null);
}

public class BattleSessionManager : IBattleSessionManager
{
    private readonly ConcurrentDictionary<Guid, ActiveBattleSession> _sessions = new();
    private readonly ConcurrentDictionary<Guid, Guid> _userToMatch = new();
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IEloRatingCalculator _eloCalculator;
    private readonly IHubContext<BattleHub> _hubContext;
    private readonly ILogger<BattleSessionManager> _logger;

    public BattleSessionManager(
        IServiceScopeFactory scopeFactory,
        IEloRatingCalculator eloCalculator,
        IHubContext<BattleHub> hubContext,
        ILogger<BattleSessionManager> logger
    )
    {
        _scopeFactory = scopeFactory;
        _eloCalculator = eloCalculator;
        _hubContext = hubContext;
        _logger = logger;
    }

    public ActiveBattleSession CreateSession(
        BattleParticipantState p1,
        BattleParticipantState p2,
        Guid topicId,
        string topicName,
        List<WordPairDto> pairs
    )
    {
        var matchId = Guid.NewGuid();
        var session = new ActiveBattleSession
        {
            MatchId = matchId,
            TopicId = topicId,
            TopicName = topicName,
            QuestionSeed = Guid.NewGuid().ToString("N")[..16],
            Pairs = pairs,
            Player1 = p1,
            Player2 = p2,
            StartedAt = DateTime.UtcNow,
            DurationSeconds = 60
        };

        _sessions[matchId] = session;
        _userToMatch[p1.UserId] = matchId;
        _userToMatch[p2.UserId] = matchId;

        return session;
    }

    public ActiveBattleSession? GetSession(Guid matchId)
    {
        _sessions.TryGetValue(matchId, out var session);
        return session;
    }

    public ActiveBattleSession? GetSessionByUser(Guid userId)
    {
        if (_userToMatch.TryGetValue(userId, out var matchId))
        {
            return GetSession(matchId);
        }
        return null;
    }

    public async Task HandlePlayerProgressAsync(
        Guid matchId,
        Guid userId,
        PlayerProgressDto progress
    )
    {
        if (!_sessions.TryGetValue(matchId, out var session) || session.IsFinished) return;

        var isP1 = session.Player1.UserId == userId;
        var sender = isP1 ? session.Player1 : session.Player2;
        var opponent = isP1 ? session.Player2 : session.Player1;

        sender.Score = progress.CurrentScore;
        sender.CompletedPairs = progress.CompletedPairsCount;
        sender.CurrentCombo = progress.CurrentCombo;
        if (progress.CurrentCombo > sender.MaxCombo) sender.MaxCombo = progress.CurrentCombo;
        sender.IsCompleted = progress.IsCompleted;

        // Broadcast to opponent if not bot
        if (!opponent.IsBot && !string.IsNullOrEmpty(opponent.ConnectionId))
        {
            var update = new OpponentProgressPayload
            {
                MatchId = matchId,
                OpponentUserId = sender.UserId,
                CurrentScore = sender.Score,
                CompletedPairsCount = sender.CompletedPairs,
                CurrentCombo = sender.CurrentCombo,
                IsCompleted = sender.IsCompleted
            };
            await _hubContext.Clients.Client(opponent.ConnectionId).SendAsync("OpponentProgressUpdate", update);
        }

        if (sender.CompletedPairs >= 10 || sender.IsCompleted)
        {
            await FinishMatchAsync(matchId, "NormalCompletion");
        }
    }

    public async Task HandleFinishEarlyAsync(
        Guid matchId,
        Guid userId,
        int totalTimeMs
    )
    {
        if (!_sessions.TryGetValue(matchId, out var session) || session.IsFinished) return;

        var sender = session.Player1.UserId == userId ? session.Player1 : session.Player2;
        sender.FinishTimeMs = totalTimeMs;
        sender.IsCompleted = true;
        sender.CompletedPairs = 10;

        // Finish Bonus = remainingSeconds * 10
        int elapsedSec = Math.Clamp((int)((DateTime.UtcNow - session.StartedAt).TotalSeconds), 0, 60);
        int remainingSec = Math.Max(0, 60 - elapsedSec);
        sender.Score += remainingSec * 10;

        await FinishMatchAsync(matchId, "NormalCompletion");
    }

    public async Task HandleForfeitAsync(
        Guid matchId,
        Guid userId
    )
    {
        if (!_sessions.TryGetValue(matchId, out var session) || session.IsFinished) return;

        var forfeitPlayer = session.Player1.UserId == userId ? session.Player1 : session.Player2;
        forfeitPlayer.IsForfeit = true;

        await FinishMatchAsync(matchId, "Forfeit", userId);
    }

    public async Task HandleDisconnectAsync(
        Guid userId,
        string connectionId
    )
    {
        var session = GetSessionByUser(userId);
        if (session == null || session.IsFinished) return;

        var player = session.Player1.UserId == userId ? session.Player1 : session.Player2;
        var opponent = session.Player1.UserId == userId ? session.Player2 : session.Player1;

        if (player.ConnectionId != connectionId) return;

        player.IsDisconnected = true;
        player.DisconnectCts = new CancellationTokenSource();

        if (!opponent.IsBot && !string.IsNullOrEmpty(opponent.ConnectionId))
        {
            await _hubContext.Clients.Client(opponent.ConnectionId)
                .SendAsync("OpponentDisconnected", new DisconnectGracePayload { GracePeriodSeconds = 15 });
        }

        // Wait 15 seconds grace period
        _ = Task.Run(async () =>
        {
            try
            {
                await Task.Delay(15000, player.DisconnectCts.Token);
                // Grace expired -> Forfeit!
                if (player.IsDisconnected && !session.IsFinished)
                {
                    player.IsForfeit = true;
                    await FinishMatchAsync(session.MatchId, "DisconnectTimeout", player.UserId);
                }
            }
            catch (TaskCanceledException)
            {
                // Reconnected in time
            }
        });
    }

    public async Task HandleReconnectAsync(
        Guid matchId,
        Guid userId,
        string newConnectionId
    )
    {
        if (!_sessions.TryGetValue(matchId, out var session) || session.IsFinished) return;

        var player = session.Player1.UserId == userId ? session.Player1 : session.Player2;
        var opponent = session.Player1.UserId == userId ? session.Player2 : session.Player1;

        player.IsDisconnected = false;
        player.ConnectionId = newConnectionId;
        player.DisconnectCts?.Cancel();

        if (!opponent.IsBot && !string.IsNullOrEmpty(opponent.ConnectionId))
        {
            await _hubContext.Clients.Client(opponent.ConnectionId).SendAsync("OpponentReconnected");
        }
    }

    public async Task FinishMatchAsync(
        Guid matchId,
        string finishReason,
        Guid? forfeitUserId = null
    )
    {
        if (!_sessions.TryGetValue(matchId, out var session) || session.IsFinished) return;

        lock (session)
        {
            if (session.IsFinished) return;
            session.IsFinished = true;
        }

        session.MatchCts.Cancel();

        var p1 = session.Player1;
        var p2 = session.Player2;

        MatchResult p1Result;
        MatchResult p2Result;
        Guid? winnerId = null;

        if (forfeitUserId.HasValue)
        {
            if (p1.UserId == forfeitUserId.Value)
            {
                p1Result = MatchResult.Loss;
                p2Result = MatchResult.Win;
                winnerId = p2.UserId;
            }
            else
            {
                p1Result = MatchResult.Win;
                p2Result = MatchResult.Loss;
                winnerId = p1.UserId;
            }
        }
        else
        {
            if (p1.Score > p2.Score)
            {
                p1Result = MatchResult.Win;
                p2Result = MatchResult.Loss;
                winnerId = p1.UserId;
            }
            else if (p2.Score > p1.Score)
            {
                p1Result = MatchResult.Loss;
                p2Result = MatchResult.Win;
                winnerId = p2.UserId;
            }
            else
            {
                // Tie breaker: finish time
                if (p1.FinishTimeMs > 0 && (p2.FinishTimeMs == 0 || p1.FinishTimeMs < p2.FinishTimeMs))
                {
                    p1Result = MatchResult.Win;
                    p2Result = MatchResult.Loss;
                    winnerId = p1.UserId;
                }
                else if (p2.FinishTimeMs > 0 && (p1.FinishTimeMs == 0 || p2.FinishTimeMs < p1.FinishTimeMs))
                {
                    p1Result = MatchResult.Loss;
                    p2Result = MatchResult.Win;
                    winnerId = p2.UserId;
                }
                else
                {
                    p1Result = MatchResult.Draw;
                    p2Result = MatchResult.Draw;
                }
            }
        }

        // Persist to DB and compute ELO
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var activeSeason = await db.Seasons.FirstOrDefaultAsync(s => s.IsActive);
        var durationSec = Math.Clamp((int)(DateTime.UtcNow - session.StartedAt).TotalSeconds, 1, 60);

        var matchSession = new MatchSession
        {
            Id = session.MatchId,
            SeasonId = activeSeason?.Id,
            MatchType = "SpeedWordMatch",
            Status = "Finished",
            QuestionSeed = session.QuestionSeed,
            TopicId = session.TopicId,
            WinnerId = winnerId,
            FinishReason = finishReason,
            DurationSeconds = durationSec,
            StartedAt = session.StartedAt,
            EndedAt = DateTime.UtcNow
        };
        db.MatchSessions.Add(matchSession);

        // Update P1
        var p1Rank = await db.UserRanks.FirstOrDefaultAsync(r => r.UserId == p1.UserId);
        if (p1Rank == null)
        {
            p1Rank = new UserRank { UserId = p1.UserId, Trophy = p1.InitialTrophy };
            db.UserRanks.Add(p1Rank);
        }

        var p1Elo = _eloCalculator.Calculate(p1Rank, p2.InitialTrophy, p1Result, p1.IsForfeit);
        p1Rank.Trophy = p1Elo.NewTrophy;
        p1Rank.Tier = p1Elo.NewTier;
        p1Rank.Division = p1Elo.NewDivision;
        p1Rank.WinStreak = p1Elo.NewWinStreak;
        p1Rank.ProtectionGamesLeft = p1Elo.ProtectionGamesLeft;
        p1Rank.TotalMatches++;
        if (p1Result == MatchResult.Win) p1Rank.Wins++;
        else if (p1Result == MatchResult.Loss) p1Rank.Losses++;
        else p1Rank.Draws++;
        if (p1Elo.NewTrophy > p1Rank.HighestTrophy) p1Rank.HighestTrophy = p1Elo.NewTrophy;
        if (p1Elo.NewWinStreak > p1Rank.HighestWinStreak) p1Rank.HighestWinStreak = p1Elo.NewWinStreak;
        if (p1.IsForfeit) p1Rank.AbandonCount++;
        p1Rank.UpdatedAt = DateTime.UtcNow;

        int p1Xp = p1Result == MatchResult.Win ? 30 : (p1Result == MatchResult.Draw ? 15 : 5);
        var p1Profile = await db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == p1.UserId);
        if (p1Profile != null)
        {
            p1Profile.TotalXp += p1Xp;
            p1Profile.CurrentLevel = Math.Max(1, p1Profile.TotalXp / 200);
        }

        var part1 = new MatchParticipant
        {
            MatchId = matchId,
            UserId = p1.UserId,
            IsBot = p1.IsBot,
            FinalScore = p1.Score,
            CorrectCount = p1.CompletedPairs,
            WrongCount = p1.WrongCount,
            MaxCombo = p1.MaxCombo,
            FinishTimeMs = p1.FinishTimeMs,
            InitialTrophy = p1.InitialTrophy,
            TrophyChange = p1Elo.TrophyChange,
            EarnedXp = p1Xp,
            Result = p1Result,
            IsForfeit = p1.IsForfeit
        };
        db.MatchParticipants.Add(part1);

        // Update P2 (if real user)
        EloCalculationResult? p2Elo = null;
        int p2Xp = p2Result == MatchResult.Win ? 30 : (p2Result == MatchResult.Draw ? 15 : 5);

        if (!p2.IsBot)
        {
            var p2Rank = await db.UserRanks.FirstOrDefaultAsync(r => r.UserId == p2.UserId);
            if (p2Rank == null)
            {
                p2Rank = new UserRank { UserId = p2.UserId, Trophy = p2.InitialTrophy };
                db.UserRanks.Add(p2Rank);
            }

            p2Elo = _eloCalculator.Calculate(p2Rank, p1.InitialTrophy, p2Result, p2.IsForfeit);
            p2Rank.Trophy = p2Elo.NewTrophy;
            p2Rank.Tier = p2Elo.NewTier;
            p2Rank.Division = p2Elo.NewDivision;
            p2Rank.WinStreak = p2Elo.NewWinStreak;
            p2Rank.ProtectionGamesLeft = p2Elo.ProtectionGamesLeft;
            p2Rank.TotalMatches++;
            if (p2Result == MatchResult.Win) p2Rank.Wins++;
            else if (p2Result == MatchResult.Loss) p2Rank.Losses++;
            else p2Rank.Draws++;
            if (p2Elo.NewTrophy > p2Rank.HighestTrophy) p2Rank.HighestTrophy = p2Elo.NewTrophy;
            if (p2Elo.NewWinStreak > p2Rank.HighestWinStreak) p2Rank.HighestWinStreak = p2Elo.NewWinStreak;
            if (p2.IsForfeit) p2Rank.AbandonCount++;
            p2Rank.UpdatedAt = DateTime.UtcNow;

            var p2Profile = await db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == p2.UserId);
            if (p2Profile != null)
            {
                p2Profile.TotalXp += p2Xp;
                p2Profile.CurrentLevel = Math.Max(1, p2Profile.TotalXp / 200);
            }

            var part2 = new MatchParticipant
            {
                MatchId = matchId,
                UserId = p2.UserId,
                IsBot = false,
                FinalScore = p2.Score,
                CorrectCount = p2.CompletedPairs,
                WrongCount = p2.WrongCount,
                MaxCombo = p2.MaxCombo,
                FinishTimeMs = p2.FinishTimeMs,
                InitialTrophy = p2.InitialTrophy,
                TrophyChange = p2Elo.TrophyChange,
                EarnedXp = p2Xp,
                Result = p2Result,
                IsForfeit = p2.IsForfeit
            };
            db.MatchParticipants.Add(part2);
        }
        else
        {
            var part2 = new MatchParticipant
            {
                MatchId = matchId,
                UserId = p2.UserId,
                IsBot = true,
                FinalScore = p2.Score,
                CorrectCount = p2.CompletedPairs,
                WrongCount = p2.WrongCount,
                MaxCombo = p2.MaxCombo,
                FinishTimeMs = p2.FinishTimeMs,
                InitialTrophy = p2.InitialTrophy,
                TrophyChange = 0,
                EarnedXp = 0,
                Result = p2Result,
                IsForfeit = false
            };
            db.MatchParticipants.Add(part2);
        }

        await db.SaveChangesAsync();

        // Broadcast MatchFinished to P1
        if (!string.IsNullOrEmpty(p1.ConnectionId))
        {
            var p1Payload = new MatchResultPayload
            {
                MatchId = matchId,
                IsWinner = p1Result == MatchResult.Win,
                IsDraw = p1Result == MatchResult.Draw,
                FinishReason = finishReason,
                MyFinalScore = p1.Score,
                OpponentFinalScore = p2.Score,
                TrophyChange = p1Elo.TrophyChange,
                NewTrophy = p1Elo.NewTrophy,
                NewTier = p1Elo.NewTier.ToString(),
                NewDivision = p1Elo.NewDivision,
                EarnedXp = p1Xp,
                WinStreak = p1Elo.NewWinStreak,
                IsPromotion = p1Elo.IsPromotion,
                IsDemoted = p1Elo.IsDemoted
            };
            await _hubContext.Clients.Client(p1.ConnectionId).SendAsync("MatchFinished", p1Payload);
        }

        // Broadcast MatchFinished to P2 (if real user)
        if (!p2.IsBot && !string.IsNullOrEmpty(p2.ConnectionId) && p2Elo != null)
        {
            var p2Payload = new MatchResultPayload
            {
                MatchId = matchId,
                IsWinner = p2Result == MatchResult.Win,
                IsDraw = p2Result == MatchResult.Draw,
                FinishReason = finishReason,
                MyFinalScore = p2.Score,
                OpponentFinalScore = p1.Score,
                TrophyChange = p2Elo.TrophyChange,
                NewTrophy = p2Elo.NewTrophy,
                NewTier = p2Elo.NewTier.ToString(),
                NewDivision = p2Elo.NewDivision,
                EarnedXp = p2Xp,
                WinStreak = p2Elo.NewWinStreak,
                IsPromotion = p2Elo.IsPromotion,
                IsDemoted = p2Elo.IsDemoted
            };
            await _hubContext.Clients.Client(p2.ConnectionId).SendAsync("MatchFinished", p2Payload);
        }

        _sessions.TryRemove(matchId, out _);
        _userToMatch.TryRemove(p1.UserId, out _);
        _userToMatch.TryRemove(p2.UserId, out _);
    }
}
