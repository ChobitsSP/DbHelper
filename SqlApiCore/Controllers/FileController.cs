using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SqlApiCore.Models;

namespace SqlApiCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        public class UploadRequest
        {
            public IFormFile File { get; set; }
        }

        [HttpPost("Upload")]
        public async Task<ItemResult> Upload(UploadRequest req)
        {
            var file = req.File;
            if (file == null || file.Length == 0)
            {
                return new ItemResult("File is empty");
            }

            var saveDir = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            if (!Directory.Exists(saveDir))
            {
                Directory.CreateDirectory(saveDir);
            }

            var filePath = Path.Combine(saveDir, file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return new ItemResult();
        }
    }
}
