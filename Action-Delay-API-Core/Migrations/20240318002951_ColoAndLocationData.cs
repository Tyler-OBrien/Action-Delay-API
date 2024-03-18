using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Action_Delay_API_Core.Migrations
{
    /// <inheritdoc />
    public partial class ColoAndLocationData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ASN",
                table: "LocationData",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "CfLatency",
                table: "LocationData",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "ColoFriendlyLocationName",
                table: "LocationData",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PathToCF",
                table: "LocationData",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Provider",
                table: "LocationData",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CfRegionDo",
                table: "ColoData",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CfRegionLb",
                table: "ColoData",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ASN",
                table: "LocationData");

            migrationBuilder.DropColumn(
                name: "CfLatency",
                table: "LocationData");

            migrationBuilder.DropColumn(
                name: "ColoFriendlyLocationName",
                table: "LocationData");

            migrationBuilder.DropColumn(
                name: "PathToCF",
                table: "LocationData");

            migrationBuilder.DropColumn(
                name: "Provider",
                table: "LocationData");

            migrationBuilder.DropColumn(
                name: "CfRegionDo",
                table: "ColoData");

            migrationBuilder.DropColumn(
                name: "CfRegionLb",
                table: "ColoData");
        }
    }
}
