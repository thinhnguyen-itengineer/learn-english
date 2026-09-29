using LearnEnglish.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.BackgroundWorkers;

public class SrsReviewDecayWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<SrsReviewDecayWorker> _logger;

    public SrsReviewDecayWorker(IServiceScopeFactory scopeFactory, ILogger<SrsReviewDecayWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("SrsReviewDecayWorker started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    var now = DateTime.UtcNow;

                    var dueCount = await db.UserMistakeBanks
                        .CountAsync(m => m.Status != "Mastered" && m.NextReviewDate <= now, stoppingToken);

                    _logger.LogInformation("SRS Review Queue Scan: {DueCount} cards currently due for review.", dueCount);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during SRS review queue scanning.");
            }

            // Runs every 6 hours
            await Task.Delay(TimeSpan.FromHours(6), stoppingToken);
        }
    }
}
