using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Entities
{
    public class Foglalas
    {
        public int FoglalasId { get; set; }
        public DateTime FoglalasIdopontja { get; set; }
        public int FoglaltSzobaID { get; set; }
        public bool HitelesBankkartya { get; set; }
        public void ExtraSzolgaltatas(string pluszSzolgaltatas) { }
    }
}
