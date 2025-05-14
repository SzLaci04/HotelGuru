using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Entities
{
    public class Szamla
    {
        public int Id {  get; set; }
        public int FoglalasId {  get; set; }
        public int VegsoAr {  get; set; }
        public DateTime KiallitasDatum = DateTime.Now;
    }
}
