using Microsoft.AspNetCore.Mvc;

namespace HotelGuru.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HotelController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new[] { "Hotel1", "Hotel2" });
        }
    }
}
