using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Entities
{
    abstract class Felhasznalo
    {

        public int Id { get; set; }
        public string Nev { get; set; }
        public string Email { get; set; }
        public string Lakcim { get; set; }
        public int Telefonszam { get; set; }
        public int Bankkartya { get; set; }

        public void Bejelentkezes() { }
        public void Kijelentkezes() { }
    }
}
