using HotelGuru.DataContext.Dtos;
using HotelGuru.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace HotelGuru.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")] 
    public class AdminisztratorController : ControllerBase
    {
        private readonly IAdminisztratorService _adminService;
        public AdminisztratorController(IAdminisztratorService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var adminok = await _adminService.GetAllAsync();
            return Ok(adminok);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var admin = await _adminService.GetByIdAsync(id);
            return Ok(admin);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] AdminisztratorCreateDto adminDto)
        {
            var ujAdmin = await _adminService.AddAsync(adminDto);
            return CreatedAtAction(nameof(Get), new { id = ujAdmin.Id }, ujAdmin);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AdminisztratorUpdateDto adminDto)
        {
            var frissitettAdmin = await _adminService.UpdateAsync(id, adminDto);
            return Ok(frissitettAdmin);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var sikeres = await _adminService.DeleteAsync(id);
            if (sikeres)
                return NoContent();
            return NotFound();
        }
    }
}