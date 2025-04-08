using Microsoft.AspNetCore.Mvc;
using SqlApiCore.Models;

namespace SqlApiCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly string _uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");

        public FileController()
        {
            if (!Directory.Exists(_uploadFolder))
            {
                Directory.CreateDirectory(_uploadFolder);
            }
        }

        [HttpPost]
        [Route("upload")]
        public async Task<ItemResult> UploadChunk(IFormFile file, [FromForm] string resumableIdentifier, [FromForm] int resumableChunkNumber)
        {
            var chunkFolder = Path.Combine(_uploadFolder, resumableIdentifier);

            if (!Directory.Exists(chunkFolder))
            {
                Directory.CreateDirectory(chunkFolder);
            }

            var chunkPath = Path.Combine(chunkFolder, resumableChunkNumber.ToString());

            using (var stream = new FileStream(chunkPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return new ItemResult();
        }

        [HttpPost]
        [Route("merge")]
        public ItemResult MergeChunks([FromForm] string resumableIdentifier, [FromForm] string fileName)
        {
            var chunkFolder = Path.Combine(_uploadFolder, resumableIdentifier);
            var finalFilePath = Path.Combine(_uploadFolder, fileName);

            var chunkFiles = Directory.GetFiles(chunkFolder);
            using (var finalFileStream = new FileStream(finalFilePath, FileMode.Create))
            {
                foreach (var chunkFile in chunkFiles)
                {
                    using (var chunkFileStream = new FileStream(chunkFile, FileMode.Open))
                    {
                        chunkFileStream.CopyTo(finalFileStream);
                    }
                }
            }

            Directory.Delete(chunkFolder, true);

            return new ItemResult();
        }
    }
}
