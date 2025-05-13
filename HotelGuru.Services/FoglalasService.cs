using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using HotelGuru.DataContext.Context;
using HotelGuru.DataContext.Dtos;
using HotelGuru.DataContext.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelGuru.Services
{

    public interface IFoglalasService
    {
        Task<FoglalasDto> LetrehozFoglalasAsync(FoglalasCreateDto dto);
        Task<bool> LemondFoglalastAsync(int id);
        Task<IEnumerable<FoglalasDto>> GetAllFoglalasAsync();
        Task<FoglalasDto> GetFoglalasByIdAsync(int id);
        Task<IEnumerable<FoglalasDto>> GetFoglalasokByFelhasznaloIdAsync(int felhasznaloId);
    }
    public class FoglalasService : IFoglalasService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public FoglalasService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<FoglalasDto> LetrehozFoglalasAsync(FoglalasCreateDto dto)
        {
            // Ellenőrizzük, hogy a szoba létezik-e
            var szoba = await _context.Szobak.FindAsync(dto.FoglaltSzobaId);
            if (szoba == null)
                throw new KeyNotFoundException($"A {dto.FoglaltSzobaId} ID-val rendelkező szoba nem található.");

            // Ellenőrizzük, hogy a felhasználó létezik-e
            var felhasznalo = await _context.Felhasznalok.FindAsync(dto.FoglaloId);
            if (felhasznalo == null)
                throw new KeyNotFoundException($"A {dto.FoglaloId} ID-val rendelkező felhasználó nem található.");

            // Itt használhatod az AutoMapper-t, de manuálisan be kell állítanod a SzobaId-t
            var foglalas = _mapper.Map<Foglalas>(dto);

            // Fontos: a SzobaId-t is be kell állítani a FoglaltSzobaId alapján
            foglalas.SzobaId = dto.FoglaltSzobaId;
            foglalas.FoglaloId = dto.FoglaloId;

            // A FoglalasIdopontja-t is beállítjuk, ha a DTO-ban nem volt megadva
            if (foglalas.FoglalasIdopontja == default)
                foglalas.FoglalasIdopontja = DateTime.Now;

            await _context.Foglalasok.AddAsync(foglalas);
            await _context.SaveChangesAsync();

            // Itt is használhatod az AutoMapper-t
            return _mapper.Map<FoglalasDto>(foglalas);
        }

        public async Task<bool> LemondFoglalastAsync(int id)
        {
            var foglalas = await _context.Foglalasok.FindAsync(id);
            if (foglalas == null) return false;

            _context.Foglalasok.Remove(foglalas);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<FoglalasDto>> GetAllFoglalasAsync()
        {
            var foglalasok = await _context.Foglalasok.ToListAsync();
            return _mapper.Map<IEnumerable<FoglalasDto>>(foglalasok);
        }

        public async Task<FoglalasDto> GetFoglalasByIdAsync(int id)
        {
            var foglalas = await _context.Foglalasok.FindAsync(id);
            return foglalas == null ? null : _mapper.Map<FoglalasDto>(foglalas);
        }

        public async Task<IEnumerable<FoglalasDto>> GetFoglalasokByFelhasznaloIdAsync(int felhasznaloId)
        {
            var foglalasok = await _context.Foglalasok
                .Include(f => f.Szoba)
                .Include(f => f.Foglalo)
                .Where(f => f.FoglaloId == felhasznaloId)
                .ToListAsync();
            return _mapper.Map<IEnumerable<FoglalasDto>>(foglalasok);
        }
    }
}
