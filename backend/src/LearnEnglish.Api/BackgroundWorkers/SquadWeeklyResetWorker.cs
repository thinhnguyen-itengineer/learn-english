using LearnEnglish.Api.Services;

namespace LearnEnglish.Api.BackgroundWorkers;

public class SquadWeeklyResetWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<SquadWeeklyResetWorker> _logger;

    public SquadWeeklyResetWorker(IServiceScopeFactory scopeFactory, ILogger<SquadWeeklyResetWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("SquadWeeklyResetWorker started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var nowVn = DateTime.UtcNow.AddHours(7);
                // If it's Monday 00:xx, reset weekly progress
                if (nowVn.DayOfWeek == DayOfWeek.Monday && nowVn.Hour == 0)
                {
                    using var scope = _scopeFactory.CreateScope();
                    var squadService = scope.ServiceProvider.GetRequiredService<IStudySquadService>();
                    await squadService.ResetWeeklySquadXpAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during squad weekly reset.");
            }

            // Check every hour
            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }
    }
}
