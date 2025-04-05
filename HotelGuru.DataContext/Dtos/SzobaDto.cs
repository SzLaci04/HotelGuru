using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Dtos
{
    public class SzobaDto
    { 
        public int Id { get; set; } 
        public int AgyakSzama { get; set; } 
        public int EjszakaAr { get; set; } 
    }

    public class SzobaCreateDto
    {
        [Required]
        public int AgyakSzama { get; set; }
        [Required]
        public int EjszakaAr { get; set; }
    }
    public class SzobaUpdateDto
    {
        public int AgyakSzama { get; set; }
        public int EjszakaAr { get; set; }
    }
}
