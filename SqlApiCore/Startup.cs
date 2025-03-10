using Microsoft.AspNetCore.ResponseCompression;
using static System.Net.Mime.MediaTypeNames;
using System.Text;
using Newtonsoft.Json;
using SqlApiCore.Middleware;
using DbUtilsCore;

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
            services.AddSingleton(LogService.Init());

            // services.AddHostedService<TestWorker>();

            services.AddResponseCompression(options =>
            {
                options.Providers.Add<GzipCompressionProvider>();
                options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] { Application.Json });
            });

            services.AddControllers(options =>
            {
                options.OutputFormatters.Insert(0, new ItemResultOutputFormatter());
            }).AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = null;
            }).AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseErrorHandlingMiddleware();

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
