using HotelGuru.DataContext.Context;
using HotelGuru.DataContext.Dtos;
using HotelGuru.DataContext.Entities;
using HotelGuru.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelGuru.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SzobaController : ControllerBase
    {
        private readonly ISzobaService _szobaService;
        public SzobaController(ISzobaService szobaService)
        {
            _szobaService=szobaService;
        }
        /// <summary>
        /// Visszatér az összes szobával, egy tömbben
        /// </summary>
        /// <returns>Egy tömb a szobákkal</returns>

        [HttpGet]
        public async Task<IActionResult> GetAllSzoba()
        {
            var szobak = await _szobaService.GetAllSzobaAsync();
            Console.WriteLine(szobak.ToString());
            return Ok(szobak);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSzoba(int id)
        {
            var szoba = await _szobaService.GetSzobaByIdAsync(id);
            return Ok(szoba);
        }
        [HttpGet]
        [Route("api/[controller]/avialable")]
        public async Task<IActionResult> GetAvailableSzobak()
        {
            var szobak = await _szobaService.GetAvailableSzobakAsync();
            return Ok(szobak);
        }
        [HttpPost]
        public async Task<IActionResult> AddSzoba([FromBody] SzobaCreateDto szobaDto)
        {
            var szoba = await _szobaService.AddSzobaAsync(szobaDto);
            return CreatedAtAction(nameof(GetSzoba), new { id = szoba.Id }, szoba);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSzoba(int id, [FromBody] SzobaUpdateDto szobaDto)
        {
            var szoba = await _szobaService.UpdateSzobaAsync(id, szobaDto);
            return Ok(szoba);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSzoba(int id)
        {
            var eredmeny = await _szobaService.DeleteSzobaAsync(id);
            if(eredmeny)
                return NoContent();
            return NotFound();
        }
    }
}
