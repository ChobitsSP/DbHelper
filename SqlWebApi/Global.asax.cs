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
