using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnEnglish.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddNewMiniGames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "users",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "TEXT",
                oldDefaultValueSql: "gen_random_uuid()");

            migrationBuilder.CreateTable(
                name: "audio_blitz_questions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TopicId = table.Column<Guid>(type: "TEXT", nullable: false),
                    WordId = table.Column<Guid>(type: "TEXT", nullable: false),
                    AudioUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    SlowAudioUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Phonetic = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    TargetWord = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    PartOfSpeech = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    DefinitionVi = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    ContextSentence = table.Column<string>(type: "TEXT", nullable: false),
                    DistractorLetters = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false, defaultValue: "ETAOIN"),
                    DifficultyLevel = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false, defaultValue: "Easy"),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audio_blitz_questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_audio_blitz_questions_topics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "topics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_audio_blitz_questions_words_WordId",
                        column: x => x.WordId,
                        principalTable: "words",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "cloze_questions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TopicId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ContextSentence = table.Column<string>(type: "TEXT", nullable: false),
                    SentenceTranslationVi = table.Column<string>(type: "TEXT", nullable: false),
                    PartOfSpeechHint = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    CorrectWord = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    CorrectDefinitionVi = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Distractors = table.Column<string>(type: "TEXT", nullable: false),
                    ExplanationText = table.Column<string>(type: "TEXT", nullable: false),
                    DifficultyLevel = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false, defaultValue: "Easy"),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cloze_questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_cloze_questions_topics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "topics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "grammar_detective_questions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TopicId = table.Column<Guid>(type: "TEXT", nullable: false),
                    CaseTitle = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    RawSentence = table.Column<string>(type: "TEXT", nullable: false),
                    TokenSequence = table.Column<string>(type: "TEXT", nullable: false),
                    ErrorTokenIndex = table.Column<int>(type: "INTEGER", nullable: false),
                    ErrorTokenText = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    CorrectionOptions = table.Column<string>(type: "TEXT", nullable: false),
                    CorrectReplacement = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    GrammarRuleExplanation = table.Column<string>(type: "TEXT", nullable: false),
                    DifficultyLevel = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false, defaultValue: "Medium"),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_grammar_detective_questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_grammar_detective_questions_topics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "topics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_audio_blitz_questions_TopicId_DifficultyLevel",
                table: "audio_blitz_questions",
                columns: new[] { "TopicId", "DifficultyLevel" });

            migrationBuilder.CreateIndex(
                name: "IX_audio_blitz_questions_WordId",
                table: "audio_blitz_questions",
                column: "WordId");

            migrationBuilder.CreateIndex(
                name: "IX_cloze_questions_TopicId_DifficultyLevel",
                table: "cloze_questions",
                columns: new[] { "TopicId", "DifficultyLevel" });

            migrationBuilder.CreateIndex(
                name: "IX_grammar_detective_questions_TopicId_DifficultyLevel",
                table: "grammar_detective_questions",
                columns: new[] { "TopicId", "DifficultyLevel" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "audio_blitz_questions");

            migrationBuilder.DropTable(
                name: "cloze_questions");

            migrationBuilder.DropTable(
                name: "grammar_detective_questions");

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "users",
                type: "TEXT",
                nullable: false,
                defaultValueSql: "gen_random_uuid()",
                oldClrType: typeof(Guid),
                oldType: "TEXT");
        }
    }
}
