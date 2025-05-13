using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using HotelGuru.DataContext.Context;
using HotelGuru.DataContext.Dtos;
using HotelGuru.DataContext.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelGuru.Services
{
    public interface ISzobaService
    {
        Task<IEnumerable<SzobaDto>> GetAllSzobaAsync();
        Task<SzobaDto> GetSzobaByIdAsync(int id);
        Task<IEnumerable<SzobaDto>> GetAvailableSzobakAsync();
        Task<SzobaDto> AddSzobaAsync(SzobaCreateDto szobaDto);
        Task<SzobaDto> UpdateSzobaAsync(int id, SzobaUpdateDto szobaDto);
        Task<bool> DeleteSzobaAsync(int id);
        Task<IEnumerable<PluszSzolgaltatasDto>> GetAllPluszSzolgAsync();
    }
    public class SzobaService : ISzobaService
    {
        public AppDbContext dbContext;
        private readonly IMapper _mapper;

        public SzobaService(AppDbContext context, IMapper mapper)
        {
            dbContext = context;
            _mapper = mapper;
        }
        public async Task<IEnumerable<SzobaDto>> GetAllSzobaAsync()
        {
            var szobak = await dbContext.Szobak.ToListAsync();

            return _mapper.Map<IEnumerable<SzobaDto>>(szobak);
        }
        public async Task<SzobaDto> GetSzobaByIdAsync(int id)
        {
            var szoba = await dbContext.Szobak.FindAsync(id);
            if (szoba == null)
            {
                throw new KeyNotFoundException("Nincs ilyen id-vel ellátott szoba!.");
            }
            return _mapper.Map<SzobaDto>(szoba);
        }

        public async Task<SzobaDto> AddSzobaAsync(SzobaCreateDto szobaDto)
        {
            var szoba = _mapper.Map<Szoba>(szobaDto);
            await dbContext.Szobak.AddAsync(szoba);
            await dbContext.SaveChangesAsync();
            return _mapper.Map<SzobaDto>(szoba);
        }

        public async Task<SzobaDto> UpdateSzobaAsync(int id, SzobaUpdateDto szobaDto)
        {
            var szoba = await dbContext.Szobak.FindAsync(id);
            if (szoba == null)
            {
                throw new KeyNotFoundException("Nincs ilyen id-vel ellátott szoba!.");
            }

            _mapper.Map(szobaDto, szoba);
            dbContext.Szobak.Update(szoba);
            await dbContext.SaveChangesAsync();

            return _mapper.Map<SzobaDto>(szoba);
        }

        public async Task<bool> DeleteSzobaAsync(int id)
        {
            var szoba = await dbContext.Szobak.FindAsync(id);
            if (szoba == null)
            {
                throw new KeyNotFoundException("Nincs ilyen id-vel ellátott szoba!.");
            }
            dbContext.Szobak.Remove(szoba);
            await dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<SzobaDto>> GetAvailableSzobakAsync()
        {
            var szobak = await dbContext.Szobak.Where(s => s.Statusz == SzobaStatusz.Elérhető).ToListAsync();
            return _mapper.Map<IEnumerable<SzobaDto>>(szobak);
        }

        public async Task<IEnumerable<PluszSzolgaltatasDto>> GetAllPluszSzolgAsync()
        {
            var plusszolg = await dbContext.PluszSzolgaltatasok.ToListAsync();
            return _mapper.Map<IEnumerable<PluszSzolgaltatasDto>>(plusszolg);
        }
    }
}
