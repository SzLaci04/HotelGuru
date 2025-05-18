using HotelGuru.DataContext.Dtos;
using HotelGuru.DataContext.Entities;
using HotelGuru.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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
        /// Összes regisztrált felhasználó lekérése(csak admin kérheti le)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "admin")] // Csak admin férhet hozzá az összes felhasználóhoz
        public async Task<IActionResult> GetAllFelhasznalo()
        {
            var felhasznalok = await _felhasznaloService.GetAllFelhasznaloAsync();
            return Ok(felhasznalok);
        }

        /// <summary>
        /// Egy adott felhasználó lekérése azonosító alapján
        /// </summary>
        [HttpGet("{id}")]
        [Authorize(Roles = "vendég,recepciós,admin")] // Minden bejelentkezett felhasználó
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
        [AllowAnonymous] // Bárki regisztrálhat
        public async Task<IActionResult> RegisztrcioFelhasznalo([FromBody] RegisztralFelhasznaloDto felhasznaloDto)
        {
            var felhasznalo = await _felhasznaloService.RegisztracioAsync(felhasznaloDto);
            return CreatedAtAction(nameof(GetFelhasznalo), new { id = felhasznalo.Id }, felhasznalo);
        }

        [HttpPost("bejelentkez")]
        [AllowAnonymous] // Bárki bejelentkezhet
        public async Task<IActionResult> Bejelentkezes([FromBody] FelhasznaloLoginDto felhasznaloLoginDto)
        {
            var token = await _felhasznaloService.BejelentkezesAsync(felhasznaloLoginDto);
            return Ok(token);
        }

        /// <summary>
        /// Felhasználó adatainak frissítése
        /// </summary>
        [HttpPut("frissit")]
        [Authorize(Roles = "vendég,recepciós,admin")] // Minden bejelentkezett felhasználó
        public async Task<IActionResult> UpdateFelhasznalo([FromBody] FelhasznaloUpdateDto felhasznaloDto)
        {
            int felhasznaloId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var felhasznalo = await _felhasznaloService.UpdateFelhasznaloAsync(felhasznaloId, felhasznaloDto);
            if (felhasznalo == null)
                return NotFound();
            return Ok(felhasznalo);
        }

        /// <summary>
        /// Felhasználó törlése
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")] // Csak admin törölhet felhasználót
        public async Task<IActionResult> DeleteFelhasznalo(int id)
        {
            var result = await _felhasznaloService.DeleteFelhasznaloAsync(id);
            if (!result)
                return NotFound();
            return NoContent();
        }

        [HttpGet("sajatSzamlak")]
        [Authorize(Roles ="vendég,admin,recepciós")]
        public async Task<IActionResult> GetSajatSzamlak()
        {
            int felhasznaloId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var szamlak = await _felhasznaloService.GetSajatSzamlak(felhasznaloId);
            return szamlak!=null ? Ok(szamlak) : NoContent();
        }
    }
}