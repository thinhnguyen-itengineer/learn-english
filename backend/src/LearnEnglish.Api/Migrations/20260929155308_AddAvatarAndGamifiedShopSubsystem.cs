using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnEnglish.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAvatarAndGamifiedShopSubsystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ActivePresetSlot",
                table: "user_profiles",
                type: "INTEGER",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<string>(
                name: "Bio",
                table: "user_profiles",
                type: "TEXT",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "user_profiles",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CustomTitle",
                table: "user_profiles",
                type: "TEXT",
                maxLength: 100,
                nullable: false,
                defaultValue: "Người Học Mới (Novice Learner)");

            migrationBuilder.AddColumn<int>(
                name: "DailyTokensEarned",
                table: "user_profiles",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastTokenResetAt",
                table: "user_profiles",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "TokenBalance",
                table: "user_profiles",
                type: "INTEGER",
                nullable: false,
                defaultValue: 350);

            migrationBuilder.AddColumn<int>(
                name: "TotalTokensEarned",
                table: "user_profiles",
                type: "INTEGER",
                nullable: false,
                defaultValue: 350);

            migrationBuilder.AddColumn<int>(
                name: "UnlockedPresetSlots",
                table: "user_profiles",
                type: "INTEGER",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.CreateTable(
                name: "avatar_configs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    BodyType = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false, defaultValue: "neutral"),
                    SkinColor = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false, defaultValue: "#E8B898"),
                    HairStyleId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false, defaultValue: "short_crop"),
                    HairColor = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false, defaultValue: "#1C1917"),
                    EyeExpression = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false, defaultValue: "friendly_smile"),
                    MouthExpression = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false, defaultValue: "smile_open"),
                    TopsId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false, defaultValue: "starter_tee_white"),
                    BottomsId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false, defaultValue: "starter_jeans_blue"),
                    FootwearId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false, defaultValue: "starter_sneakers_white"),
                    HeadwearId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    EyewearId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    NeckwearId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    HandheldId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    AuraBackgroundId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true, defaultValue: "pedestal_wood_circle"),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_avatar_configs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_avatar_configs_user_profiles_UserId",
                        column: x => x.UserId,
                        principalTable: "user_profiles",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "avatar_presets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    PresetIndex = table.Column<int>(type: "INTEGER", nullable: false),
                    PresetName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    ConfigData = table.Column<string>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_avatar_presets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_avatar_presets_user_profiles_UserId",
                        column: x => x.UserId,
                        principalTable: "user_profiles",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "shop_items",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ItemCode = table.Column<string>(type: "TEXT", maxLength: 80, nullable: false),
                    NameEn = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    NameVi = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Category = table.Column<string>(type: "TEXT", maxLength: 40, nullable: false),
                    LayerSlot = table.Column<string>(type: "TEXT", maxLength: 40, nullable: false),
                    RarityTier = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false, defaultValue: "common"),
                    TokenPrice = table.Column<int>(type: "INTEGER", nullable: false),
                    RequiredLevel = table.Column<int>(type: "INTEGER", nullable: false),
                    IsPurchasable = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsLimitedEdition = table.Column<bool>(type: "INTEGER", nullable: false),
                    AssetSvgKey = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    ZIndex = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_shop_items", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "token_transactions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Amount = table.Column<int>(type: "INTEGER", nullable: false),
                    BalanceAfter = table.Column<int>(type: "INTEGER", nullable: false),
                    TransactionType = table.Column<string>(type: "TEXT", maxLength: 40, nullable: false),
                    SourceCategory = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    ReferenceId = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Description = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_token_transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_token_transactions_user_profiles_UserId",
                        column: x => x.UserId,
                        principalTable: "user_profiles",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_inventory",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ItemId = table.Column<Guid>(type: "TEXT", nullable: false),
                    TokenSpent = table.Column<int>(type: "INTEGER", nullable: false),
                    IsEquipped = table.Column<bool>(type: "INTEGER", nullable: false),
                    AcquiredFrom = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false, defaultValue: "shop_purchase"),
                    AcquiredAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_inventory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_user_inventory_shop_items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "shop_items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_user_inventory_user_profiles_UserId",
                        column: x => x.UserId,
                        principalTable: "user_profiles",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_user_profiles_TokenBalance",
                table: "user_profiles",
                column: "TokenBalance");

            migrationBuilder.CreateIndex(
                name: "IX_avatar_configs_UserId",
                table: "avatar_configs",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_avatar_presets_UserId",
                table: "avatar_presets",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_avatar_presets_UserId_PresetIndex",
                table: "avatar_presets",
                columns: new[] { "UserId", "PresetIndex" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_shop_items_Category",
                table: "shop_items",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_shop_items_ItemCode",
                table: "shop_items",
                column: "ItemCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_shop_items_RarityTier",
                table: "shop_items",
                column: "RarityTier");

            migrationBuilder.CreateIndex(
                name: "IX_shop_items_TokenPrice",
                table: "shop_items",
                column: "TokenPrice");

            migrationBuilder.CreateIndex(
                name: "IX_token_transactions_CreatedAt",
                table: "token_transactions",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_token_transactions_UserId",
                table: "token_transactions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_user_inventory_ItemId",
                table: "user_inventory",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_user_inventory_UserId",
                table: "user_inventory",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_user_inventory_UserId_ItemId",
                table: "user_inventory",
                columns: new[] { "UserId", "ItemId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "avatar_configs");

            migrationBuilder.DropTable(
                name: "avatar_presets");

            migrationBuilder.DropTable(
                name: "token_transactions");

            migrationBuilder.DropTable(
                name: "user_inventory");

            migrationBuilder.DropTable(
                name: "shop_items");

            migrationBuilder.DropIndex(
                name: "IX_user_profiles_TokenBalance",
                table: "user_profiles");

            migrationBuilder.DropColumn(
                name: "ActivePresetSlot",
                table: "user_profiles");

            migrationBuilder.DropColumn(
                name: "Bio",
                table: "user_profiles");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "user_profiles");

            migrationBuilder.DropColumn(
                name: "CustomTitle",
                table: "user_profiles");

            migrationBuilder.DropColumn(
                name: "DailyTokensEarned",
                table: "user_profiles");

            migrationBuilder.DropColumn(
                name: "LastTokenResetAt",
                table: "user_profiles");

            migrationBuilder.DropColumn(
                name: "TokenBalance",
                table: "user_profiles");

            migrationBuilder.DropColumn(
                name: "TotalTokensEarned",
                table: "user_profiles");

            migrationBuilder.DropColumn(
                name: "UnlockedPresetSlots",
                table: "user_profiles");
        }
    }
}
