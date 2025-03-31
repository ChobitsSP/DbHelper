using System;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Text;
using DbUtilsCore;
using System.Collections.Generic;
using System.Configuration;
using System.Web.Http;

namespace SqlWebApi
{
    public static class FormSignUtils
    {
        public static void ValidParams(Dictionary<string, string> dic, string urlPath)
        {
            var secert_key = ConfigurationManager.AppSettings["form_secert_key"];
            if (string.IsNullOrEmpty(secert_key)) throw new Exception("form_secert_key error");

            dic["method"] = urlPath;

            var fields = new string[] {
                "timestamp",
                "sign",
            };

            foreach (var field in fields)
            {
                if (!dic.ContainsKey(field)) throw new Exception($"{field} not found");
            }

            var time = TopUtils.TimeStampToDateTime(dic["timestamp"]);
            if (Math.Abs((DateTime.Now - time).TotalMinutes) > 5)
            {
                throw new Exception("timestamp error");
            }

            var reqSign = dic["sign"];
            dic.Remove("sign");

            var sign = TopUtils.SignTopRequest(dic, secert_key);
            if (!sign.Equals(reqSign, StringComparison.OrdinalIgnoreCase))
            {
                throw new Exception("sign error");
            }
        }

        public static T ValidBody<T>(this ApiController controller, JObject jobj)
        {
            var dic = jobj.ToObject<Dictionary<string, string>>();
            ValidParams(dic, controller.Request.RequestUri.AbsolutePath);

            var jsonBytes = Convert.FromBase64String(dic["body"]);
            var json = Encoding.UTF8.GetString(jsonBytes);

            return JsonConvert.DeserializeObject<T>(json);
        }
    }
}
