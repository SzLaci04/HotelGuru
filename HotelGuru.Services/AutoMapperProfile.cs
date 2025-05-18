using AutoMapper;
using HotelGuru.DataContext.Dtos;
using HotelGuru.DataContext.Entities;

namespace HotelGuru.Services
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            //Szoba mapping
            CreateMap<Szoba, SzobaDto>().ReverseMap();
            CreateMap<SzobaCreateDto, Szoba>();
            CreateMap<SzobaUpdateDto, Szoba>();

            //Adminisztrátor mapping
            CreateMap<Adminisztrator, AdminisztratorDto>().ReverseMap();
            CreateMap<AdminisztratorCreateDto, Adminisztrator>();
            CreateMap<AdminisztratorUpdateDto, Adminisztrator>();

            //Felhasználó mapping
            CreateMap<Felhasznalo, RegisztraltFelhasznaloDto>().ReverseMap();
            CreateMap<RegisztralFelhasznaloDto, Felhasznalo>();
            CreateMap<FelhasznaloUpdateDto, Felhasznalo>();
            CreateMap<RegisztralFelhasznaloDto, RegisztraltFelhasznaloDto>();
            CreateMap<FelhasznaloLoginDto, Felhasznalo>();
            //HOZZÁADATAM SZEREP MIATT - FelhasznaloAdmin.js miatt
            CreateMap<Felhasznalo, RegisztraltFelhasznaloDto>()
                .ForMember(dest => dest.Szerep, opt => opt.MapFrom(src => src.szerep));

            //Foglalás mapping
            CreateMap<Foglalas, FoglalasDto>().ReverseMap();
            CreateMap<FoglalasCreateDto, Foglalas>()
                .ForMember(dest => dest.SzobaId, opt => opt.MapFrom(src => src.FoglaltSzobaId));
            CreateMap<PluszSzolgaltatas, PluszSzolgaltatasDto>().ReverseMap();

            CreateMap<Foglalas, FoglalasDto>()
            .ReverseMap();
            CreateMap<FoglalasCreateDto, Foglalas>()
                .ForMember(dest => dest.SzobaId, opt => opt.MapFrom(src => src.FoglaltSzobaId));
            CreateMap<Szamla, SzamlaDto>().ReverseMap();
            CreateMap<SzamlaCreateDto, Szamla>();
        }
    }
}
