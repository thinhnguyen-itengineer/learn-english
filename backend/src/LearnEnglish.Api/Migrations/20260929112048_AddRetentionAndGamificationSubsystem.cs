using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnEnglish.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRetentionAndGamificationSubsystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "async_challenges",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ChallengeToken = table.Column<string>(type: "TEXT", maxLength: 32, nullable: false),
                    CreatorUserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    GameType = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    CreatorScore = table.Column<int>(type: "INTEGER", nullable: false),
                    QuestionSnapshotJson = table.Column<string>(type: "TEXT", nullable: false),
                    AttemptCount = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    ExpiresAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_async_challenges", x => x.Id);
                    table.ForeignKey(
                        name: "FK_async_challenges_users_CreatorUserId",
                        column: x => x.CreatorUserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "study_squads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    SquadCode = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    LeaderUserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    MaxMembers = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 10),
                    CurrentMembersCount = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 1),
                    TotalAccumulatedXp = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_study_squads", x => x.Id);
                    table.ForeignKey(
                        name: "FK_study_squads_users_LeaderUserId",
                        column: x => x.LeaderUserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "user_habit_states",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    CurrentStreak = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    MaxStreak = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    StreakFreezeCount = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    LastActiveDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    StreakBrokenAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EarlyBirdClaimed = table.Column<bool>(type: "INTEGER", nullable: false),
                    MiddayClaimed = table.Column<bool>(type: "INTEGER", nullable: false),
                    NightOwlClaimed = table.Column<bool>(type: "INTEGER", nullable: false),
                    ActiveClaimedDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_habit_states", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_user_habit_states_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_mistake_banks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    QuestionId = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    OriginGameType = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    SkillType = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Prompt = table.Column<string>(type: "TEXT", nullable: false),
                    Phonetic = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    AudioUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    ContextSentence = table.Column<string>(type: "TEXT", nullable: true),
                    CorrectAnswer = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    WrongAttemptsJson = table.Column<string>(type: "TEXT", nullable: false),
                    Explanation = table.Column<string>(type: "TEXT", nullable: true),
                    EaseFactor = table.Column<decimal>(type: "TEXT", precision: 4, scale: 2, nullable: false, defaultValue: 2.50m),
                    IntervalDays = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 1),
                    RepetitionCount = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    ConsecutiveSuccesses = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    Status = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false, defaultValue: "Learning"),
                    LastEvaluatedQuality = table.Column<int>(type: "INTEGER", nullable: true),
                    NextReviewDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastFailedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_mistake_banks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_user_mistake_banks_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "weekly_leagues",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    LeagueTier = table.Column<int>(type: "INTEGER", nullable: false),
                    WeekStartDate = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    WeekEndDate = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    RoomCode = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    MaxParticipants = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 30),
                    Status = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false, defaultValue: "Active"),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_weekly_leagues", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "async_challenge_attempts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ChallengeId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ParticipantUserId = table.Column<Guid>(type: "TEXT", nullable: true),
                    ParticipantName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Score = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    IsWinner = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    CompletedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_async_challenge_attempts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_async_challenge_attempts_async_challenges_ChallengeId",
                        column: x => x.ChallengeId,
                        principalTable: "async_challenges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_async_challenge_attempts_users_ParticipantUserId",
                        column: x => x.ParticipantUserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "squad_members",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    SquadId = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Role = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false, defaultValue: "Member"),
                    WeeklyContributedXp = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    HasClaimedWeeklyChest = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    JoinedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_squad_members", x => x.Id);
                    table.ForeignKey(
                        name: "FK_squad_members_study_squads_SquadId",
                        column: x => x.SquadId,
                        principalTable: "study_squads",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_squad_members_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "weekly_league_members",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    LeagueId = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    WeeklyXp = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    FinalRank = table.Column<int>(type: "INTEGER", nullable: true),
                    OutcomeStatus = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false, defaultValue: "Pending"),
                    JoinedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_weekly_league_members", x => x.Id);
                    table.ForeignKey(
                        name: "FK_weekly_league_members_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_weekly_league_members_weekly_leagues_LeagueId",
                        column: x => x.LeagueId,
                        principalTable: "weekly_leagues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_async_challenge_attempts_ChallengeId_Score",
                table: "async_challenge_attempts",
                columns: new[] { "ChallengeId", "Score" });

            migrationBuilder.CreateIndex(
                name: "IX_async_challenge_attempts_ParticipantUserId",
                table: "async_challenge_attempts",
                column: "ParticipantUserId");

            migrationBuilder.CreateIndex(
                name: "IX_async_challenges_ChallengeToken",
                table: "async_challenges",
                column: "ChallengeToken",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_async_challenges_CreatorUserId",
                table: "async_challenges",
                column: "CreatorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_squad_members_SquadId_UserId",
                table: "squad_members",
                columns: new[] { "SquadId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_squad_members_SquadId_WeeklyContributedXp",
                table: "squad_members",
                columns: new[] { "SquadId", "WeeklyContributedXp" });

            migrationBuilder.CreateIndex(
                name: "IX_squad_members_UserId",
                table: "squad_members",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_study_squads_LeaderUserId",
                table: "study_squads",
                column: "LeaderUserId");

            migrationBuilder.CreateIndex(
                name: "IX_study_squads_SquadCode",
                table: "study_squads",
                column: "SquadCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_user_mistake_banks_UserId_QuestionId",
                table: "user_mistake_banks",
                columns: new[] { "UserId", "QuestionId" });

            migrationBuilder.CreateIndex(
                name: "IX_user_mistake_banks_UserId_SkillType",
                table: "user_mistake_banks",
                columns: new[] { "UserId", "SkillType" });

            migrationBuilder.CreateIndex(
                name: "IX_user_mistake_banks_UserId_Status_NextReviewDate",
                table: "user_mistake_banks",
                columns: new[] { "UserId", "Status", "NextReviewDate" });

            migrationBuilder.CreateIndex(
                name: "IX_weekly_league_members_LeagueId_UserId",
                table: "weekly_league_members",
                columns: new[] { "LeagueId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_weekly_league_members_LeagueId_WeeklyXp",
                table: "weekly_league_members",
                columns: new[] { "LeagueId", "WeeklyXp" });

            migrationBuilder.CreateIndex(
                name: "IX_weekly_league_members_UserId",
                table: "weekly_league_members",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_weekly_leagues_WeekStartDate_LeagueTier_RoomCode",
                table: "weekly_leagues",
                columns: new[] { "WeekStartDate", "LeagueTier", "RoomCode" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "async_challenge_attempts");

            migrationBuilder.DropTable(
                name: "squad_members");

            migrationBuilder.DropTable(
                name: "user_habit_states");

            migrationBuilder.DropTable(
                name: "user_mistake_banks");

            migrationBuilder.DropTable(
                name: "weekly_league_members");

            migrationBuilder.DropTable(
                name: "async_challenges");

            migrationBuilder.DropTable(
                name: "study_squads");

            migrationBuilder.DropTable(
                name: "weekly_leagues");
        }
    }
}
