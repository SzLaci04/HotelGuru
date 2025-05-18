using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelGuru.Migrations
{
    /// <inheritdoc />
    public partial class lemondas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Lemondva",
                table: "Foglalasok",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Lemondva",
                table: "Foglalasok");
        }
    }
}
