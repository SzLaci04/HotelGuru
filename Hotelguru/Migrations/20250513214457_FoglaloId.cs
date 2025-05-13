using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelGuru.Migrations
{
    /// <inheritdoc />
    public partial class FoglaloId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FoglaloId",
                table: "Foglalasok",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Foglalasok_FoglaloId",
                table: "Foglalasok",
                column: "FoglaloId");

            migrationBuilder.AddForeignKey(
                name: "FK_Foglalasok_Felhasznalok_FoglaloId",
                table: "Foglalasok",
                column: "FoglaloId",
                principalTable: "Felhasznalok",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Foglalasok_Felhasznalok_FoglaloId",
                table: "Foglalasok");

            migrationBuilder.DropIndex(
                name: "IX_Foglalasok_FoglaloId",
                table: "Foglalasok");

            migrationBuilder.DropColumn(
                name: "FoglaloId",
                table: "Foglalasok");
        }
    }
}
