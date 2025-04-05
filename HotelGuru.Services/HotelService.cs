using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HotelGuru.DataContext.Context;

namespace HotelGuru.Services
{
    public interface IHotelService
    {
        Task<int> Create();
    }
    internal class HotelService:IHotelService
    {
        public AppDbContext dbContext;

        public Task<int> Create()
        {
            throw new NotImplementedException();
        }
    }
}
