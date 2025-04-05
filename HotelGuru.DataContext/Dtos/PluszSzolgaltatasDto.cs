using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Dtos
{
    public class PluszSzolgaltatasDto 
    { 
        public int Id { get; set; } 
        public string SzolgaltatasNeve { get; set; } 
        public string SzolgaltatasLeiras { get; set; } 
        public int SzolgaltatasAra { get; set; } 
    }
}
