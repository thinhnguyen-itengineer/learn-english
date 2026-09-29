using System.Security.Claims;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.Domain.Entities;
using LearnEnglish.Api.DTOs;
using LearnEnglish.Api.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Hubs;

public class BattleHub : Hub
{
    private readonly IMatchmakingQueueService _queueService;
    private readonly IBattleSessionManager _sessionManager;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<BattleHub> _logger;

    public BattleHub(
        IMatchmakingQueueService queueService,
        IBattleSessionManager sessionManager,
        IServiceScopeFactory scopeFactory,
        ILogger<BattleHub> logger
    )
    {
        _queueService = queueService;
        _sessionManager = sessionManager;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    private Guid GetUserId()
    {
        var idStr = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier) 
                    ?? Context.User?.FindFirstValue("sub")
                    ?? Context.GetHttpContext()?.Request.Query["userId"].ToString();

        if (Guid.TryParse(idStr, out var userId))
        {
            return userId;
        }

        // Generate or fallback guest id
        return Guid.Empty;
    }

    public async Task JoinMatchmakingQueue(JoinQueueRequest? request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty)
        {
            await Clients.Caller.SendAsync("Error", "Authentication required to join queue.");
            return;
        }

        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var user = await db.Users
            .Include(u => u.Profile)
            .Include(u => u.Rank)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            await Clients.Caller.SendAsync("Error", "User not found.");
            return;
        }

        if (user.Rank == null)
        {
            user.Rank = new UserRank
            {
                UserId = user.Id,
                Trophy = 0,
                Tier = RankTier.Bronze,
                Division = "III"
            };
            db.UserRanks.Add(user.Rank);
            await db.SaveChangesAsync();
        }

        var entry = new MatchmakingQueueEntry
        {
            UserId = user.Id,
            ConnectionId = Context.ConnectionId,
            DisplayName = user.Profile?.DisplayName ?? user.Username,
            AvatarUrl = user.Profile?.AvatarUrl ?? $"https://api.dicebear.com/7.x/bottts/svg?seed={user.Username}",
            Tier = user.Rank.Tier,
            Division = user.Rank.Division,
            Trophy = user.Rank.Trophy,
            PreferredTopicId = request?.PreferredTopicId,
            EnqueuedAt = DateTime.UtcNow
        };

        _queueService.Enqueue(entry);
        _logger.LogInformation("User {UserId} joined matchmaking queue. Trophy: {Trophy}", user.Id, user.Rank.Trophy);
    }

    public Task LeaveMatchmakingQueue()
    {
        var userId = GetUserId();
        if (userId != Guid.Empty)
        {
            _queueService.Dequeue(userId);
            _logger.LogInformation("User {UserId} left matchmaking queue.", userId);
        }
        return Task.CompletedTask;
    }

    public async Task SendPlayerProgress(PlayerProgressDto progress)
    {
        var userId = GetUserId();
        if (userId != Guid.Empty)
        {
            await _sessionManager.HandlePlayerProgressAsync(progress.MatchId, userId, progress);
        }
    }

    public async Task FinishMatchEarly(FinishMatchRequest request)
    {
        var userId = GetUserId();
        if (userId != Guid.Empty)
        {
            await _sessionManager.HandleFinishEarlyAsync(request.MatchId, userId, request.TotalTimeMs);
        }
    }

    public async Task ForfeitMatch(ForfeitMatchRequest request)
    {
        var userId = GetUserId();
        if (userId != Guid.Empty)
        {
            await _sessionManager.HandleForfeitAsync(request.MatchId, userId);
        }
    }

    public async Task ReconnectMatch(ReconnectMatchRequest request)
    {
        var userId = GetUserId();
        if (userId != Guid.Empty)
        {
            await _sessionManager.HandleReconnectAsync(request.MatchId, userId, Context.ConnectionId);
        }
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();
        if (userId != Guid.Empty)
        {
            var session = _sessionManager.GetSessionByUser(userId);
            if (session != null && !session.IsFinished)
            {
                await _sessionManager.HandleReconnectAsync(session.MatchId, userId, Context.ConnectionId);
            }
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();
        if (userId != Guid.Empty)
        {
            _queueService.Dequeue(userId);
            await _sessionManager.HandleDisconnectAsync(userId, Context.ConnectionId);
        }
        await base.OnDisconnectedAsync(exception);
    }
}
