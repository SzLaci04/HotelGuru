using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelGuru.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Felhasznalok",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nev = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Lakcim = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telefonszam = table.Column<int>(type: "int", nullable: false),
                    Bankkartya = table.Column<int>(type: "int", nullable: false),
                    Discriminator = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Felhasznalok", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Foglalasok",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FoglalasIdopontja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FoglaltSzobaID = table.Column<int>(type: "int", nullable: false),
                    HitelesBankkartya = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Foglalasok", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PluszSzolgaltatasok",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SzolgaltatasNeve = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SzolgaltatasLeiras = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SzolgaltatasAra = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PluszSzolgaltatasok", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Szobak",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AgyakSzama = table.Column<int>(type: "int", nullable: false),
                    EjszakaAr = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Szobak", x => x.ID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Felhasznalok");

            migrationBuilder.DropTable(
                name: "Foglalasok");

            migrationBuilder.DropTable(
                name: "PluszSzolgaltatasok");

            migrationBuilder.DropTable(
                name: "Szobak");
        }
    }
}
