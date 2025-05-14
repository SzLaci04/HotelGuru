using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelGuru.Migrations
{
    /// <inheritdoc />
    public partial class szamla3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FelhasznaloId",
                table: "Szamlak");

            migrationBuilder.DropColumn(
                name: "PluszSzolgId",
                table: "Szamlak");

            migrationBuilder.DropColumn(
                name: "SzobaId",
                table: "Szamlak");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FelhasznaloId",
                table: "Szamlak",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PluszSzolgId",
                table: "Szamlak",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SzobaId",
                table: "Szamlak",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
