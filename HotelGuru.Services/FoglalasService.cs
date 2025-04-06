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
            var foglalas = _mapper.Map<Foglalas>(dto);
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
    }
}
