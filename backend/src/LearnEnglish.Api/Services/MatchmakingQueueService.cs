using System.Collections.Concurrent;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.Domain.Entities;
using LearnEnglish.Api.DTOs;
using LearnEnglish.Api.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Services;

public class MatchmakingQueueEntry
{
    public Guid UserId { get; set; }
    public string ConnectionId { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public RankTier Tier { get; set; } = RankTier.Bronze;
    public string Division { get; set; } = "III";
    public int Trophy { get; set; }
    public Guid? PreferredTopicId { get; set; }
    public DateTime EnqueuedAt { get; set; } = DateTime.UtcNow;
}

public interface IMatchmakingQueueService
{
    void Enqueue(MatchmakingQueueEntry entry);
    bool Dequeue(Guid userId);
    MatchmakingQueueEntry? GetEntry(Guid userId);
}

public class MatchmakingQueueService : BackgroundService, IMatchmakingQueueService
{
    private readonly ConcurrentDictionary<Guid, MatchmakingQueueEntry> _queue = new();
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IBattleSessionManager _sessionManager;
    private readonly IHubContext<BattleHub> _hubContext;
    private readonly ILogger<MatchmakingQueueService> _logger;

    private static readonly string[] BotNames =
    {
        "LanAnh_9x", "AlexWalker", "MinhVu", "EmilyNguyen", "David_K",
        "ThuTrang", "BrainMaster", "Sarah_T", "HoangLong", "FastLearner",
        "DragonK", "MaiAnh99", "EliteSpeed", "FlashWord", "ProVn"
    };

    public MatchmakingQueueService(
        IServiceScopeFactory scopeFactory,
        IBattleSessionManager sessionManager,
        IHubContext<BattleHub> hubContext,
        ILogger<MatchmakingQueueService> logger
    )
    {
        _scopeFactory = scopeFactory;
        _sessionManager = sessionManager;
        _hubContext = hubContext;
        _logger = logger;
    }

    public void Enqueue(MatchmakingQueueEntry entry)
    {
        _queue[entry.UserId] = entry;
    }

    public bool Dequeue(Guid userId)
    {
        return _queue.TryRemove(userId, out _);
    }

    public MatchmakingQueueEntry? GetEntry(Guid userId)
    {
        _queue.TryGetValue(userId, out var entry);
        return entry;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessQueueIterationAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing matchmaking queue");
            }

