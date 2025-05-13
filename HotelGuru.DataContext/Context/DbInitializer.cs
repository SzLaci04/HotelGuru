using BCrypt.Net;
using HotelGuru.DataContext.Context;
using HotelGuru.DataContext.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;

namespace HotelGuru.DataContext
{
    public static class DbInitializer
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new AppDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<AppDbContext>>()))
            {
                // Ellenőrizd, hogy az adatbázis létezik-e
                context.Database.Migrate();

                // Nézd meg, van-e már adat az adatbázisban
                if (context.Szobak.Any())
                {
                    return; // Az adatbázis már inicializálva van
                }

                // Szobák hozzáadása
                var szobak = new Szoba[]
                {
                    new Szoba { AgyakSzama = 1, EjszakaAr = 15000, Statusz = SzobaStatusz.Elérhető, Felszereltseg = "TV, WiFi, Fürdőszoba" },
                    new Szoba { AgyakSzama = 2, EjszakaAr = 25000, Statusz = SzobaStatusz.Elérhető, Felszereltseg = "TV, WiFi, Fürdőszoba, Minibár" },
                    new Szoba { AgyakSzama = 3, EjszakaAr = 35000, Statusz = SzobaStatusz.Elérhető, Felszereltseg = "TV, WiFi, Fürdőszoba, Minibár, Légkondicionáló" },
                    new Szoba { AgyakSzama = 2, EjszakaAr = 45000, Statusz = SzobaStatusz.Elérhető, Felszereltseg = "TV, WiFi, Fürdőszoba, Minibár, Kilátás" }
                };

                context.Szobak.AddRange(szobak);

                // Admin felhasználó létrehozása
                var admin = new Adminisztrator
                {
                    Nev = "Admin Felhasználó",
                    Email = "admin@hotelguru.hu",
                    Lakcim = "1234 Budapest, Példa utca 1.",
                    Telefonszam = "36701234567",
                    Bankkartya = "",
                    jelszo = BCrypt.Net.BCrypt.HashPassword("Admin123"),
                    szerep = szerep.admin
                };

                // Recepciós felhasználó létrehozása
                var recepcios = new Recepcios
                {
                    Nev = "Recepciós Felhasználó",
                    Email = "recepcio@hotelguru.hu",
                    Lakcim = "1234 Budapest, Példa utca 2.",
                    Telefonszam = "36702345678",
                    Bankkartya = "",
                    jelszo = BCrypt.Net.BCrypt.HashPassword("Recepcio123"),
                    szerep = szerep.recepciós
                };

                context.Adminisztratorok.Add(admin);
                context.Recepciosok.Add(recepcios);

                // Plusz szolgáltatások
                var szolgaltatasok = new PluszSzolgaltatas[]
                {
                    new PluszSzolgaltatas { SzolgaltatasNeve="Semmi", SzolgaltatasLeiras="Semmi", SzolgaltatasAra = 0 },
                    new PluszSzolgaltatas { SzolgaltatasNeve = "Reggeli", SzolgaltatasLeiras = "Svédasztalos reggeli 7-10 óra között", SzolgaltatasAra = 3000 },
                    new PluszSzolgaltatas { SzolgaltatasNeve = "Parkolás", SzolgaltatasLeiras = "Zárt parkoló használata", SzolgaltatasAra = 2000 },
                    new PluszSzolgaltatas { SzolgaltatasNeve = "Szauna", SzolgaltatasLeiras = "Szauna használat 2 óra", SzolgaltatasAra = 5000 }
                };

                context.PluszSzolgaltatasok.AddRange(szolgaltatasok);

                context.SaveChanges();
            }
        }
    }
}