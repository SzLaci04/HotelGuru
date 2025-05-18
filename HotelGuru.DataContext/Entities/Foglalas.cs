using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Entities
{
    public class Foglalas
    {
        public int Id { get; set; }
        public DateTime FoglalasIdopontja { get; set; }
        public int FoglaltSzobaID { get; set; }
        public bool HitelesBankkartya { get; set; }

        
        public DateTime Erkezes { get; set; }
        public DateTime Tavozas { get; set; }
        public int FoSzam { get; set; }
        public bool Visszaigazolva { get; set; } = false;
        public bool Belepve { get; set; } = false;
        public bool Lemondva {  get; set; } = false;

        public Szoba Szoba { get; set; }
        public int SzobaId { get; set; }


        public int PluszSzolgId { get; set; }

        public int FoglaloId { get; set; }
        public int? SzamlaId { get; set; } = null;
        public Felhasznalo Foglalo { get; set; }

        public void ExtraSzolgaltatas(string pluszSzolgaltatas) { }
    }
}