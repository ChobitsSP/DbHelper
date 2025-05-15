using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Filters;

namespace SqlWebApi
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API 配置和服务
            config.Filters.Add(new ExceptionHandlingAttribute());
            config.MessageHandlers.Add(new Filters.EncodingDelegateHandler());

            // Web API 路由
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Formatters.XmlFormatter.SupportedMediaTypes.Clear();
        }
    }

    [AttributeUsage(AttributeTargets.All, AllowMultiple = false, Inherited = true)]
    public class ExceptionHandlingAttribute : ExceptionFilterAttribute
    {
        /// <summary>
        /// http://stackoverflow.com/questions/21580861/how-to-return-json-for-errors-outside-the-webapi-pipeline
        /// </summary>
        /// <param name="context"></param>
        public override void OnException(HttpActionExecutedContext context)
        {
            // Log an exception 
            Utils.LogService.Error(context.Exception);

            context.Response = context.Request.CreateResponse(HttpStatusCode.OK, new ItemResult(500, context.Exception.Message));

            base.OnException(context);
        }
    }
}
