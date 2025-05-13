using HotelGuru.DataContext.Context;
using HotelGuru.DataContext.Dtos;
using HotelGuru.DataContext.Entities;
using HotelGuru.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace HotelGuru.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SzobaController : ControllerBase
    {
        private readonly ISzobaService _szobaService;

        public SzobaController(ISzobaService szobaService)
        {
            _szobaService = szobaService;
        }

        /// <summary>
        /// Visszatér az összes szobával, egy tömbben
        /// </summary>
        /// <returns>Egy tömb a szobákkal</returns>
        [HttpGet]
        [AllowAnonymous] // Bárki megnézheti a szobákat
        public async Task<IActionResult> GetAllSzoba()
        {
            var szobak = await _szobaService.GetAllSzobaAsync();
            Console.WriteLine(szobak.ToString());
            return Ok(szobak);
        }

        /// <summary>
        /// Egy adott szoba lekérdezése azonosító alapján
        /// </summary>
        [HttpGet("{id}")]
        [AllowAnonymous] // Bárki megnézhet egy szobát
        public async Task<IActionResult> GetSzoba(int id)
        {
            var szoba = await _szobaService.GetSzobaByIdAsync(id);
            return Ok(szoba);
        }

        /// <summary>
        /// Elérhető szobák lekérdezése
        /// </summary>
        [HttpGet("available")]
        [AllowAnonymous] // Bárki megnézheti az elérhető szobákat
        public async Task<IActionResult> GetAvailableSzobak()
        {
            var szobak = await _szobaService.GetAvailableSzobakAsync();
            return Ok(szobak);
        }

        /// <summary>
        /// Új szoba hozzáadása
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "admin")] // Csak admin adhat hozzá új szobát
        public async Task<IActionResult> AddSzoba([FromBody] SzobaCreateDto szobaDto)
        {
            var szoba = await _szobaService.AddSzobaAsync(szobaDto);
            return CreatedAtAction(nameof(GetSzoba), new { id = szoba.Id }, szoba);
        }

        /// <summary>
        /// Szoba adatainak frissítése
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "admin,recepciós")] // Admin és recepciós frissíthet szobákat
        public async Task<IActionResult> UpdateSzoba(int id, [FromBody] SzobaUpdateDto szobaDto)
        {
            var szoba = await _szobaService.UpdateSzobaAsync(id, szobaDto);
            return Ok(szoba);
        }

        /// <summary>
        /// Szoba törlése
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")] // Csak admin törölhet szobát
        public async Task<IActionResult> DeleteSzoba(int id)
        {
            var eredmeny = await _szobaService.DeleteSzobaAsync(id);
            if (eredmeny)
                return NoContent();
            return NotFound();
        }
        /// <summary>
        /// Összes plusz szolgáltatás kiírása
        /// </summary>
        [HttpGet("pluszszolg")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPluszSzolg()
        {
            var szolgaltatasok = await _szobaService.GetAllPluszSzolgAsync();
            return Ok(szolgaltatasok);
        }
    }
}