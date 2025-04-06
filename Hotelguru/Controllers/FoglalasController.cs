using HotelGuru.DataContext.Dtos;
using HotelGuru.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HotelGuru.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FoglalasController : ControllerBase
    {
        private readonly IFoglalasService _foglalasService;

        public FoglalasController(IFoglalasService foglalasService)
        {
            _foglalasService = foglalasService;
        }

        [HttpPost]
        public async Task<IActionResult> LetrehozFoglalas([FromBody] FoglalasCreateDto dto)
        {
            var foglalas = await _foglalasService.LetrehozFoglalasAsync(dto);
            return CreatedAtAction(nameof(GetFoglalas), new { id = foglalas.Id }, foglalas);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Lemondas(int id)
        {
            var result = await _foglalasService.LemondFoglalastAsync(id);
            return result ? NoContent() : NotFound();
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFoglalas()
        {
            var foglalasok = await _foglalasService.GetAllFoglalasAsync();
            return Ok(foglalasok);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFoglalas(int id)
        {
            var foglalas = await _foglalasService.GetFoglalasByIdAsync(id);
            return foglalas != null ? Ok(foglalas) : NotFound();
        }
    }
}
