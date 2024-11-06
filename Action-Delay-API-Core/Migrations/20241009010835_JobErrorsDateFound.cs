using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Action_Delay_API_Core.Migrations
{
    /// <inheritdoc />
    public partial class JobErrorsDateFound : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "FirstSeen",
                table: "JobErrors",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FirstSeen",
                table: "JobErrors");
        }
    }
}
