using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;

namespace SqlWebApi
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        static readonly string log4net = System.Configuration.ConfigurationManager.AppSettings["log4net"];

        protected void Application_Start()
        {
            Utils.LogService.Init(HttpContext.Current.Server.MapPath("~").TrimEnd('\\') + log4net);
            GlobalConfiguration.Configure(WebApiConfig.Register);

            var serializerSettings = GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings;
            var contractResolver = (Newtonsoft.Json.Serialization.DefaultContractResolver)serializerSettings.ContractResolver;
            contractResolver.IgnoreSerializableAttribute = true;

            // 设置日期时间格式
            serializerSettings.DateFormatString = "yyyy-MM-dd HH:mm:ss";
            serializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Local;
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            string url = Request.Url.LocalPath;

            if (!System.IO.File.Exists(Context.Server.MapPath(url)) && !url.StartsWith("/api/", StringComparison.OrdinalIgnoreCase))
            {
                Context.RewritePath("/index.html");
            }
        }
    }
}
