using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Action_Delay_API_Core.Migrations
{
    /// <inheritdoc />
    public partial class FriendlyRegionName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FriendlyRegionName",
                table: "LocationData",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FriendlyRegionName",
                table: "ColoData",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FriendlyRegionName",
                table: "LocationData");

            migrationBuilder.DropColumn(
                name: "FriendlyRegionName",
                table: "ColoData");
        }
    }
}
