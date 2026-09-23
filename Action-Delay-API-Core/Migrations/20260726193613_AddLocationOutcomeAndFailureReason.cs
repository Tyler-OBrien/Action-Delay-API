using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Action_Delay_API_Core.Migrations
{
    /// <inheritdoc />
    public partial class AddLocationOutcomeAndFailureReason : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FailureReason",
                table: "JobLocations",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Outcome",
                table: "JobLocations",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FailureReason",
                table: "JobLocations");

            migrationBuilder.DropColumn(
                name: "Outcome",
                table: "JobLocations");
        }
    }
}
