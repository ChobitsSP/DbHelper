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

        public class ChunkCheckRequest
        {
            public string resumableIdentifier { get; set; }
            public int resumableChunkNumber { get; set; }
            public int resumableChunkSize { get; set; }
            public int resumableCurrentChunkSize { get; set; }
            public int resumableTotalSize { get; set; }
            public int resumableTotalChunks { get; set; }
            public string resumableType { get; set; }
            public string resumableFilename { get; set; }
            public string resumableRelativePath { get; set; }
        }

        [HttpGet("upload")]
        public IActionResult UploadChunkCheck([FromQuery] ChunkCheckRequest req)
        {
            var chunkFolder = Path.Combine(_uploadFolder, req.resumableIdentifier);
            var chunkPath = Path.Combine(chunkFolder, req.resumableChunkNumber.ToString());

            if (System.IO.File.Exists(chunkPath))
            {
                var fileInfo = new FileInfo(chunkPath);
                if (fileInfo.Length == req.resumableCurrentChunkSize)
                {
                    return Ok();
                }
                else
                {
                    return Conflict("Chunk size mismatch");
                }
            }

            return NoContent();
        }

        [HttpPost]
        [Route("upload")]
        public async Task<IActionResult> UploadChunk(IFormFile file, [FromForm] string resumableIdentifier, [FromForm] int resumableChunkNumber)
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

            return Ok();
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
