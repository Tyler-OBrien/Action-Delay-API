using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Action_Delay_API_Core.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Jobs",
                columns: table => new
                {
                    JobName = table.Column<string>(type: "text", nullable: false),
                    LastRunTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastRunLengthMs = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    LastRunStatus = table.Column<string>(type: "text", nullable: true),
                    CurrentRunTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CurrentRunLengthMs = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    CurrentRunStatus = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Jobs", x => x.JobName);
                });

            migrationBuilder.CreateTable(
                name: "JobLocations",
                columns: table => new
                {
                    JobName = table.Column<string>(type: "text", nullable: false),
                    LocationName = table.Column<string>(type: "text", nullable: false),
                    LastRunTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastRunLengthMs = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    LastRunStatus = table.Column<string>(type: "text", nullable: true),
                    CurrentRunTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CurrentRunLengthMs = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    CurrentRunStatus = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobLocations", x => new { x.JobName, x.LocationName });
                    table.ForeignKey(
                        name: "FK_JobLocations_Jobs_JobName",
                        column: x => x.JobName,
                        principalTable: "Jobs",
                        principalColumn: "JobName",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobLocations");

            migrationBuilder.DropTable(
                name: "Jobs");
        }
    }
}
