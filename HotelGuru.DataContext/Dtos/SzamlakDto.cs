using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Dtos
{
    public class SzamlaCreateDto
    {
       
        public int FoglalasId {  get; set; }
    }

    public class SzamlaDto
    {
        public int Id { get; set; }
        public int VegsoAr { get; set; }
        public int FoglalasId { get; set; }
        public DateTime KiallitasDatum { get; set; }
    }
}
