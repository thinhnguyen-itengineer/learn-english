using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnEnglish.Api.Migrations
{
    /// <inheritdoc />
    public partial class Add3DChibiAvatarSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "avatar_items_3d",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", maxLength: 64, nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Slot = table.Column<string>(type: "TEXT", maxLength: 32, nullable: false),
                    Rarity = table.Column<string>(type: "TEXT", maxLength: 32, nullable: false, defaultValue: "COMMON"),
                    Gender = table.Column<string>(type: "TEXT", maxLength: 16, nullable: false, defaultValue: "UNISEX"),
                    ModelUrl = table.Column<string>(type: "TEXT", maxLength: 512, nullable: false),
                    ThumbnailUrl = table.Column<string>(type: "TEXT", maxLength: 512, nullable: false),
                    PriceTokens = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    LevelRequired = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 1),
                    BoneBindingRoot = table.Column<string>(type: "TEXT", maxLength: 64, nullable: false, defaultValue: "Hips"),
                    HideSlotsWhenEquipped = table.Column<string>(type: "TEXT", nullable: false),
                    MaskedBodyParts = table.Column<string>(type: "TEXT", nullable: false),
                    PolyCount = table.Column<int>(type: "INTEGER", nullable: false),
                    FileSizeBytes = table.Column<int>(type: "INTEGER", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_avatar_items_3d", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "avatar_presets_3d",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    PresetSlot = table.Column<int>(type: "INTEGER", nullable: false),
                    PresetName = table.Column<string>(type: "TEXT", maxLength: 64, nullable: false),
                    Config = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_avatar_presets_3d", x => x.Id);
                    table.ForeignKey(
                        name: "FK_avatar_presets_3d_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_avatar_equips_3d",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    BaseBodyId = table.Column<string>(type: "TEXT", nullable: false),
                    HairId = table.Column<string>(type: "TEXT", nullable: false),
                    TopId = table.Column<string>(type: "TEXT", nullable: false),
                    BottomId = table.Column<string>(type: "TEXT", nullable: false),
                    ShoesId = table.Column<string>(type: "TEXT", nullable: false),
                    AccessoryId = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_avatar_equips_3d", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_user_avatar_equips_3d_avatar_items_3d_AccessoryId",
                        column: x => x.AccessoryId,
                        principalTable: "avatar_items_3d",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_user_avatar_equips_3d_avatar_items_3d_BaseBodyId",
                        column: x => x.BaseBodyId,
                        principalTable: "avatar_items_3d",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_user_avatar_equips_3d_avatar_items_3d_BottomId",
                        column: x => x.BottomId,
                        principalTable: "avatar_items_3d",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_user_avatar_equips_3d_avatar_items_3d_HairId",
                        column: x => x.HairId,
                        principalTable: "avatar_items_3d",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_user_avatar_equips_3d_avatar_items_3d_ShoesId",
                        column: x => x.ShoesId,
                        principalTable: "avatar_items_3d",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_user_avatar_equips_3d_avatar_items_3d_TopId",
                        column: x => x.TopId,
                        principalTable: "avatar_items_3d",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_user_avatar_equips_3d_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_avatar_items_3d_Rarity",
                table: "avatar_items_3d",
                column: "Rarity");

            migrationBuilder.CreateIndex(
                name: "IX_avatar_items_3d_Slot",
                table: "avatar_items_3d",
                column: "Slot");

            migrationBuilder.CreateIndex(
                name: "IX_avatar_presets_3d_UserId",
                table: "avatar_presets_3d",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_avatar_presets_3d_UserId_PresetSlot",
                table: "avatar_presets_3d",
                columns: new[] { "UserId", "PresetSlot" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_user_avatar_equips_3d_AccessoryId",
                table: "user_avatar_equips_3d",
                column: "AccessoryId");

            migrationBuilder.CreateIndex(
                name: "IX_user_avatar_equips_3d_BaseBodyId",
                table: "user_avatar_equips_3d",
                column: "BaseBodyId");

            migrationBuilder.CreateIndex(
                name: "IX_user_avatar_equips_3d_BottomId",
                table: "user_avatar_equips_3d",
                column: "BottomId");

            migrationBuilder.CreateIndex(
                name: "IX_user_avatar_equips_3d_HairId",
                table: "user_avatar_equips_3d",
                column: "HairId");

            migrationBuilder.CreateIndex(
                name: "IX_user_avatar_equips_3d_ShoesId",
                table: "user_avatar_equips_3d",
                column: "ShoesId");

            migrationBuilder.CreateIndex(
                name: "IX_user_avatar_equips_3d_TopId",
                table: "user_avatar_equips_3d",
                column: "TopId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "avatar_presets_3d");

            migrationBuilder.DropTable(
                name: "user_avatar_equips_3d");

            migrationBuilder.DropTable(
                name: "avatar_items_3d");
        }
    }
}
