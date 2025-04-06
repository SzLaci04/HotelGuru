using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using HotelGuru.DataContext.Context;
using HotelGuru.DataContext.Dtos;
using HotelGuru.DataContext.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelGuru.Services
{
    public interface IAdminisztratorService
    {
        Task<IEnumerable<AdminisztratorDto>> GetAllAsync();
        Task<AdminisztratorDto> GetByIdAsync(int id);
        Task<AdminisztratorDto> AddAsync(AdminisztratorCreateDto adminDto);
        Task<AdminisztratorDto> UpdateAsync(int id, AdminisztratorUpdateDto adminDto);
        Task<bool> DeleteAsync(int id);
    }

    public class AdminisztratorService : IAdminisztratorService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public AdminisztratorService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<AdminisztratorDto>> GetAllAsync()
        {
            var adminok = await _context.Adminisztratorok.ToListAsync();
            return _mapper.Map<IEnumerable<AdminisztratorDto>>(adminok);
        }

        public async Task<AdminisztratorDto> GetByIdAsync(int id)
        {
            var admin = await _context.Adminisztratorok.FindAsync(id);
            if (admin == null)
                throw new KeyNotFoundException("Nincs ilyen ID-jű adminisztrátor.");
            return _mapper.Map<AdminisztratorDto>(admin);
        }

        public async Task<AdminisztratorDto> AddAsync(AdminisztratorCreateDto adminDto)
        {
            var admin = _mapper.Map<Adminisztrator>(adminDto);
            await _context.Adminisztratorok.AddAsync(admin);
            await _context.SaveChangesAsync();
            return _mapper.Map<AdminisztratorDto>(admin);
        }

        public async Task<AdminisztratorDto> UpdateAsync(int id, AdminisztratorUpdateDto adminDto)
        {
            var admin = await _context.Adminisztratorok.FindAsync(id);
            if (admin == null)
                throw new KeyNotFoundException("Nincs ilyen ID-jű adminisztrátor.");

            _mapper.Map(adminDto, admin);
            _context.Adminisztratorok.Update(admin);
            await _context.SaveChangesAsync();

            return _mapper.Map<AdminisztratorDto>(admin);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var admin = await _context.Adminisztratorok.FindAsync(id);
            if (admin == null)
                throw new KeyNotFoundException("Nincs ilyen ID-jű adminisztrátor.");

            _context.Adminisztratorok.Remove(admin);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
