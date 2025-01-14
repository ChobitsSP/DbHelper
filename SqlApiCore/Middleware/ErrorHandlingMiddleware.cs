using log4net;
using Newtonsoft.Json;
using SqlApiCore.Models;
using static System.Net.Mime.MediaTypeNames;

namespace SqlApiCore.Middleware
{
    public class ErrorHandlingMiddleware
    {
        ILog logger;

        public ErrorHandlingMiddleware()
        {
            logger = LogManager.GetLogger(typeof(ErrorHandlingMiddleware));
        }

        private readonly RequestDelegate _next;

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                // await _emailService.SendException(ex);
                LogService.Error(ex);
                logger?.Error(ex.Message, ex);
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            return HandleBllExceptionAsync(context, StatusCodes.Status500InternalServerError, ex.Message);
        }

        private static Task HandleBllExceptionAsync(HttpContext context, int code, string msg)
        {
            var result = JsonConvert.SerializeObject(new ItemResult(code, msg));
            context.Response.StatusCode = StatusCodes.Status200OK;
            context.Response.ContentType = Application.Json;
            return context.Response.WriteAsync(result);
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class ErrorHandlingMiddlewareExtensions
    {
        public static IApplicationBuilder UseErrorHandlingMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ErrorHandlingMiddleware>();
        }
    }
}
