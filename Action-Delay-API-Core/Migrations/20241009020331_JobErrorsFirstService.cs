﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Action_Delay_API_Core.Migrations
{
    /// <inheritdoc />
    public partial class JobErrorsFirstService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FirstService",
                table: "JobErrors",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FirstService",
                table: "JobErrors");
        }
    }
}