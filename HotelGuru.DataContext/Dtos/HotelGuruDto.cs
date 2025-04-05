using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Dtos
{
    public class HotelGuruDto 
    { 
        public int ElerhetoSzobakSzama { get; set; }
        public int LefoglaltSzobakSzama { get; set; } 
        public List<SzobaDto> SzobakListaja { get; set; } 
    }
}
