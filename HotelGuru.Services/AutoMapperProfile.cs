using AutoMapper;
using HotelGuru.DataContext.Dtos;
using HotelGuru.DataContext.Entities;

namespace HotelGuru.Services
{
    public class AutoMapperProfile:Profile
    {
        public AutoMapperProfile() 
        {
            //Szoba mapping
            CreateMap<Szoba,SzobaDto>().ReverseMap();
            CreateMap<SzobaCreateDto, Szoba>();
            CreateMap<SzobaUpdateDto, Szoba>();
        }
    }
}
