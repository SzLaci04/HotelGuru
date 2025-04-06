using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelGuru.Migrations
{
    /// <inheritdoc />
    public partial class FoglalasBovites : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Belepve",
                table: "Foglalasok",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "Erkezes",
                table: "Foglalasok",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "FoSzam",
                table: "Foglalasok",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SzobaId",
                table: "Foglalasok",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "Tavozas",
                table: "Foglalasok",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "Visszaigazolva",
                table: "Foglalasok",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Discriminator",
                table: "Felhasznalok",
                type: "nvarchar(21)",
                maxLength: 21,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(13)",
                oldMaxLength: 13);

            migrationBuilder.CreateIndex(
                name: "IX_Foglalasok_SzobaId",
                table: "Foglalasok",
                column: "SzobaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Foglalasok_Szobak_SzobaId",
                table: "Foglalasok",
                column: "SzobaId",
                principalTable: "Szobak",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Foglalasok_Szobak_SzobaId",
                table: "Foglalasok");

            migrationBuilder.DropIndex(
                name: "IX_Foglalasok_SzobaId",
                table: "Foglalasok");

            migrationBuilder.DropColumn(
                name: "Belepve",
                table: "Foglalasok");

            migrationBuilder.DropColumn(
                name: "Erkezes",
                table: "Foglalasok");

            migrationBuilder.DropColumn(
                name: "FoSzam",
                table: "Foglalasok");

            migrationBuilder.DropColumn(
                name: "SzobaId",
                table: "Foglalasok");

            migrationBuilder.DropColumn(
                name: "Tavozas",
                table: "Foglalasok");

            migrationBuilder.DropColumn(
                name: "Visszaigazolva",
                table: "Foglalasok");

            migrationBuilder.AlterColumn<string>(
                name: "Discriminator",
                table: "Felhasznalok",
                type: "nvarchar(13)",
                maxLength: 13,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(21)",
                oldMaxLength: 21);
        }
    }
}
