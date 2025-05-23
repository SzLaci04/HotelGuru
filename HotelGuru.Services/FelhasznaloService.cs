﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BCrypt.Net;
using HotelGuru.DataContext.Context;
using HotelGuru.DataContext.Dtos;
using HotelGuru.DataContext.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace HotelGuru.Services
{
    public interface IFelhasznaloService
    {
        Task<IEnumerable<RegisztraltFelhasznaloDto>> GetAllFelhasznaloAsync();
        Task<RegisztraltFelhasznaloDto> GetFelhasznaloByIdAsync(int id);
        Task<RegisztraltFelhasznaloDto> AddFelhasznaloAsync(RegisztraltFelhasznaloDto felhasznaloDto);
        Task<RegisztraltFelhasznaloDto> UpdateFelhasznaloAsync(int id, FelhasznaloUpdateDto felhasznaloDto);
        Task<bool> DeleteFelhasznaloAsync(int id);
        Task<string> BejelentkezesAsync(FelhasznaloLoginDto felhasznaloLoginDto);
        Task<RegisztraltFelhasznaloDto> RegisztracioAsync(RegisztralFelhasznaloDto felhasznaloDto);
        Task<bool> MegrendelesPluszSzolgaltatasAsync(int felhasznaloId, string szolgaltatasNev);
        Task<IEnumerable<SzamlaDto>> GetSajatSzamlak(int felhasznaloId);
    }

    public class FelhasznaloService : IFelhasznaloService
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IJwtService _jwtService; 

        public FelhasznaloService(AppDbContext dbContext, IMapper mapper, IJwtService jwtService)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _jwtService = jwtService; 
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

        public async Task<RegisztraltFelhasznaloDto> UpdateFelhasznaloAsync(int id, FelhasznaloUpdateDto felhasznaloDto)
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

        public async Task<string> BejelentkezesAsync(FelhasznaloLoginDto felhasznaloLoginDto)
        {
            var user = await _dbContext.Felhasznalok.FirstOrDefaultAsync(f => f.Email == felhasznaloLoginDto.Email);

            
            if (user == null || !BCrypt.Net.BCrypt.Verify(felhasznaloLoginDto.Jelszo, user.jelszo))
                throw new UnauthorizedAccessException("Hibás email vagy jelszó.");

           
            return _jwtService.GenerateToken(user);
        }

        public async Task<RegisztraltFelhasznaloDto> RegisztracioAsync(RegisztralFelhasznaloDto felhasznaloDto)
        {
            var letezo = await _dbContext.Felhasznalok.AnyAsync(f => f.Email == felhasznaloDto.Email);
            if (letezo)
                throw new InvalidOperationException("Már létezik felhasználó ezzel az email címmel.");

            var felhasznalo = _mapper.Map<Felhasznalo>(felhasznaloDto);
            felhasznalo.jelszo = BCrypt.Net.BCrypt.HashPassword(felhasznalo.jelszo);

            
            if (felhasznaloDto.SzerepId == 0)
                felhasznalo.szerep = szerep.vendég;
            else
                felhasznalo.szerep = (szerep)felhasznaloDto.SzerepId;

            await _dbContext.Felhasznalok.AddAsync(felhasznalo);
            await _dbContext.SaveChangesAsync();
            return _mapper.Map<RegisztraltFelhasznaloDto>(felhasznalo);
        }

        public async Task<bool> MegrendelesPluszSzolgaltatasAsync(int felhasznaloId, string szolgaltatasNev)
        {
            var felhasznalo = await _dbContext.Felhasznalok.FindAsync(felhasznaloId);
            if (felhasznalo == null)
                throw new KeyNotFoundException("Felhasználó nem található a szolgáltatás megrendeléséhez.");

            
            Console.WriteLine($"Szolgáltatás megrendelve: {szolgaltatasNev} a(z) {felhasznaloId} felhasználónak");
            return true;
        }

        public async Task<IEnumerable<SzamlaDto>> GetSajatSzamlak(int felhasznaloId)
        {

            var foglalasok = await _dbContext.Foglalasok.Where(f=>f.FoglaloId==felhasznaloId).ToListAsync();
            List<Szamla> szamlak = new List<Szamla>();
            foreach (var fogl in foglalasok)
            {
                szamlak.Add(await _dbContext.Szamlak.FirstOrDefaultAsync(sz=>sz.FoglalasId==fogl.Id));
            }
            return szamlak!=null?_mapper.Map<IEnumerable<SzamlaDto>>(szamlak) : null;
        }

        
    }
}