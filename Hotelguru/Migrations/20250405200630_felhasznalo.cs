using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelGuru.Migrations
{
    /// <inheritdoc />
    public partial class felhasznalo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "jelszo",
                table: "Felhasznalok",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "szerep",
                table: "Felhasznalok",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "jelszo",
                table: "Felhasznalok");

            migrationBuilder.DropColumn(
                name: "szerep",
                table: "Felhasznalok");
        }
    }
}
