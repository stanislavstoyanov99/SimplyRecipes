using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimplyRecipes.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSearchTextToArticleModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SearchText",
                table: "Articles",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SearchText",
                table: "Articles");
        }
    }
}
