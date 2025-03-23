using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Entities
{
    public class Recepcios : Felhasznalo
    {
        public void SzamlaKiallitas(Foglalas foglalas) { }
        public void FoglalasVisszaigazolas(Foglalas foglalas) { }
        public void VendegCheckIn(Foglalas foglalas, RegisztraltFelhasznalo felhasznalo) { }
    }
}
