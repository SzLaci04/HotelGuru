using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelGuru.Migrations
{
    /// <inheritdoc />
    public partial class szamlak : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SzamlaId",
                table: "Foglalasok",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Szamlak",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SzobaId = table.Column<int>(type: "int", nullable: false),
                    FelhasznaloId = table.Column<int>(type: "int", nullable: false),
                    PluszSzolgId = table.Column<int>(type: "int", nullable: false),
                    FoglalasId = table.Column<int>(type: "int", nullable: false),
                    VegsoAr = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Szamlak", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Szamlak");

            migrationBuilder.DropColumn(
                name: "SzamlaId",
                table: "Foglalasok");
        }
    }
}
