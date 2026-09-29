using System.Text;
using LearnEnglish.Api.Data;
using LearnEnglish.Api.Hubs;
using LearnEnglish.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure Database (PostgreSQL primary with seamless SQLite fallback if Postgres is offline)
var pgConn = builder.Configuration.GetConnectionString("DefaultConnection") 
             ?? "Host=localhost;Port=5432;Database=learnenglish;Username=postgres;Password=postgres";
var sqliteConn = builder.Configuration.GetConnectionString("SqliteConnection") 
                 ?? "Data Source=learnenglish.db";

var dbProvider = builder.Configuration["DatabaseProvider"]?.ToLower();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (dbProvider == "postgres")
    {
        options.UseNpgsql(pgConn);
    }
    else if (dbProvider == "sqlite")
    {
        options.UseSqlite(sqliteConn);
    }
    else
    {
        // Auto-detect: try Postgres if configured, else Sqlite
        try
        {
            using var tcp = new System.Net.Sockets.TcpClient();
            var result = tcp.BeginConnect("127.0.0.1", 5432, null, null);
            var success = result.AsyncWaitHandle.WaitOne(TimeSpan.FromMilliseconds(500));
            if (success && tcp.Connected)
            {
                options.UseNpgsql(pgConn);
                return;
            }
        }
        catch
        {
            // Ignore connection test error
        }

        // Fallback to SQLite for instant out-of-the-box local testing
        options.UseSqlite(sqliteConn);
    }
});

// 2. Configure Dependency Injection
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<ITokenLedgerService, TokenLedgerService>();
builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddScoped<ISkillService, SkillService>();
builder.Services.AddSingleton<IEloRatingCalculator, EloRatingCalculator>();
builder.Services.AddSingleton<IBattleSessionManager, BattleSessionManager>();
builder.Services.AddSingleton<MatchmakingQueueService>();
builder.Services.AddSingleton<IMatchmakingQueueService>(sp => sp.GetRequiredService<MatchmakingQueueService>());
builder.Services.AddHostedService(sp => sp.GetRequiredService<MatchmakingQueueService>());

// Retention & Gamification Subsystem Services
builder.Services.AddScoped<ISrsClinicService, SrsClinicService>();
builder.Services.AddScoped<IHabitService, HabitService>();
builder.Services.AddScoped<IWeeklyLeagueService, WeeklyLeagueService>();
builder.Services.AddScoped<IStudySquadService, StudySquadService>();
builder.Services.AddScoped<IAsyncChallengeService, AsyncChallengeService>();
builder.Services.AddScoped<ISpeechAiService, SpeechAiService>();

// Retention Background Workers
builder.Services.AddHostedService<LearnEnglish.Api.BackgroundWorkers.MidnightStreakProtectionWorker>();
builder.Services.AddHostedService<LearnEnglish.Api.BackgroundWorkers.WeeklyLeagueFinalizationWorker>();
builder.Services.AddHostedService<LearnEnglish.Api.BackgroundWorkers.SrsReviewDecayWorker>();
builder.Services.AddHostedService<LearnEnglish.Api.BackgroundWorkers.SquadWeeklyResetWorker>();

builder.Services.AddSignalR();

// 3. Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "PaperclipLearnEnglishDefaultSecretKeyForJwtAuthentication2026!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "LearnEnglishApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "LearnEnglishClient";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// 4. Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// 5. Configure Controllers & Swagger
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Learn English Mini-game API",
        Version = "v1",
        Description = "API cho nền tảng học tiếng Anh qua 6 mini-game: Word Match, Speed Falling Word, Sentence Scramble, Audio Blitz, Cloze Master, Grammar Detective và Đấu trường 1v1 Realtime"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Ví dụ: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// 6. Migrate and Seed Data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var db = services.GetRequiredService<AppDbContext>();
        try
        {
            await db.Database.MigrateAsync();
            logger.LogInformation("Database migrated successfully via EF Core migrations.");
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "MigrateAsync note: falling back to dynamic schema sync.");
            await db.Database.EnsureCreatedAsync();
        }

        // For SQLite in development, EnsureCreatedAsync() does not add newly defined tables or columns to an existing database file.
        // We ensure all missing tables and columns (like Coins in user_profiles) are created safely without wiping user data.
        if (db.Database.ProviderName?.Contains("Sqlite", StringComparison.OrdinalIgnoreCase) == true)
        {
            try
            {
                var columns = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                var conn = db.Database.GetDbConnection();
                if (conn.State != System.Data.ConnectionState.Open)
                {
                    await conn.OpenAsync();
                }
                using var cmd = conn.CreateCommand();
                cmd.CommandText = "PRAGMA table_info(user_profiles);";
                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    columns.Add(reader.GetString(1));
                }
                await reader.CloseAsync();

                var missingCols = new Dictionary<string, string>
                {
                    { "Coins", "INTEGER NOT NULL DEFAULT 350" },
                    { "TokenBalance", "INTEGER NOT NULL DEFAULT 350" },
                    { "TotalTokensEarned", "INTEGER NOT NULL DEFAULT 350" },
                    { "DailyTokensEarned", "INTEGER NOT NULL DEFAULT 0" },
                    { "LastTokenResetAt", "TEXT NOT NULL DEFAULT '2026-01-01T00:00:00Z'" },
                    { "Bio", "TEXT NULL" },
                    { "CustomTitle", "TEXT NOT NULL DEFAULT 'Người Học Mới (Novice Learner)'" },
                    { "UnlockedPresetSlots", "INTEGER NOT NULL DEFAULT 1" },
                    { "ActivePresetSlot", "INTEGER NOT NULL DEFAULT 1" },
                    { "CreatedAt", "TEXT NOT NULL DEFAULT '2026-01-01T00:00:00Z'" }
                };

                foreach (var (col, def) in missingCols)
                {
                    if (!columns.Contains(col))
                    {
                        using var alterCmd = conn.CreateCommand();
                        alterCmd.CommandText = $"ALTER TABLE user_profiles ADD COLUMN {col} {def};";
                        await alterCmd.ExecuteNonQueryAsync();
                        logger.LogInformation("Added missing '{Column}' column to 'user_profiles' table.", col);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Could not check or add missing columns to user_profiles table.");
            }

            // 2. Ensure missing tables and indexes
            var createScript = db.Database.GenerateCreateScript();
            var statements = createScript
                .Replace("CREATE TABLE ", "CREATE TABLE IF NOT EXISTS ", StringComparison.OrdinalIgnoreCase)
                .Replace("CREATE UNIQUE INDEX ", "CREATE UNIQUE INDEX IF NOT EXISTS ", StringComparison.OrdinalIgnoreCase)
                .Replace("CREATE INDEX ", "CREATE INDEX IF NOT EXISTS ", StringComparison.OrdinalIgnoreCase)
                .Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

            foreach (var stmt in statements)
            {
                if (!string.IsNullOrWhiteSpace(stmt))
                {
                    try
                    {
                        await db.Database.ExecuteSqlRawAsync(stmt + ";");
                    }
                    catch
                    {
                        // Ignore harmless warnings (e.g. index already exists)
                    }
                }
            }
        }

        await DataSeeder.SeedAsync(db);
        logger.LogInformation("Database initialized and seeded successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while initializing the database.");
    }
}

// 7. HTTP Request Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Learn English API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<BattleHub>("/hubs/battle");

app.Run();
