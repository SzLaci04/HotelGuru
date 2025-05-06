using HotelGuru.DataContext.Dtos;
using HotelGuru.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

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
    }
}