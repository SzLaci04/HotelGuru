using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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
        Task<FoglalasDto> LetrehozFoglalasAsync(FoglalasCreateDto dto, int felhasznaloId);
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

        public async Task<FoglalasDto> LetrehozFoglalasAsync(FoglalasCreateDto dto,int felhasznaloId)
        {
            
            var szoba = await _context.Szobak.FindAsync(dto.FoglaltSzobaId);
            if (szoba == null)
                throw new KeyNotFoundException($"A {dto.FoglaltSzobaId} ID-val rendelkező szoba nem található.");
            
            var felhasznalo = await _context.Felhasznalok.FindAsync(felhasznaloId);
            if (felhasznalo == null)
                throw new KeyNotFoundException($"A {felhasznalo.Id} ID-val rendelkező felhasználó nem található.");

            
            var foglalas = _mapper.Map<Foglalas>(dto);

            
            foglalas.SzobaId = dto.FoglaltSzobaId;
            foglalas.FoglaloId = felhasznalo.Id;

            
            if (foglalas.FoglalasIdopontja == default)
                foglalas.FoglalasIdopontja = DateTime.Now;

            await _context.Foglalasok.AddAsync(foglalas);
            await _context.SaveChangesAsync();

            
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
