using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimplyRecipes.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddFacebookIdentifierLoginsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FacebookIdentifierLoginId",
                table: "AspNetUsers",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "FacebookIdentifierLogins",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FacebookIdentifier = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FacebookIdentifierLogins", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_FacebookIdentifierLoginId",
                table: "AspNetUsers",
                column: "FacebookIdentifierLoginId",
                unique: true,
                filter: "[FacebookIdentifierLoginId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_FacebookIdentifierLogins_IsDeleted",
                table: "FacebookIdentifierLogins",
                column: "IsDeleted");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_FacebookIdentifierLogins_FacebookIdentifierLoginId",
                table: "AspNetUsers",
                column: "FacebookIdentifierLoginId",
                principalTable: "FacebookIdentifierLogins",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_FacebookIdentifierLogins_FacebookIdentifierLoginId",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "FacebookIdentifierLogins");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_FacebookIdentifierLoginId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "FacebookIdentifierLoginId",
                table: "AspNetUsers");
        }
    }
}
