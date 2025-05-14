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
            //var foglalas = await _context.Foglalasok.Include(f => f.Szoba).FirstOrDefaultAsync(f => f.Id == foglalasId);
            //if (foglalas == null) return null;
            //var pluszszolg = await _context.PluszSzolgaltatasok.FindAsync(foglalas.PluszSzolgId);
            //var napok = (foglalas.Tavozas - foglalas.Erkezes).Days;
            //var osszeg = pluszszolg.SzolgaltatasAra + (napok * foglalas.Szoba.EjszakaAr * (foglalas.FoSzam > 0 ? foglalas.FoSzam : 1));
            //return $"Számla #{foglalas.Id} - Összeg: {osszeg} Ft, Szoba: {foglalas.Szoba.ID},Fő: {foglalas.FoSzam}, Dátum: {foglalas.Erkezes:yyyy.MM.dd} - {foglalas.Tavozas:yyyy.MM.dd}, Plusz szolgáltatás ára: {pluszszolg.SzolgaltatasAra}, ";
            var foglalas = await _context.Foglalasok.FirstOrDefaultAsync(f => f.Id == szamlaDto.FoglalasId);
            if (foglalas == null)
                return null;
            var szamla = _mapper.Map<Szamla>(szamlaDto);
            szamla.KiallitasDatum=DateTime.Now;
            var napok = (foglalas.Tavozas - foglalas.Erkezes).Days;
            var pluszszolg = await _context.PluszSzolgaltatasok.FirstOrDefaultAsync(f => f.ID == foglalas.Id);
            var szoba=await _context.Szobak.FirstOrDefaultAsync(f => f.ID==foglalas.SzobaId);
            szamla.VegsoAr = foglalas.FoSzam * napok * szoba.EjszakaAr+pluszszolg.SzolgaltatasAra;
            await _context.Szamlak.AddAsync(szamla);
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
