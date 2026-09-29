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
builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddSingleton<IEloRatingCalculator, EloRatingCalculator>();
builder.Services.AddSingleton<IBattleSessionManager, BattleSessionManager>();
builder.Services.AddSingleton<MatchmakingQueueService>();
builder.Services.AddSingleton<IMatchmakingQueueService>(sp => sp.GetRequiredService<MatchmakingQueueService>());
builder.Services.AddHostedService(sp => sp.GetRequiredService<MatchmakingQueueService>());
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
        Description = "API cho nền tảng học tiếng Anh qua 3 mini-game: Word Match, Speed Falling Word, Sentence Scramble"
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
        await db.Database.EnsureCreatedAsync();
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
