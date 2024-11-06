using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Action_Delay_API_Core.Migrations
{
    /// <inheritdoc />
    public partial class JobErrors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "JobErrors",
                columns: table => new
                {
                    ErrorHash = table.Column<string>(type: "text", nullable: false),
                    ErrorDescription = table.Column<string>(type: "text", nullable: false),
                    ErrorType = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobErrors", x => x.ErrorHash);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobErrors");
        }
    }
}
