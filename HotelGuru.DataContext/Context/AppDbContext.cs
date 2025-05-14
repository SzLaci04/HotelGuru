using Microsoft.EntityFrameworkCore;
using HotelGuru.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Context
{
    public class AppDbContext : DbContext
    {
        public DbSet<Szoba> Szobak { get; set; }
        public DbSet<Recepcios> Recepciosok { get; set; }
        public DbSet<PluszSzolgaltatas> PluszSzolgaltatasok { get; set; }

        public DbSet<Felhasznalo> Felhasznalok { get; set; }
        public DbSet<Foglalas> Foglalasok {  get; set; }

        public DbSet<Adminisztrator> Adminisztratorok { get; set; }
        public DbSet<Szamla> Szamlak {  get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}
