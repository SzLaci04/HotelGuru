using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Dtos
{
    public class FoglalasUpdateDto 
    { 
        public DateTime? FoglalasIdopontja { get; set; }
        public int? FoglaltSzobaId { get; set; }
        public bool? HitelesBankkartya { get; set; }
    }
}
