using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Entities
{
    public class Foglalasok
    {
        private List<Foglalas> Foglalasok_Lista{ get; set; }
        public int FoglalasokDarabszam { get; set; }
        public bool SzobaFoglalas(Szoba szoba, RegisztraltFelhasznalo felhasznalo) { return true; }
        public bool SzobaLemondas(Szoba szoba) { return true; }
    }
}
