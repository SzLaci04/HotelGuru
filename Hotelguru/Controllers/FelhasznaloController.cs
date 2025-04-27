using HotelGuru.DataContext.Dtos;
using HotelGuru.DataContext.Entities;
using HotelGuru.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HotelGuru.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FelhasznaloController : ControllerBase
    {
        private readonly IFelhasznaloService _felhasznaloService;

        public FelhasznaloController(IFelhasznaloService felhasznaloService)
        {
            _felhasznaloService = felhasznaloService;
        }

        /// <summary>
        /// Összes regisztrált felhasználó lekérése
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllFelhasznalo()
        {
            var felhasznalok = await _felhasznaloService.GetAllFelhasznaloAsync();
            return Ok(felhasznalok);
        }

        /// <summary>
        /// Egy adott felhasználó lekérése azonosító alapján
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFelhasznalo(int id)
        {
            var felhasznalo = await _felhasznaloService.GetFelhasznaloByIdAsync(id);
            if (felhasznalo == null)
                return NotFound();
            return Ok(felhasznalo);
        }

        /// <summary>
        /// Új felhasználó regisztrációja
        /// </summary>
        [HttpPost("regisztral")]
        public async Task<IActionResult> RegisztrcioFelhasznalo([FromBody] RegisztralFelhasznaloDto felhasznaloDto)
        {
            var felhasznalo = await _felhasznaloService.RegisztracioAsync(felhasznaloDto);
            return CreatedAtAction(nameof(GetFelhasznalo), new { id = felhasznalo.Id }, felhasznalo);
        }

        [HttpPost("bejelentkez")]
        public async Task<IActionResult> Bejelentkezes([FromBody] FelhasznaloLoginDto felhasznaloLoginDto)
        {
            var token = await _felhasznaloService.BejelentkezesAsync(felhasznaloLoginDto);
            return Ok(token);
        }

        /// <summary>
        /// Felhasználó adatainak frissítése
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFelhasznalo(int id, [FromBody] RegisztraltFelhasznaloDto felhasznaloDto)
        {
            var felhasznalo = await _felhasznaloService.UpdateFelhasznaloAsync(id, felhasznaloDto);
            if (felhasznalo == null)
                return NotFound();
            return Ok(felhasznalo);
        }

        /// <summary>
        /// Felhasználó törlése
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFelhasznalo(int id)
        {
            var result = await _felhasznaloService.DeleteFelhasznaloAsync(id);
            if (!result)
                return NotFound();
            return NoContent();
        }
    }
}
