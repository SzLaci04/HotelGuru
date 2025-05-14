using HotelGuru.DataContext.Dtos;
using HotelGuru.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace HotelGuru.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Alapértelmezetten csak bejelentkezett felhasználók férhetnek hozzá
    public class FoglalasController : ControllerBase
    {
        private readonly IFoglalasService _foglalasService;

        public FoglalasController(IFoglalasService foglalasService)
        {
            _foglalasService = foglalasService;
        }

        /// <summary>
        /// Új foglalás létrehozása
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "vendég,recepciós,admin")] // Minden bejelentkezett felhasználó létrehozhat foglalást
        public async Task<IActionResult> LetrehozFoglalas([FromBody] FoglalasCreateDto dto)
        {
            var foglalas = await _foglalasService.LetrehozFoglalasAsync(dto);
            return CreatedAtAction(nameof(GetFoglalas), new { id = foglalas.Id }, foglalas);
        }

        /// <summary>
        /// Foglalás lemondása
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "vendég,recepciós,admin")] // Minden bejelentkezett felhasználó lemondhat foglalást
        public async Task<IActionResult> Lemondas(int id)
        {
            var result = await _foglalasService.LemondFoglalastAsync(id);
            return result ? NoContent() : NotFound();
        }

        /// <summary>
        /// Összes foglalás lekérdezése - csak admin és recepciós számára elérhető
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "recepciós,admin")] // Csak recepciós és admin férhet hozzá az összes foglaláshoz
        public async Task<IActionResult> GetAllFoglalas()
        {
            var foglalasok = await _foglalasService.GetAllFoglalasAsync();
            return Ok(foglalasok);
        }

        /// <summary>
        /// Egy adott foglalás lekérdezése azonosító alapján
        /// </summary>
        [HttpGet("{id}")]
        [Authorize(Roles = "vendég,recepciós,admin")] // Minden bejelentkezett felhasználó lekérdezhet egy foglalást
        public async Task<IActionResult> GetFoglalas(int id)
        {
            var foglalas = await _foglalasService.GetFoglalasByIdAsync(id);
            return foglalas != null ? Ok(foglalas) : NotFound();
        }

        /// <summary>
        /// Egy adott foglalás lekérdezése felhasználó id alapján - csak admin és recepciós
        /// </summary>
        [HttpGet("FelhasznaloFoglalas/{felhasznaloId}")]
        [Authorize(Roles = "vendég,recepciós,admin")]
        public async Task<IActionResult> GetFoglalasokByFelhasznaloId(int felhasznaloId)
        {
            // Ellenőrizzük, hogy a felhasználó a saját foglalásait kéri-e le
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userIdClaim != null)
            {
                if (int.TryParse(userIdClaim.Value, out var userId) && userId != felhasznaloId && userRole != "admin" && userRole != "recepciós")
                {
                    return Forbid("Csak a saját foglalásaidat tekintheted meg, vagy adminisztrációs joggal rendelkező felhasználó vagy!");
                }
            }

            var foglalasok = await _foglalasService.GetFoglalasokByFelhasznaloIdAsync(felhasznaloId);
            return Ok(foglalasok);
        }

        /// <summary>
        /// Saját foglalások
        /// </summary>
        [HttpGet("SajatFoglalas")]
        [Authorize]
        public async Task<IActionResult> GetSajatFoglalasok()
        {
            // Kiolvassuk a bejelentkezett felhasználó azonosítóját a token-ből
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest("Nem sikerült azonosítani a felhasználót");
            }

            var foglalasok = await _foglalasService.GetFoglalasokByFelhasznaloIdAsync(userId);
            return Ok(foglalasok);
        }
    }
}