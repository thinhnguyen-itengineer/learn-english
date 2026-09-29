using LearnEnglish.Api.Services;

namespace LearnEnglish.Api.BackgroundWorkers;

public class WeeklyLeagueFinalizationWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<WeeklyLeagueFinalizationWorker> _logger;

    public WeeklyLeagueFinalizationWorker(IServiceScopeFactory scopeFactory, ILogger<WeeklyLeagueFinalizationWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("WeeklyLeagueFinalizationWorker started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var leagueService = scope.ServiceProvider.GetRequiredService<IWeeklyLeagueService>();
                    await leagueService.FinalizeCurrentWeekLeaguesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during weekly league finalization.");
            }

            // Periodic check every 30 minutes
            await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
        }
    }
}
