using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Dtos
{
    public class AdminisztratorCreateDto
    {
        public string Nev { get; set; }
        public string Email { get; set; }
        public string Lakcim { get; set; }
        public int Telefonszam { get; set; }
    }
}


