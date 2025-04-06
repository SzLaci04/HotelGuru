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
    public interface IFelhasznaloService
    {
        Task<IEnumerable<RegisztraltFelhasznaloDto>> GetAllFelhasznaloAsync();
        Task<RegisztraltFelhasznaloDto> GetFelhasznaloByIdAsync(int id);
        Task<RegisztraltFelhasznaloDto> AddFelhasznaloAsync(RegisztraltFelhasznaloDto felhasznaloDto);
        Task<RegisztraltFelhasznaloDto> UpdateFelhasznaloAsync(int id, RegisztraltFelhasznaloDto felhasznaloDto);
        Task<bool> DeleteFelhasznaloAsync(int id);
        Task<RegisztraltFelhasznaloDto> BejelentkezesAsync(string email, string jelszo);
        Task<RegisztraltFelhasznaloDto> RegisztracioAsync(RegisztraltFelhasznaloDto felhasznaloDto);
        Task<bool> MegrendelesPluszSzolgaltatasAsync(int felhasznaloId, string szolgaltatasNev);
    }

    public class FelhasznaloService : IFelhasznaloService
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;

        public FelhasznaloService(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<IEnumerable<RegisztraltFelhasznaloDto>> GetAllFelhasznaloAsync()
        {
            var felhasznalok = await _dbContext.Felhasznalok.ToListAsync();
            return _mapper.Map<IEnumerable<RegisztraltFelhasznaloDto>>(felhasznalok);
        }

        public async Task<RegisztraltFelhasznaloDto> GetFelhasznaloByIdAsync(int id)
        {
            var felhasznalo = await _dbContext.Felhasznalok.FindAsync(id);
            if (felhasznalo == null)
                throw new KeyNotFoundException("Nincs ilyen ID-vel ellátott felhasználó.");

            return _mapper.Map<RegisztraltFelhasznaloDto>(felhasznalo);
        }

        public async Task<RegisztraltFelhasznaloDto> AddFelhasznaloAsync(RegisztraltFelhasznaloDto felhasznaloDto)
        {
            var felhasznalo = _mapper.Map<Felhasznalo>(felhasznaloDto);
            await _dbContext.Felhasznalok.AddAsync(felhasznalo);
            await _dbContext.SaveChangesAsync();
            return _mapper.Map<RegisztraltFelhasznaloDto>(felhasznalo);
        }

        public async Task<RegisztraltFelhasznaloDto> UpdateFelhasznaloAsync(int id, RegisztraltFelhasznaloDto felhasznaloDto)
        {
            var felhasznalo = await _dbContext.Felhasznalok.FindAsync(id);
            if (felhasznalo == null)
                throw new KeyNotFoundException("Nincs ilyen ID-vel ellátott felhasználó.");

            _mapper.Map(felhasznaloDto, felhasznalo);
            _dbContext.Felhasznalok.Update(felhasznalo);
            await _dbContext.SaveChangesAsync();
            return _mapper.Map<RegisztraltFelhasznaloDto>(felhasznalo);
        }

        public async Task<bool> DeleteFelhasznaloAsync(int id)
        {
            var felhasznalo = await _dbContext.Felhasznalok.FindAsync(id);
            if (felhasznalo == null)
                throw new KeyNotFoundException("Nincs ilyen ID-vel ellátott felhasználó.");

            _dbContext.Felhasznalok.Remove(felhasznalo);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<RegisztraltFelhasznaloDto> BejelentkezesAsync(string email, string jelszo)
        {
            var felhasznalo = await _dbContext.Felhasznalok.FirstOrDefaultAsync(f => f.Email == email && f.jelszo == jelszo);
            if (felhasznalo == null)
                throw new UnauthorizedAccessException("Hibás email vagy jelszó.");

            return _mapper.Map<RegisztraltFelhasznaloDto>(felhasznalo);
        }

        public async Task<RegisztraltFelhasznaloDto> RegisztracioAsync(RegisztraltFelhasznaloDto felhasznaloDto)
        {
            var letezo = await _dbContext.Felhasznalok.AnyAsync(f => f.Email == felhasznaloDto.Email);
            if (letezo)
                throw new InvalidOperationException("Már létezik felhasználó ezzel az email címmel.");

            var felhasznalo = _mapper.Map<Felhasznalo>(felhasznaloDto);
            felhasznalo.szerep = szerep.vendég;
            await _dbContext.Felhasznalok.AddAsync(felhasznalo);
            await _dbContext.SaveChangesAsync();
            return _mapper.Map<RegisztraltFelhasznaloDto>(felhasznalo);
        }

        public async Task<bool> MegrendelesPluszSzolgaltatasAsync(int felhasznaloId, string szolgaltatasNev)
        {
            var felhasznalo = await _dbContext.Felhasznalok.FindAsync(felhasznaloId);
            if (felhasznalo == null)
                throw new KeyNotFoundException("Felhasználó nem található a szolgáltatás megrendeléséhez.");

            // Itt a szolgáltatás hozzárendelése történne (pl. új tábla, reláció, vagy JSON mező bővítés)
            // Példa célból ezt itt csak logoljuk
            Console.WriteLine($"Szolgáltatás megrendelve: {szolgaltatasNev} a(z) {felhasznaloId} felhasználónak");
            return true;
        }
    }
}
