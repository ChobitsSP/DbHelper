using Microsoft.AspNetCore.ResponseCompression;
using static System.Net.Mime.MediaTypeNames;
using System.Text;

namespace SqlApiCore
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddResponseCompression(options =>
            {
                options.Providers.Add<GzipCompressionProvider>();
                options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] { Application.Json });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseStaticFiles();

            app.UseResponseCompression();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            RequestDelegate spaHtml = async (context) =>
            {
                var filePath = Path.Combine(env.WebRootPath, "index.html");
                var html = File.ReadAllText(filePath, Encoding.UTF8);
                context.Response.StatusCode = 200;
                context.Response.ContentType = Text.Html;
                await context.Response.WriteAsync(html);
            };

            Func<HttpContext, bool> spaMatch = (c) =>
            {
                var list = new string[] { "/api/" };
                var asds = c.Request.Path;
                return list.All(t => !c.Request.Path.StartsWithSegments(t, StringComparison.OrdinalIgnoreCase));
            };

            app.MapWhen(spaMatch, appBuilder =>
            {
                appBuilder.Run(spaHtml);
            });
        }
    }
}
