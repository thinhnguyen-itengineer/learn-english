using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnEnglish.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddLeaderboardAndBattle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "seasons",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    SeasonNumber = table.Column<int>(type: "INTEGER", nullable: false),
                    StartAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    RewardsConfig = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_seasons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "user_ranks",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Trophy = table.Column<int>(type: "INTEGER", nullable: false),
                    HighestTrophy = table.Column<int>(type: "INTEGER", nullable: false),
                    Tier = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Division = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false, defaultValue: "III"),
                    WinStreak = table.Column<int>(type: "INTEGER", nullable: false),
                    HighestWinStreak = table.Column<int>(type: "INTEGER", nullable: false),
                    ProtectionGamesLeft = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalMatches = table.Column<int>(type: "INTEGER", nullable: false),
                    Wins = table.Column<int>(type: "INTEGER", nullable: false),
                    Losses = table.Column<int>(type: "INTEGER", nullable: false),
                    Draws = table.Column<int>(type: "INTEGER", nullable: false),
                    AbandonCount = table.Column<int>(type: "INTEGER", nullable: false),
                    PenaltyUntil = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_ranks", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_user_ranks_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "leaderboard_snapshots",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    SeasonId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Type = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false, defaultValue: "Weekly"),
                    RankPosition = table.Column<int>(type: "INTEGER", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    DisplayName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    AvatarUrl = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Tier = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Trophy = table.Column<int>(type: "INTEGER", nullable: false),
                    WinRatePercentage = table.Column<decimal>(type: "TEXT", precision: 5, scale: 2, nullable: false),
                    RecordedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_leaderboard_snapshots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_leaderboard_snapshots_seasons_SeasonId",
                        column: x => x.SeasonId,
                        principalTable: "seasons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_leaderboard_snapshots_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "match_sessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    SeasonId = table.Column<Guid>(type: "TEXT", nullable: true),
                    MatchType = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false, defaultValue: "SpeedWordMatch"),
                    Status = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false, defaultValue: "Waiting"),
                    QuestionSeed = table.Column<string>(type: "TEXT", maxLength: 64, nullable: false),
                    TopicId = table.Column<Guid>(type: "TEXT", nullable: true),
                    WinnerId = table.Column<Guid>(type: "TEXT", nullable: true),
                    FinishReason = table.Column<string>(type: "TEXT", maxLength: 30, nullable: true),
                    DurationSeconds = table.Column<int>(type: "INTEGER", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_match_sessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_match_sessions_seasons_SeasonId",
                        column: x => x.SeasonId,
                        principalTable: "seasons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_match_sessions_topics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "topics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "match_participants",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    MatchId = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    IsBot = table.Column<bool>(type: "INTEGER", nullable: false),
                    FinalScore = table.Column<int>(type: "INTEGER", nullable: false),
                    CorrectCount = table.Column<int>(type: "INTEGER", nullable: false),
                    WrongCount = table.Column<int>(type: "INTEGER", nullable: false),
                    MaxCombo = table.Column<int>(type: "INTEGER", nullable: false),
                    FinishTimeMs = table.Column<int>(type: "INTEGER", nullable: false),
                    InitialTrophy = table.Column<int>(type: "INTEGER", nullable: false),
                    TrophyChange = table.Column<int>(type: "INTEGER", nullable: false),
                    EarnedXp = table.Column<int>(type: "INTEGER", nullable: false),
                    Result = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    IsForfeit = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_match_participants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_match_participants_match_sessions_MatchId",
                        column: x => x.MatchId,
                        principalTable: "match_sessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_match_participants_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_leaderboard_snapshots_SeasonId_Type_RankPosition",
                table: "leaderboard_snapshots",
                columns: new[] { "SeasonId", "Type", "RankPosition" });

            migrationBuilder.CreateIndex(
                name: "IX_leaderboard_snapshots_UserId",
                table: "leaderboard_snapshots",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_match_participants_MatchId",
                table: "match_participants",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_match_participants_UserId_MatchId",
                table: "match_participants",
                columns: new[] { "UserId", "MatchId" });

            migrationBuilder.CreateIndex(
                name: "IX_match_sessions_SeasonId_StartedAt",
                table: "match_sessions",
                columns: new[] { "SeasonId", "StartedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_match_sessions_TopicId",
                table: "match_sessions",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_seasons_IsActive",
                table: "seasons",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_seasons_SeasonNumber",
                table: "seasons",
                column: "SeasonNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_user_ranks_Tier_Division",
                table: "user_ranks",
                columns: new[] { "Tier", "Division" });

            migrationBuilder.CreateIndex(
                name: "IX_user_ranks_Trophy",
                table: "user_ranks",
                column: "Trophy");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "leaderboard_snapshots");

            migrationBuilder.DropTable(
                name: "match_participants");

            migrationBuilder.DropTable(
                name: "user_ranks");

            migrationBuilder.DropTable(
                name: "match_sessions");

            migrationBuilder.DropTable(
                name: "seasons");
        }
    }
}
