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
    public class FoglalasSiker
    {
        public FoglalasDto _foglalasDto=null;
        public string statuszKod="";
    }

    public interface IFoglalasService
    {
        Task<FoglalasSiker> LetrehozFoglalasAsync(FoglalasCreateDto dto, int felhasznaloId);
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

        private bool haLefoglalva(Foglalas ezafoglalas,List<Foglalas> osszesFoglalas)
        {
            foreach (var fog in osszesFoglalas)
                if (ezafoglalas.SzobaId == fog.SzobaId&&!fog.Lemondva)
                    if (ezafoglalas.Erkezes<fog.Tavozas&&ezafoglalas.Tavozas>fog.Erkezes)
                        return true;
            return false;
        }
        
        public async Task<FoglalasSiker> LetrehozFoglalasAsync(FoglalasCreateDto dto,int felhasznaloId)
        {
            var eddigifoglalasok= await _context.Foglalasok.Where(f=>f.SzobaId==dto.FoglaltSzobaId).ToListAsync();
            
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

            if (szoba.Statusz != SzobaStatusz.Elérhető)
                return new FoglalasSiker { statuszKod="A szoba nem elérhető felújítás miatt!" };

            if (haLefoglalva(foglalas, eddigifoglalasok))
                return new FoglalasSiker { statuszKod = "A szoba erre az időpontra már le van foglalva!" };

            await _context.Foglalasok.AddAsync(foglalas);
            await _context.SaveChangesAsync();
                        
            return new FoglalasSiker {_foglalasDto=_mapper.Map<FoglalasDto>(foglalas), statuszKod="siker" };
        }

        public async Task<bool> LemondFoglalastAsync(int id)
        {
            var foglalas = await _context.Foglalasok.FindAsync(id);
            if (foglalas == null) return false;

            foglalas.Lemondva = true;
            _context.Foglalasok.Update(foglalas);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<FoglalasDto>> GetAllFoglalasAsync()
        {
            var foglalasok = await _context.Foglalasok.Where(f=>!f.Lemondva).ToListAsync();
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
