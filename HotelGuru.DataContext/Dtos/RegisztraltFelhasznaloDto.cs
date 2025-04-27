using HotelGuru.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelGuru.DataContext.Dtos
{
    public class RegisztraltFelhasznaloDto 
    { 
        public int Id { get; set; } 
        public string Nev { get; set; } 
        public string Email { get; set; } 
        public string Lakcim { get; set; } 
        public string Telefonszam { get; set; } 
        public string Bankkartya { get; set; } 
    }
    public class RegisztralFelhasznaloDto
    {
        [Required]
        [StringLength(50)]
        public string Nev {  set; get; }
        [Required]
        [EmailAddress]
        public string Email { set; get; }
        [Required]
        public string Lakcim {  set; get; }
        [Required]
        public string Telefonszam { set; get; }
        public string Bankkartya {  set; get; }
        [Required]
        [MinLength(6)]
        public string Jelszo { set; get; }
        public szerep SzerepId { get; set; }
    }

    public class FelhasznaloLoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Jelszo { get; set; }
    }

    public class FelhasznaloUpdateDto
    {
        [Required]
        [StringLength(50)]
        public string Nev { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string Telefonszam { get; set; }

        public szerep SzerepIds { get; set; }
    }
}
