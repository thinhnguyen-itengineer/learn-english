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
    public DbSet<SkillDomain> SkillDomains => Set<SkillDomain>();
    public DbSet<SkillDomainGame> SkillDomainGames => Set<SkillDomainGame>();
    public DbSet<UserSkillProgress> UserSkillProgresses => Set<UserSkillProgress>();
    public DbSet<DailyBalancedProgress> DailyBalancedProgresses => Set<DailyBalancedProgress>();
    public DbSet<UserMistakeBank> UserMistakeBanks => Set<UserMistakeBank>();
    public DbSet<UserHabitState> UserHabitStates => Set<UserHabitState>();
    public DbSet<WeeklyLeague> WeeklyLeagues => Set<WeeklyLeague>();
    public DbSet<WeeklyLeagueMember> WeeklyLeagueMembers => Set<WeeklyLeagueMember>();
    public DbSet<StudySquad> StudySquads => Set<StudySquad>();
    public DbSet<SquadMember> SquadMembers => Set<SquadMember>();
    public DbSet<AsyncChallenge> AsyncChallenges => Set<AsyncChallenge>();
    public DbSet<AsyncChallengeAttempt> AsyncChallengeAttempts => Set<AsyncChallengeAttempt>();

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

        // SkillDomain
        modelBuilder.Entity<SkillDomain>(entity =>
        {
            entity.ToTable("skill_domains");
            entity.HasKey(e => e.Code);
            entity.Property(e => e.Code).HasMaxLength(20);
            entity.Property(e => e.NameVi).HasMaxLength(100).IsRequired();
            entity.Property(e => e.NameEn).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description);
            entity.Property(e => e.IconName).HasMaxLength(50).IsRequired();
            entity.Property(e => e.ThemeColor).HasMaxLength(30).IsRequired();
            entity.Property(e => e.DisplayOrder).HasDefaultValue(0);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // SkillDomainGame
        modelBuilder.Entity<SkillDomainGame>(entity =>
        {
            entity.ToTable("skill_domain_games");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.SkillDomainCode).HasMaxLength(20).IsRequired();
            entity.Property(e => e.GameTypeCode).HasMaxLength(50).IsRequired();
            entity.Property(e => e.DisplayTitle).HasMaxLength(150).IsRequired();
            entity.Property(e => e.DifficultyTier).HasMaxLength(30).HasDefaultValue("B1_B2");
            entity.Property(e => e.IsPrimary).HasDefaultValue(true);
            entity.Property(e => e.DisplayOrder).HasDefaultValue(0);
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(e => e.SkillDomain)
                .WithMany(s => s.Games)
                .HasForeignKey(e => e.SkillDomainCode)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.SkillDomainCode, e.GameTypeCode }).IsUnique();
        });

        // UserSkillProgress
        modelBuilder.Entity<UserSkillProgress>(entity =>
        {
            entity.ToTable("user_skill_progress");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.SkillDomainCode).HasMaxLength(20).IsRequired();
            entity.Property(e => e.MasteryScore).HasPrecision(5, 2).HasDefaultValue(0m);
            entity.Property(e => e.TotalXp).HasDefaultValue(0);
            entity.Property(e => e.GamesPlayed).HasDefaultValue(0);
            entity.Property(e => e.PerfectGames).HasDefaultValue(0);

            entity.HasOne(e => e.User)
                .WithMany(u => u.SkillProgresses)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.SkillDomain)
                .WithMany(s => s.UserProgresses)
                .HasForeignKey(e => e.SkillDomainCode)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.UserId, e.SkillDomainCode }).IsUnique();
        });

        // DailyBalancedProgress
        modelBuilder.Entity<DailyBalancedProgress>(entity =>
        {
            entity.ToTable("daily_balanced_progress");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.PracticeDate).IsRequired();
            entity.Property(e => e.CompletedListening).HasDefaultValue(false);
            entity.Property(e => e.CompletedReading).HasDefaultValue(false);
            entity.Property(e => e.CompletedWriting).HasDefaultValue(false);
            entity.Property(e => e.CompletedSpeaking).HasDefaultValue(false);
            entity.Property(e => e.BonusClaimed).HasDefaultValue(false);

            entity.HasOne(e => e.User)
                .WithMany(u => u.DailyBalancedProgresses)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.UserId, e.PracticeDate }).IsUnique();
        });

        // UserMistakeBank
        modelBuilder.Entity<UserMistakeBank>(entity =>
        {
            entity.ToTable("user_mistake_banks");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.QuestionId).HasMaxLength(100).IsRequired();
            entity.Property(e => e.OriginGameType).HasMaxLength(50).IsRequired();
            entity.Property(e => e.SkillType).HasMaxLength(20).IsRequired();
            entity.Property(e => e.Prompt).IsRequired();
            entity.Property(e => e.Phonetic).HasMaxLength(100);
            entity.Property(e => e.AudioUrl).HasMaxLength(500);
            entity.Property(e => e.CorrectAnswer).HasMaxLength(500).IsRequired();
            entity.Property(e => e.EaseFactor).HasPrecision(4, 2).HasDefaultValue(2.50m);
            entity.Property(e => e.IntervalDays).HasDefaultValue(1);
            entity.Property(e => e.RepetitionCount).HasDefaultValue(0);
            entity.Property(e => e.ConsecutiveSuccesses).HasDefaultValue(0);
            entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValue("Learning");

            entity.HasOne(e => e.User)
                .WithMany(u => u.MistakeBanks)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.UserId, e.Status, e.NextReviewDate });
            entity.HasIndex(e => new { e.UserId, e.SkillType });
            entity.HasIndex(e => new { e.UserId, e.QuestionId });
        });

        // UserHabitState
        modelBuilder.Entity<UserHabitState>(entity =>
        {
            entity.ToTable("user_habit_states");
            entity.HasKey(e => e.UserId);
            entity.Property(e => e.CurrentStreak).HasDefaultValue(0);
            entity.Property(e => e.MaxStreak).HasDefaultValue(0);
            entity.Property(e => e.StreakFreezeCount).HasDefaultValue(0);

            entity.HasOne(e => e.User)
                .WithOne(u => u.HabitState)
                .HasForeignKey<UserHabitState>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // WeeklyLeague
        modelBuilder.Entity<WeeklyLeague>(entity =>
        {
            entity.ToTable("weekly_leagues");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.RoomCode).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValue("Active");
            entity.Property(e => e.MaxParticipants).HasDefaultValue(30);

            entity.HasIndex(e => new { e.WeekStartDate, e.LeagueTier, e.RoomCode }).IsUnique();
        });

        // WeeklyLeagueMember
        modelBuilder.Entity<WeeklyLeagueMember>(entity =>
        {
            entity.ToTable("weekly_league_members");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.WeeklyXp).HasDefaultValue(0);
            entity.Property(e => e.OutcomeStatus).HasMaxLength(20).HasDefaultValue("Pending");

            entity.HasOne(e => e.League)
                .WithMany(l => l.Members)
                .HasForeignKey(e => e.LeagueId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User)
                .WithMany(u => u.LeagueMemberships)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.LeagueId, e.UserId }).IsUnique();
            entity.HasIndex(e => new { e.LeagueId, e.WeeklyXp });
        });

        // StudySquad
        modelBuilder.Entity<StudySquad>(entity =>
        {
            entity.ToTable("study_squads");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.SquadCode).HasMaxLength(20).IsRequired();
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.MaxMembers).HasDefaultValue(10);
            entity.Property(e => e.CurrentMembersCount).HasDefaultValue(1);
            entity.Property(e => e.TotalAccumulatedXp).HasDefaultValue(0);

            entity.HasOne(e => e.Leader)
                .WithMany()
                .HasForeignKey(e => e.LeaderUserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.SquadCode).IsUnique();
        });

        // SquadMember
        modelBuilder.Entity<SquadMember>(entity =>
        {
            entity.ToTable("squad_members");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Role).HasMaxLength(20).HasDefaultValue("Member");
            entity.Property(e => e.WeeklyContributedXp).HasDefaultValue(0);
            entity.Property(e => e.HasClaimedWeeklyChest).HasDefaultValue(false);

            entity.HasOne(e => e.Squad)
                .WithMany(s => s.Members)
                .HasForeignKey(e => e.SquadId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User)
                .WithMany(u => u.SquadMemberships)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.SquadId, e.UserId }).IsUnique();
            entity.HasIndex(e => new { e.SquadId, e.WeeklyContributedXp });
        });

        // AsyncChallenge
        modelBuilder.Entity<AsyncChallenge>(entity =>
        {
            entity.ToTable("async_challenges");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ChallengeToken).HasMaxLength(32).IsRequired();
            entity.Property(e => e.GameType).HasMaxLength(50).IsRequired();
            entity.Property(e => e.AttemptCount).HasDefaultValue(0);

            entity.HasOne(e => e.Creator)
                .WithMany()
                .HasForeignKey(e => e.CreatorUserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.ChallengeToken).IsUnique();
        });

        // AsyncChallengeAttempt
        modelBuilder.Entity<AsyncChallengeAttempt>(entity =>
        {
            entity.ToTable("async_challenge_attempts");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ParticipantName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Score).HasDefaultValue(0);
            entity.Property(e => e.IsWinner).HasDefaultValue(false);

            entity.HasOne(e => e.Challenge)
                .WithMany(c => c.Attempts)
                .HasForeignKey(e => e.ChallengeId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.ParticipantUser)
                .WithMany()
                .HasForeignKey(e => e.ParticipantUserId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(e => new { e.ChallengeId, e.Score });
        });
    }
}
