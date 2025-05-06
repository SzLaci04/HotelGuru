using HotelGuru.DataContext.Entities;

namespace HotelGuru.Services
{
    public interface IJwtService
    {
        string GenerateToken(Felhasznalo felhasznalo);
    }
}