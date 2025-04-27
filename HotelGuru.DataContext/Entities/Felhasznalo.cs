using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Entities
{
    public enum szerep
    {
        vendég,
        recepciós,
        admin
    }


    public class Felhasznalo
    {


        public int Id { get; set; }
        public string Nev { get; set; }
        public string Email { get; set; }
        public string Lakcim { get; set; }
        public string Telefonszam { get; set; }
        public string Bankkartya { get; set; }
        public string jelszo {  get; set; }

        public szerep szerep { get; set; }

        public void Bejelentkezes() { }
        public void Kijelentkezes() { }
    }
}
