using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnEnglish.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddWingsItemAndSlot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "WingsId",
                table: "avatar_configs",
                type: "TEXT",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WingsId",
                table: "avatar_configs");
        }
    }
}
