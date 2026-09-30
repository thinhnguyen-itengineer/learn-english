using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnEnglish.Api.Migrations
{
    /// <inheritdoc />
    public partial class ExpandAvatar3DDualCharactersAndMatchingSets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ActiveGender",
                table: "user_avatar_equips_3d",
                type: "TEXT",
                maxLength: 16,
                nullable: false,
                defaultValue: "FEMALE");

            migrationBuilder.AddColumn<string>(
                name: "GenderCompatibility",
                table: "avatar_items_3d",
                type: "TEXT",
                maxLength: 20,
                nullable: false,
                defaultValue: "UNISEX");

            migrationBuilder.AddColumn<string>(
                name: "MeshVariantFemaleUrl",
                table: "avatar_items_3d",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MeshVariantMaleUrl",
                table: "avatar_items_3d",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SourceAiReference",
                table: "avatar_items_3d",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "avatar_matching_sets_3d",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", maxLength: 64, nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    Theme = table.Column<string>(type: "TEXT", maxLength: 64, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    BadgeText = table.Column<string>(type: "TEXT", maxLength: 64, nullable: false),
                    TokenPriceTotal = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    DiscountPercentage = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 15),
                    FemaleItemIds = table.Column<string>(type: "TEXT", nullable: false),
                    MaleItemIds = table.Column<string>(type: "TEXT", nullable: false),
                    FemalePreviewNames = table.Column<string>(type: "TEXT", nullable: false),
                    MalePreviewNames = table.Column<string>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_avatar_matching_sets_3d", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_avatar_items_3d_GenderCompatibility",
                table: "avatar_items_3d",
                column: "GenderCompatibility");

            migrationBuilder.CreateIndex(
                name: "IX_avatar_matching_sets_3d_Theme",
                table: "avatar_matching_sets_3d",
                column: "Theme");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "avatar_matching_sets_3d");

            migrationBuilder.DropIndex(
                name: "IX_avatar_items_3d_GenderCompatibility",
                table: "avatar_items_3d");

            migrationBuilder.DropColumn(
                name: "ActiveGender",
                table: "user_avatar_equips_3d");

            migrationBuilder.DropColumn(
                name: "GenderCompatibility",
                table: "avatar_items_3d");

            migrationBuilder.DropColumn(
                name: "MeshVariantFemaleUrl",
                table: "avatar_items_3d");

            migrationBuilder.DropColumn(
                name: "MeshVariantMaleUrl",
                table: "avatar_items_3d");

            migrationBuilder.DropColumn(
                name: "SourceAiReference",
                table: "avatar_items_3d");
        }
    }
}
