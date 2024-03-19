using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Action_Delay_API_Core.Migrations
{
    /// <inheritdoc />
    public partial class InternalJobName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "InternalJobName",
                table: "Jobs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "InternalJobName",
                table: "JobLocations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Jobs_InternalJobName",
                table: "Jobs",
                column: "InternalJobName");

            migrationBuilder.CreateIndex(
                name: "IX_JobLocations_InternalJobName",
                table: "JobLocations",
                column: "InternalJobName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Jobs_InternalJobName",
                table: "Jobs");

            migrationBuilder.DropIndex(
                name: "IX_JobLocations_InternalJobName",
                table: "JobLocations");

            migrationBuilder.DropColumn(
                name: "InternalJobName",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "InternalJobName",
                table: "JobLocations");
        }
    }
}
