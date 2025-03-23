using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Entities
{
    public class HotelGuru
    {
            public int ElerhetoSzobakSzama { get; set; }
            public int LefoglaltSzobakSzama { get; set; }
            public List<Szoba> SzobakListaja { get; set; } = new List<Szoba>();

            public void ElerhetoSzobakListazasa() { }
            public void OsszesSzobaListazasa() { }
    }
}
