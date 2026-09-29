using LearnEnglish.Api.Services;

namespace LearnEnglish.Api.BackgroundWorkers;

public class MidnightStreakProtectionWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<MidnightStreakProtectionWorker> _logger;

    public MidnightStreakProtectionWorker(IServiceScopeFactory scopeFactory, ILogger<MidnightStreakProtectionWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("MidnightStreakProtectionWorker started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var habitService = scope.ServiceProvider.GetRequiredService<IHabitService>();
                    await habitService.ProcessMidnightStreakProtectionAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during midnight streak protection execution.");
            }

            // Run check every 15 minutes
            await Task.Delay(TimeSpan.FromMinutes(15), stoppingToken);
        }
    }
}
