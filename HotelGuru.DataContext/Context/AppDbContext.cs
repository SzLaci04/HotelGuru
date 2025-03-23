using Microsoft.EntityFrameworkCore;
using HotelGuru.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Context
{
    internal class AppDbContext : DbContext
    {
        public Dbset<Szoba> Szobak { get; set; }
        public Dbset<Recepcios> Recepciosok { get; set; }
        public Dbset<PluszSzolgaltatas> PluszSzolgaltatasok { get; set; }

        public Dbset<Felhasznalo> Felhasznalok { get; set; }
        public Dbset<Foglalas> Foglalasok {  get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}
