using System;
using System.Threading.Tasks;
using HotelGuru.DataContext.Context;
using Microsoft.EntityFrameworkCore;

namespace HotelGuru.Services
{
    public interface IRecepciosService
    {
        Task<bool> VisszaigazolFoglalastAsync(int foglalasId);
        Task<bool> BeleptetVendegAsync(int foglalasId);
        Task<string> SzamlaKeszitesAsync(int foglalasId);
    }
    public class RecepciosService : IRecepciosService
    {
        private readonly AppDbContext _context;

        public RecepciosService(AppDbContext context)
        {
            _context = context;
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

        public async Task<string> SzamlaKeszitesAsync(int foglalasId)
        {
            var foglalas = await _context.Foglalasok.Include(f => f.Szoba).FirstOrDefaultAsync(f => f.Id == foglalasId);
            if (foglalas == null) return null;
            var pluszszolg = await _context.PluszSzolgaltatasok.FindAsync(foglalas.PluszSzolgId);
            var napok = (foglalas.Tavozas - foglalas.Erkezes).Days;
            var osszeg = pluszszolg.SzolgaltatasAra + (napok * foglalas.Szoba.EjszakaAr * (foglalas.FoSzam > 0 ? foglalas.FoSzam : 1));
            return $"Számla #{foglalas.Id} - Összeg: {osszeg} Ft, Szoba: {foglalas.Szoba.ID},Fő: {foglalas.FoSzam}, Dátum: {foglalas.Erkezes:yyyy.MM.dd} - {foglalas.Tavozas:yyyy.MM.dd}, Plusz szolgáltatás ára: {pluszszolg.SzolgaltatasAra}, ";
            ;
        }
    }
}
