using HotelGuru.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace HotelGuru.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "recepciós,admin")] // Csak recepciós és admin férhet hozzá
    public class RecepciosController : ControllerBase
    {
        private readonly IRecepciosService _recepciosService;
        public RecepciosController(IRecepciosService recepciosService)
        {
            _recepciosService = recepciosService;
        }

        [HttpPost("{foglalasId}/visszaigazolas")]
        public async Task<IActionResult> Visszaigazolas(int foglalasId)
        {
            var result = await _recepciosService.VisszaigazolFoglalastAsync(foglalasId);
            return result ? Ok() : NotFound();
        }

        [HttpPost("{foglalasId}/beleptetes")]
        public async Task<IActionResult> Beleptetes(int foglalasId)
        {
            var result = await _recepciosService.BeleptetVendegAsync(foglalasId);
            return result ? Ok() : NotFound();
        }

        [HttpPost("{foglalasId}/szamla")]
        public async Task<IActionResult> SzamlaKeszites(int foglalasId)
        {
            var szamla = await _recepciosService.SzamlaKeszitesAsync(foglalasId);
            return szamla != null ? Ok(szamla) : NotFound();
        }
    }
}