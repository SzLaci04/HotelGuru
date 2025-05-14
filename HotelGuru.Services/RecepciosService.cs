using System;
using System.Threading.Tasks;
using HotelGuru.DataContext.Context;
using HotelGuru.DataContext.Dtos;
using HotelGuru.DataContext.Entities;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace HotelGuru.Services
{
    public interface IRecepciosService
    {
        Task<bool> VisszaigazolFoglalastAsync(int foglalasId);
        Task<bool> BeleptetVendegAsync(int foglalasId);
        Task<SzamlaDto> SzamlaKeszitesAsync(SzamlaCreateDto szamla);
        Task<IEnumerable<SzamlaDto>> GetAllSzamlaAsync();
    }
    public class RecepciosService : IRecepciosService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public RecepciosService(AppDbContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<bool> VisszaigazolFoglalastAsync(int foglalasId)
        {
            var foglalas = await _context.Foglalasok.FindAsync(foglalasId);
            if (foglalas == null) return false;

            foglalas.Visszaigazolva = true;
            _context.Foglalasok.Update(foglalas);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> BeleptetVendegAsync(int foglalasId)
        {
            var foglalas = await _context.Foglalasok.FindAsync(foglalasId);
            if (foglalas == null || !foglalas.Visszaigazolva) return false;

            foglalas.Belepve = true;
            _context.Foglalasok.Update(foglalas);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<SzamlaDto> SzamlaKeszitesAsync(SzamlaCreateDto szamlaDto)
        {
            var foglalas = await _context.Foglalasok.FirstOrDefaultAsync(f => f.Id == szamlaDto.FoglalasId);
            if (foglalas == null)
                return null;

            var szamla = _mapper.Map<Szamla>(szamlaDto);
            szamla.KiallitasDatum = DateTime.Now;

            // Napok számának kiszámítása
            var napok = Math.Max(1, (foglalas.Tavozas - foglalas.Erkezes).Days);

            // A helyes PluszSzolgId használata és null-ellenőrzés 
            var pluszszolg = await _context.PluszSzolgaltatasok.FirstOrDefaultAsync(f => f.ID == foglalas.PluszSzolgId);
            if (pluszszolg == null)
            {
                // Ha nincs meg a plusz szolgáltatás, használjunk egy alapértelmezett árat (0)
                pluszszolg = new PluszSzolgaltatas { SzolgaltatasAra = 0 };
            }

            // A helyes SzobaId használata és null-ellenőrzés
            var szoba = await _context.Szobak.FirstOrDefaultAsync(f => f.ID == foglalas.SzobaId);
            if (szoba == null)
            {
                // Ha nincs meg a szoba, nem tudunk számlát készíteni
                return null;
            }

            // Végösszeg kiszámítása
            szamla.VegsoAr = foglalas.FoSzam * napok * szoba.EjszakaAr + pluszszolg.SzolgaltatasAra;

            await _context.Szamlak.AddAsync(szamla);
            await _context.SaveChangesAsync();

            // Frissítsük a foglalást, hogy tartalmazzon hivatkozást a számlára
            foglalas.SzamlaId = szamla.Id;
            _context.Foglalasok.Update(foglalas);
            await _context.SaveChangesAsync();

            return _mapper.Map<SzamlaDto>(szamla);
        }

        public async Task<IEnumerable<SzamlaDto>> GetAllSzamlaAsync()
        {
           var szamlak=await _context.Szamlak.ToListAsync();
           return _mapper.Map<IEnumerable<SzamlaDto>>(szamlak);
        }
    }
}
