using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Action_Delay_API_Core.Migrations
{
    /// <inheritdoc />
    public partial class LocationColoData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ColoData",
                columns: table => new
                {
                    ColoId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IATA = table.Column<string>(type: "text", nullable: false),
                    FriendlyName = table.Column<string>(type: "text", nullable: false),
                    Country = table.Column<string>(type: "text", nullable: false),
                    Latitude = table.Column<double>(type: "double precision", nullable: false),
                    Longitude = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ColoData", x => x.ColoId);
                });

            migrationBuilder.CreateTable(
                name: "LocationData",
                columns: table => new
                {
                    LocationName = table.Column<string>(type: "text", nullable: false),
                    FriendlyLocationName = table.Column<string>(type: "text", nullable: false),
                    LocationLatitude = table.Column<double>(type: "double precision", nullable: false),
                    LocationLongitude = table.Column<double>(type: "double precision", nullable: false),
                    ColoId = table.Column<int>(type: "integer", nullable: false),
                    IATA = table.Column<string>(type: "text", nullable: false),
                    LastUpdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastChange = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Enabled = table.Column<bool>(type: "boolean", nullable: false),
                    ColoLatitude = table.Column<double>(type: "double precision", nullable: false),
                    ColoLongitude = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocationData", x => x.LocationName);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ColoData");

            migrationBuilder.DropTable(
                name: "LocationData");
        }
    }
}
