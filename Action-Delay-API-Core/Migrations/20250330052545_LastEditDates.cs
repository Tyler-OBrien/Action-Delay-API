using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Action_Delay_API_Core.Migrations
{
    /// <inheritdoc />
    public partial class LastEditDates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastEditDate",
                table: "MetalData",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "NOW()");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastEditDate",
                table: "LocationData",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "NOW()");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastEditDate",
                table: "Jobs",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "NOW()");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastEditDate",
                table: "JobLocations",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "NOW()");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastEditDate",
                table: "JobErrors",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "NOW()");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastEditDate",
                table: "JobData",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "NOW()");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastEditDate",
                table: "ColoData",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "NOW()");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastEditDate",
                table: "MetalData");

            migrationBuilder.DropColumn(
                name: "LastEditDate",
                table: "LocationData");

            migrationBuilder.DropColumn(
                name: "LastEditDate",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "LastEditDate",
                table: "JobLocations");

            migrationBuilder.DropColumn(
                name: "LastEditDate",
                table: "JobErrors");

            migrationBuilder.DropColumn(
                name: "LastEditDate",
                table: "JobData");

            migrationBuilder.DropColumn(
                name: "LastEditDate",
                table: "ColoData");
        }
    }
}
