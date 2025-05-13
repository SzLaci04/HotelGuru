using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Dtos
{
    public class FoglalasCreateDto
    {
        public DateTime FoglalasIdopontja { get; set; }
        public int FoglaltSzobaId { get; set; }
        public bool HitelesBankkartya { get; set; }

        public DateTime Erkezes { get; set; }
        public DateTime Tavozas { get; set; }
        public int FoSzam { get; set; }
        public int PluszSzolgId { get; set; }
    }
}
