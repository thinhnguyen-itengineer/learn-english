using System.Text.Json;
using LearnEnglish.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<Topic> Topics => Set<Topic>();
    public DbSet<Word> Words => Set<Word>();
    public DbSet<Sentence> Sentences => Set<Sentence>();
    public DbSet<GameSession> GameSessions => Set<GameSession>();
    public DbSet<UserRank> UserRanks => Set<UserRank>();
    public DbSet<Season> Seasons => Set<Season>();
    public DbSet<MatchSession> MatchSessions => Set<MatchSession>();
    public DbSet<MatchParticipant> MatchParticipants => Set<MatchParticipant>();
    public DbSet<LeaderboardSnapshot> LeaderboardSnapshots => Set<LeaderboardSnapshot>();
    public DbSet<AudioBlitzQuestion> AudioBlitzQuestions => Set<AudioBlitzQuestion>();
    public DbSet<ClozeQuestion> ClozeQuestions => Set<ClozeQuestion>();
    public DbSet<GrammarDetectiveQuestion> GrammarDetectiveQuestions => Set<GrammarDetectiveQuestion>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(e => e.Id);
            if (Database.ProviderName?.Contains("Npgsql", StringComparison.OrdinalIgnoreCase) == true)
            {
                entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            }
            entity.Property(e => e.Username).HasMaxLength(100).IsRequired();
            entity.HasIndex(e => e.Username).IsUnique();
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.HasIndex(e => e.Email).IsUnique();

            entity.HasOne(e => e.Profile)
                .WithOne(p => p.User)
                .HasForeignKey<UserProfile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // UserProfile
        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.ToTable("user_profiles");
            entity.HasKey(e => e.UserId);
            entity.Property(e => e.DisplayName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.AvatarUrl).HasMaxLength(500);
            entity.HasIndex(e => e.TotalXp);
            entity.HasIndex(e => e.CurrentStreak);
        });

        // Topic
        modelBuilder.Entity<Topic>(entity =>
        {
            entity.ToTable("topics");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(150).IsRequired();
            entity.Property(e => e.Slug).HasMaxLength(150).IsRequired();
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.Property(e => e.IconName).HasMaxLength(50).HasDefaultValue("BookOpen");
            entity.Property(e => e.DifficultyLevel).HasMaxLength(20).HasDefaultValue("Easy");
        });

        // Word
        modelBuilder.Entity<Word>(entity =>
        {
            entity.ToTable("words");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Term).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Phonetic).HasMaxLength(100);
            entity.Property(e => e.PartOfSpeech).HasMaxLength(50);
            entity.Property(e => e.DefinitionVi).HasMaxLength(255).IsRequired();
            entity.Property(e => e.AudioUrl).HasMaxLength(500);
            entity.Property(e => e.DifficultyLevel).HasMaxLength(20).HasDefaultValue("Easy");

            entity.HasOne(e => e.Topic)
                .WithMany(t => t.Words)
                .HasForeignKey(e => e.TopicId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.TopicId);
        });

        // Sentence
        modelBuilder.Entity<Sentence>(entity =>
        {
            entity.ToTable("sentences");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.EnglishText).IsRequired();
            entity.Property(e => e.VietnameseTranslation).IsRequired();
            entity.Property(e => e.DifficultyLevel).HasMaxLength(20).HasDefaultValue("Easy");

            var valueComparer = new Microsoft.EntityFrameworkCore.ChangeTracking.ValueComparer<List<string>>(
                (c1, c2) => (c1 == null && c2 == null) || (c1 != null && c2 != null && c1.SequenceEqual(c2)),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => c.ToList());

            entity.Property(e => e.Tokens)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                )
                .Metadata.SetValueComparer(valueComparer);

            entity.HasOne(e => e.Topic)
                .WithMany(t => t.Sentences)
                .HasForeignKey(e => e.TopicId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.TopicId);
        });

        // GameSession
        modelBuilder.Entity<GameSession>(entity =>
        {
            entity.ToTable("game_sessions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.GameType).HasConversion<string>().HasMaxLength(50).IsRequired();
            entity.Property(e => e.Status).HasConversion<string>().HasMaxLength(30).IsRequired();
            entity.Property(e => e.AccuracyRate).HasPrecision(5, 2);

            entity.HasOne(e => e.User)
                .WithMany(u => u.GameSessions)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Topic)
                .WithMany(t => t.GameSessions)
                .HasForeignKey(e => e.TopicId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.CompletedAt);
        });

        // UserRank
        modelBuilder.Entity<UserRank>(entity =>
        {
            entity.ToTable("user_ranks");
            entity.HasKey(e => e.UserId);
            entity.Property(e => e.Tier).HasConversion<string>().HasMaxLength(20).IsRequired();
            entity.Property(e => e.Division).HasMaxLength(10).HasDefaultValue("III");
            entity.HasIndex(e => e.Trophy);
            entity.HasIndex(e => new { e.Tier, e.Division });

            entity.HasOne(e => e.User)
                .WithOne(u => u.Rank)
                .HasForeignKey<UserRank>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Season
        modelBuilder.Entity<Season>(entity =>
        {
            entity.ToTable("seasons");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.HasIndex(e => e.SeasonNumber).IsUnique();
            entity.HasIndex(e => e.IsActive);
        });

        // MatchSession
        modelBuilder.Entity<MatchSession>(entity =>
        {
            entity.ToTable("match_sessions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.MatchType).HasMaxLength(30).HasDefaultValue("SpeedWordMatch");
            entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValue("Waiting");
            entity.Property(e => e.QuestionSeed).HasMaxLength(64);
            entity.Property(e => e.FinishReason).HasMaxLength(30);

            entity.HasOne(e => e.Season)
                .WithMany(s => s.MatchSessions)
                .HasForeignKey(e => e.SeasonId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Topic)
                .WithMany()
                .HasForeignKey(e => e.TopicId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(e => new { e.SeasonId, e.StartedAt });
        });

        // MatchParticipant
        modelBuilder.Entity<MatchParticipant>(entity =>
        {
            entity.ToTable("match_participants");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Result).HasConversion<string>().HasMaxLength(20).IsRequired();

            entity.HasOne(e => e.Match)
                .WithMany(m => m.Participants)
                .HasForeignKey(e => e.MatchId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.UserId, e.MatchId });
        });

        // LeaderboardSnapshot
        modelBuilder.Entity<LeaderboardSnapshot>(entity =>
        {
            entity.ToTable("leaderboard_snapshots");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Type).HasMaxLength(20).HasDefaultValue("Weekly");
            entity.Property(e => e.DisplayName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.AvatarUrl).HasMaxLength(255);
            entity.Property(e => e.Tier).HasMaxLength(20).IsRequired();
            entity.Property(e => e.WinRatePercentage).HasPrecision(5, 2);

            entity.HasOne(e => e.Season)
                .WithMany(s => s.Snapshots)
                .HasForeignKey(e => e.SeasonId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.SeasonId, e.Type, e.RankPosition });
        });

        // AudioBlitzQuestion
        modelBuilder.Entity<AudioBlitzQuestion>(entity =>
        {
            entity.ToTable("audio_blitz_questions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.AudioUrl).HasMaxLength(500).IsRequired();
            entity.Property(e => e.SlowAudioUrl).HasMaxLength(500);
            entity.Property(e => e.Phonetic).HasMaxLength(100).IsRequired();
            entity.Property(e => e.TargetWord).HasMaxLength(100).IsRequired();
            entity.Property(e => e.PartOfSpeech).HasMaxLength(50).IsRequired();
            entity.Property(e => e.DefinitionVi).HasMaxLength(255).IsRequired();
            entity.Property(e => e.ContextSentence).IsRequired();
            entity.Property(e => e.DistractorLetters).HasMaxLength(20).HasDefaultValue("ETAOIN");
            entity.Property(e => e.DifficultyLevel).HasMaxLength(20).HasDefaultValue("Easy");

            entity.HasOne(e => e.Topic)
                .WithMany()
                .HasForeignKey(e => e.TopicId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Word)
                .WithMany()
                .HasForeignKey(e => e.WordId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.TopicId, e.DifficultyLevel });
        });

        // ClozeQuestion
        modelBuilder.Entity<ClozeQuestion>(entity =>
        {
            entity.ToTable("cloze_questions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ContextSentence).IsRequired();
            entity.Property(e => e.SentenceTranslationVi).IsRequired();
            entity.Property(e => e.PartOfSpeechHint).HasMaxLength(50).IsRequired();
            entity.Property(e => e.CorrectWord).HasMaxLength(100).IsRequired();
            entity.Property(e => e.CorrectDefinitionVi).HasMaxLength(255).IsRequired();
            entity.Property(e => e.ExplanationText).IsRequired();
            entity.Property(e => e.DifficultyLevel).HasMaxLength(20).HasDefaultValue("Easy");

            var distractorComparer = new Microsoft.EntityFrameworkCore.ChangeTracking.ValueComparer<List<ClozeDistractorItem>>(
                (c1, c2) => (c1 == null && c2 == null) || (c1 != null && c2 != null && c1.SequenceEqual(c2)),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => c.ToList());

            entity.Property(e => e.Distractors)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<ClozeDistractorItem>>(v, (JsonSerializerOptions?)null) ?? new List<ClozeDistractorItem>()
                )
                .Metadata.SetValueComparer(distractorComparer);

            entity.HasOne(e => e.Topic)
                .WithMany()
                .HasForeignKey(e => e.TopicId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.TopicId, e.DifficultyLevel });
        });

        // GrammarDetectiveQuestion
        modelBuilder.Entity<GrammarDetectiveQuestion>(entity =>
        {
            entity.ToTable("grammar_detective_questions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CaseTitle).HasMaxLength(200).IsRequired();
            entity.Property(e => e.RawSentence).IsRequired();
            entity.Property(e => e.ErrorTokenIndex).IsRequired();
            entity.Property(e => e.ErrorTokenText).HasMaxLength(100).IsRequired();
            entity.Property(e => e.CorrectReplacement).HasMaxLength(100).IsRequired();
            entity.Property(e => e.GrammarRuleExplanation).IsRequired();
            entity.Property(e => e.DifficultyLevel).HasMaxLength(20).HasDefaultValue("Medium");

            var tokenComparer = new Microsoft.EntityFrameworkCore.ChangeTracking.ValueComparer<List<GrammarTokenItem>>(
                (c1, c2) => (c1 == null && c2 == null) || (c1 != null && c2 != null && c1.SequenceEqual(c2)),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => c.ToList());

            entity.Property(e => e.TokenSequence)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<GrammarTokenItem>>(v, (JsonSerializerOptions?)null) ?? new List<GrammarTokenItem>()
                )
                .Metadata.SetValueComparer(tokenComparer);

            var correctionOptionsComparer = new Microsoft.EntityFrameworkCore.ChangeTracking.ValueComparer<List<string>>(
                (c1, c2) => (c1 == null && c2 == null) || (c1 != null && c2 != null && c1.SequenceEqual(c2)),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => c.ToList());

            entity.Property(e => e.CorrectionOptions)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                )
                .Metadata.SetValueComparer(correctionOptionsComparer);

            entity.HasOne(e => e.Topic)
                .WithMany()
                .HasForeignKey(e => e.TopicId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.TopicId, e.DifficultyLevel });
        });
    }
}