            await Task.Delay(1000, stoppingToken);
        }
    }

    private async Task ProcessQueueIterationAsync(CancellationToken ct)
    {
        if (_queue.IsEmpty) return;

        var now = DateTime.UtcNow;
        var entries = _queue.Values.ToList();
        var matchedUserIds = new HashSet<Guid>();

        // 1. Notify queue status & find human vs human matches
        for (int i = 0; i < entries.Count; i++)
        {
            var p1 = entries[i];
            if (matchedUserIds.Contains(p1.UserId)) continue;

            int waitSeconds = (int)(now - p1.EnqueuedAt).TotalSeconds;
            int range = waitSeconds <= 5 ? 50 : (waitSeconds <= 10 ? 100 : 200);

            // Send status update to client
            await _hubContext.Clients.Client(p1.ConnectionId)
                .SendAsync("QueueStatusUpdate", new QueueStatusPayload
                {
                    QueueTimeSeconds = waitSeconds,
                    SearchRangeTrophy = range
                }, ct);

            // Try to find a human opponent
            for (int j = i + 1; j < entries.Count; j++)
            {
                var p2 = entries[j];
                if (matchedUserIds.Contains(p2.UserId)) continue;

                int waitSeconds2 = (int)(now - p2.EnqueuedAt).TotalSeconds;
                int range2 = waitSeconds2 <= 5 ? 50 : (waitSeconds2 <= 10 ? 100 : 200);
                int maxRange = Math.Max(range, range2);

                if (Math.Abs(p1.Trophy - p2.Trophy) <= maxRange)
                {
                    // Matched!
                    matchedUserIds.Add(p1.UserId);
                    matchedUserIds.Add(p2.UserId);
                    _queue.TryRemove(p1.UserId, out _);
                    _queue.TryRemove(p2.UserId, out _);

                    await StartMatchAsync(p1, p2, isP2Bot: false);
                    break;
                }
            }

            // 2. If wait > 15s and still not matched -> Spawn AI Bot!
            if (!matchedUserIds.Contains(p1.UserId) && waitSeconds >= 15)
            {
                matchedUserIds.Add(p1.UserId);
                _queue.TryRemove(p1.UserId, out _);

                var bot = CreateBotParticipant(p1.Tier, p1.Trophy);
                await StartMatchWithBotAsync(p1, bot);
            }
        }
    }

    private MatchmakingQueueEntry CreateBotParticipant(RankTier tier, int playerTrophy)
    {
        var random = new Random();
        var name = BotNames[random.Next(BotNames.Length)];
        int deltaTrophy = random.Next(-40, 41);
        int botTrophy = Math.Max(0, playerTrophy + deltaTrophy);

        return new MatchmakingQueueEntry
        {
            UserId = Guid.NewGuid(),
            ConnectionId = string.Empty,
            DisplayName = name,
            AvatarUrl = $"https://api.dicebear.com/7.x/bottts/svg?seed={Uri.EscapeDataString(name.ToLower())}",
            Tier = tier,
            Division = "II",
            Trophy = botTrophy
        };
    }

    private async Task StartMatchAsync(MatchmakingQueueEntry q1, MatchmakingQueueEntry q2, bool isP2Bot)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Select topic and words
        Topic? topic = null;
        if (q1.PreferredTopicId.HasValue)
        {
            topic = await db.Topics.Include(t => t.Words).FirstOrDefaultAsync(t => t.Id == q1.PreferredTopicId.Value);
        }
        if (topic == null || topic.Words.Count < 5)
        {
            topic = await db.Topics.Include(t => t.Words).OrderBy(r => EF.Functions.Random()).FirstOrDefaultAsync();
        }

        var words = topic?.Words.ToList() ?? new List<Word>();
        if (words.Count == 0)
        {
            words = await db.Words.Take(10).ToListAsync();
        }

        // Shuffle words and pick 10
        var random = new Random();
        var selectedWords = words.OrderBy(_ => random.Next()).Take(10).ToList();
        var pairs = selectedWords.Select(w => new WordPairDto
        {
            Id = w.Id.ToString(),
            English = w.Term,
            Vietnamese = w.DefinitionVi
        }).ToList();

        var p1State = new BattleParticipantState
        {
            UserId = q1.UserId,
            ConnectionId = q1.ConnectionId,
            DisplayName = q1.DisplayName,
            AvatarUrl = q1.AvatarUrl,
            Tier = q1.Tier,
            Division = q1.Division,
            InitialTrophy = q1.Trophy,
            IsBot = false
        };

        var p2State = new BattleParticipantState
        {
            UserId = q2.UserId,
            ConnectionId = q2.ConnectionId,
            DisplayName = q2.DisplayName,
            AvatarUrl = q2.AvatarUrl,
            Tier = q2.Tier,
            Division = q2.Division,
            InitialTrophy = q2.Trophy,
            IsBot = isP2Bot
        };

        var session = _sessionManager.CreateSession(
            p1State,
            p2State,
            topic?.Id ?? Guid.Empty,
            topic?.Name ?? "General English",
            pairs
        );

        // Send MatchFound to P1
        var p1Payload = new MatchFoundPayload
        {
            MatchId = session.MatchId,
            DurationSeconds = 60,
            TopicId = session.TopicId,
            TopicName = session.TopicName,
            Opponent = new MatchPlayerDto
            {
                UserId = p2State.UserId,
                DisplayName = p2State.DisplayName,
                AvatarUrl = p2State.AvatarUrl,
                Tier = p2State.Tier.ToString(),
                Division = p2State.Division,
                CurrentTrophy = p2State.InitialTrophy,
                IsBot = p2State.IsBot
            },
            Pairs = pairs
        };
        await _hubContext.Clients.Client(p1State.ConnectionId).SendAsync("MatchFound", p1Payload);

        // Send MatchFound to P2 if human
        if (!p2State.IsBot && !string.IsNullOrEmpty(p2State.ConnectionId))
        {
            var p2Payload = new MatchFoundPayload
            {
                MatchId = session.MatchId,
                DurationSeconds = 60,
                TopicId = session.TopicId,
                TopicName = session.TopicName,
                Opponent = new MatchPlayerDto
                {
                    UserId = p1State.UserId,
                    DisplayName = p1State.DisplayName,
                    AvatarUrl = p1State.AvatarUrl,
                    Tier = p1State.Tier.ToString(),
                    Division = p1State.Division,
                    CurrentTrophy = p1State.InitialTrophy,
                    IsBot = false
                },
                Pairs = pairs
            };
            await _hubContext.Clients.Client(p2State.ConnectionId).SendAsync("MatchFound", p2Payload);
        }

        // Start countdown and battle clock
        _ = Task.Run(async () =>
        {
            // 3 seconds countdown
            await Task.Delay(3000);
            session.StartedAt = DateTime.UtcNow;

            var battleStarted = new BattleStartedPayload { StartTimeUtc = session.StartedAt };
            if (!string.IsNullOrEmpty(p1State.ConnectionId))
            {
                await _hubContext.Clients.Client(p1State.ConnectionId).SendAsync("BattleStarted", battleStarted);
            }
            if (!p2State.IsBot && !string.IsNullOrEmpty(p2State.ConnectionId))
            {
                await _hubContext.Clients.Client(p2State.ConnectionId).SendAsync("BattleStarted", battleStarted);
            }

            // 60-second match timer
            try
            {
                await Task.Delay(60000, session.MatchCts.Token);
                if (!session.IsFinished)
                {
                    await _sessionManager.FinishMatchAsync(session.MatchId, "Timeout");
                }
            }
            catch (TaskCanceledException)
            {
                // Completed early
            }
        });
    }

    private async Task StartMatchWithBotAsync(MatchmakingQueueEntry player, MatchmakingQueueEntry bot)
    {
        await StartMatchAsync(player, bot, isP2Bot: true);

        // Run AI Bot simulation
        var session = _sessionManager.GetSessionByUser(player.UserId);
        if (session == null) return;

        _ = Task.Run(async () =>
        {
            // Wait 3s countdown + 1s initial thinking
            await Task.Delay(4000, session.MatchCts.Token);

            var random = new Random();
            var tier = bot.Tier;

            // Accuracy & latency from spec
            double accuracy = tier switch
            {
                RankTier.Bronze => 0.65,
                RankTier.Silver => 0.75,
                RankTier.Gold => 0.84,
                RankTier.Platinum => 0.90,
                RankTier.Diamond => 0.95,
                RankTier.Master => 0.96,
                _ => 0.75
            };

            int minLatencyMs = tier switch
            {
                RankTier.Bronze => 3500,
                RankTier.Silver => 2800,
                RankTier.Gold => 2200,
                RankTier.Platinum => 1800,
                RankTier.Diamond => 1300,
                RankTier.Master => 1200,
                _ => 2500
            };

            int maxLatencyMs = tier switch
            {
                RankTier.Bronze => 5000,
                RankTier.Silver => 4000,
                RankTier.Gold => 3200,
                RankTier.Platinum => 2500,
                RankTier.Diamond => 1800,
                RankTier.Master => 1800,
                _ => 3500
            };

            var botState = session.Player2;

            for (int i = 0; i < 10 && !session.IsFinished; i++)
            {
                int delay = random.Next(minLatencyMs, maxLatencyMs);
                try
                {
                    await Task.Delay(delay, session.MatchCts.Token);
                }
                catch (TaskCanceledException)
                {
                    break;
                }

                if (session.IsFinished) break;

                bool isCorrect = random.NextDouble() <= accuracy;
                if (isCorrect)
                {
                    botState.CompletedPairs++;
                    botState.CurrentCombo++;
                    if (botState.CurrentCombo > botState.MaxCombo) botState.MaxCombo = botState.CurrentCombo;
                    int comboBonus = botState.CurrentCombo >= 4 ? 60 : (botState.CurrentCombo == 3 ? 40 : (botState.CurrentCombo == 2 ? 20 : 0));
                    int speedBonus = delay <= 2000 ? 50 : (delay <= 3500 ? 30 : 10);
                    botState.Score += 100 + speedBonus + comboBonus;
                }
                else
                {
                    botState.CurrentCombo = 0;
                    botState.Score = Math.Max(0, botState.Score - 30);
                    botState.WrongCount++;
                }

                var update = new OpponentProgressPayload
                {
                    MatchId = session.MatchId,
                    OpponentUserId = botState.UserId,
                    CurrentScore = botState.Score,
                    CompletedPairsCount = botState.CompletedPairs,
                    CurrentCombo = botState.CurrentCombo,
                    IsCompleted = botState.CompletedPairs >= 10
                };

                if (!string.IsNullOrEmpty(session.Player1.ConnectionId))
                {
                    await _hubContext.Clients.Client(session.Player1.ConnectionId).SendAsync("OpponentProgressUpdate", update);
                }

                if (botState.CompletedPairs >= 10)
                {
                    botState.IsCompleted = true;
                    await _sessionManager.FinishMatchAsync(session.MatchId, "NormalCompletion");
                    break;
                }
            }
        });
    }
}
