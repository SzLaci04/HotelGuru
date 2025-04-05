using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Entities
{
    public enum SzobaStatusz
    {
        Elérhető,
        Foglalt,
        Felújítás_alatt
    }
    public class Szoba
    {
            public int ID { get; set; }
            public int AgyakSzama { get; set; }
            public int EjszakaAr { get; set; }
            public SzobaStatusz Statusz { get; set; }
            public string Felszereltseg { get; set; }
    }
}
