using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnEnglish.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddFourSkillsLearningHub : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Coins",
                table: "user_profiles",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "daily_balanced_progress",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    PracticeDate = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    CompletedListening = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    CompletedReading = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    CompletedWriting = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    CompletedSpeaking = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    BonusClaimed = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    BonusClaimedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_daily_balanced_progress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_daily_balanced_progress_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "skill_domains",
                columns: table => new
                {
                    Code = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    NameVi = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    NameEn = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    IconName = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    ThemeColor = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                    DisplayOrder = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_skill_domains", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "skill_domain_games",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    SkillDomainCode = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    GameTypeCode = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    DisplayTitle = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    DifficultyTier = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false, defaultValue: "B1_B2"),
                    IsPrimary = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true),
                    DisplayOrder = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_skill_domain_games", x => x.Id);
                    table.ForeignKey(
                        name: "FK_skill_domain_games_skill_domains_SkillDomainCode",
                        column: x => x.SkillDomainCode,
                        principalTable: "skill_domains",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_skill_progress",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    SkillDomainCode = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    MasteryScore = table.Column<decimal>(type: "TEXT", precision: 5, scale: 2, nullable: false, defaultValue: 0m),
                    TotalXp = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    GamesPlayed = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    PerfectGames = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    LastPracticedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_skill_progress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_user_skill_progress_skill_domains_SkillDomainCode",
                        column: x => x.SkillDomainCode,
                        principalTable: "skill_domains",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_skill_progress_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_daily_balanced_progress_UserId_PracticeDate",
                table: "daily_balanced_progress",
                columns: new[] { "UserId", "PracticeDate" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_skill_domain_games_SkillDomainCode_GameTypeCode",
                table: "skill_domain_games",
                columns: new[] { "SkillDomainCode", "GameTypeCode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_user_skill_progress_SkillDomainCode",
                table: "user_skill_progress",
                column: "SkillDomainCode");

            migrationBuilder.CreateIndex(
                name: "IX_user_skill_progress_UserId_SkillDomainCode",
                table: "user_skill_progress",
                columns: new[] { "UserId", "SkillDomainCode" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "daily_balanced_progress");

            migrationBuilder.DropTable(
                name: "skill_domain_games");

            migrationBuilder.DropTable(
                name: "user_skill_progress");

            migrationBuilder.DropTable(
                name: "skill_domains");

            migrationBuilder.DropColumn(
                name: "Coins",
                table: "user_profiles");
        }
    }
}
