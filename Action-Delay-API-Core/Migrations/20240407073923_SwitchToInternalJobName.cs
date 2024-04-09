using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Action_Delay_API_Core.Migrations
{
    /// <inheritdoc />
    public partial class SwitchToInternalJobName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobLocations_Jobs_JobName",
                table: "JobLocations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Jobs",
                table: "Jobs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_JobLocations",
                table: "JobLocations");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Jobs",
                table: "Jobs",
                column: "InternalJobName");

            migrationBuilder.AddPrimaryKey(
                name: "PK_JobLocations",
                table: "JobLocations",
                columns: new[] { "InternalJobName", "LocationName" });

            migrationBuilder.AddForeignKey(
                name: "FK_JobLocations_Jobs_InternalJobName",
                table: "JobLocations",
                column: "InternalJobName",
                principalTable: "Jobs",
                principalColumn: "InternalJobName",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobLocations_Jobs_InternalJobName",
                table: "JobLocations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Jobs",
                table: "Jobs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_JobLocations",
                table: "JobLocations");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Jobs",
                table: "Jobs",
                column: "JobName");

            migrationBuilder.AddPrimaryKey(
                name: "PK_JobLocations",
                table: "JobLocations",
                columns: new[] { "JobName", "LocationName" });

            migrationBuilder.AddForeignKey(
                name: "FK_JobLocations_Jobs_JobName",
                table: "JobLocations",
                column: "JobName",
                principalTable: "Jobs",
                principalColumn: "JobName",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
