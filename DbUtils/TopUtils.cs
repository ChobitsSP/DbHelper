using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Net;
using System.IO;

namespace DbUtilsCore
{
    public static class TopUtils
    {
        /// <summary>
        /// 给TOP请求签名。
        /// </summary>
        /// <param name="parameters">所有字符型的TOP请求参数</param>
        /// <param name="secret">签名密钥</param>
        /// <param name="qhs">是否前后都加密钥进行签名</param>
        /// <returns>签名</returns>
        public static string SignTopRequest(IDictionary<string, string> parameters, string secret, bool qhs = true)
        {
            // 第一步：把字典按Key的字母顺序排序
            IDictionary<string, string> sortedParams = new SortedDictionary<string, string>(parameters);
            IEnumerator<KeyValuePair<string, string>> dem = sortedParams.GetEnumerator();

            // 第二步：把所有参数名和参数值串在一起
            StringBuilder query = new StringBuilder(secret);
            while (dem.MoveNext())
            {
                string key = dem.Current.Key;
                string value = dem.Current.Value;
                if (!string.IsNullOrEmpty(key) && !string.IsNullOrEmpty(value))
                {
                    query.Append(key).Append(value);
                }
            }
            if (qhs)
            {
                query.Append(secret);
            }
            return GetMD5(query.ToString());
        }

        public static string GetMD5(string query)
        {
            MD5 md5 = MD5.Create();
            byte[] bytes = md5.ComputeHash(Encoding.UTF8.GetBytes(query));

            StringBuilder result = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                string hex = bytes[i].ToString("X");
                if (hex.Length == 1)
                {
                    result.Append("0");
                }
                result.Append(hex);
            }
            return result.ToString();
        }

        public static async Task<string> PostJson(string url, object body)
        {
            var reqJson = JsonConvert.SerializeObject(body);

            var req = GetWebRequest(url, "POST");
            req.ContentType = "application/json;charset=utf-8";
            var postData = Encoding.UTF8.GetBytes(reqJson);

            var reqStream = await req.GetRequestStreamAsync();
            await reqStream.WriteAsync(postData, 0, postData.Length);
            reqStream.Close();

            var rsp = (HttpWebResponse)await req.GetResponseAsync();
            return GetResponseAsString(rsp, Encoding.UTF8);
        }

        /// <summary>
        /// 把响应流转换为文本。
        /// </summary>
        /// <param name="rsp">响应流对象</param>
        /// <param name="encoding">编码方式</param>
        /// <returns>响应文本</returns>
        public static string GetResponseAsString(HttpWebResponse rsp, Encoding encoding)
        {
            System.IO.Stream stream = null;
            StreamReader reader = null;

            try
            {
                // 以字符流的方式读取HTTP响应
                stream = rsp.GetResponseStream();
                reader = new StreamReader(stream, encoding);
                return reader.ReadToEnd();
            }
            finally
            {
                // 释放资源
                if (reader != null) reader.Close();
                if (stream != null) stream.Close();
                if (rsp != null) rsp.Close();
            }
        }

        public static HttpWebRequest GetWebRequest(string url, string method)
        {
            HttpWebRequest req = null;
            if (url.Contains("https"))
            {
                //直接确认，否则打不开
                ServicePointManager.ServerCertificateValidationCallback = (sender, certificate, chain, errors) => true;
                req = (HttpWebRequest)WebRequest.CreateDefault(new Uri(url));
            }
            else
            {
                req = (HttpWebRequest)WebRequest.Create(url);
            }

            req.ServicePoint.Expect100Continue = false;
            req.Method = method;
            req.KeepAlive = true;
            req.Accept = "application/json";

            return req;
        }

        public static async Task<T> PostJson<T>(string url, object body, string secret)
        {
            var reg = new Regex(@"\/api\/.+", RegexOptions.IgnoreCase);

            var bodyJson = JsonConvert.SerializeObject(body);

            var dic = new Dictionary<string, string>();
            dic["method"] = reg.Match(url).Groups[0].Value;
            dic["body"] = Convert.ToBase64String(Encoding.UTF8.GetBytes(bodyJson));
            dic["timestamp"] = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            dic["sign"] = SignTopRequest(dic, secret, true);

            var responseString = await PostJson(url, dic);

            var rspObj = JObject.Parse(responseString);
            var rsp = rspObj.ToObject<TopResult>();
            if (rsp.code != 0) throw new Exception(rsp.msg);

            if (rspObj.ContainsKey("data"))
            {
                return rspObj["data"].ToObject<T>();
            }
            if (rspObj.ContainsKey("result"))
            {
                return rspObj["result"].ToObject<T>();
            }
            return default;
        }

        public class TopResult
        {
            public int code { get; set; }
            public string msg { get; set; }
        }

        public static DateTime TimeStampToDateTime(string timestamp)
        {
            if (Regex.IsMatch(timestamp, @"^\d{4}-\d{2}-\d{2}[^\d]\d{2}:\d{2}:\d{2}$"))
            {
                return ToDateTime(timestamp, "yyyy-MM-dd HH:mm:ss").Value;
            }

            ulong val = ulong.Parse(timestamp);

            // (val > 1498213901000)
            if (val > 1400000000000)
            {
                val /= 1000;
            }

            return UnixTimeStampToDateTime(val);
        }

        public static DateTime? ToDateTime(this string str, string format)
        {
            if (string.IsNullOrEmpty(str)) return null;
            if (format.Length > str.Length)
            {
                format = format.Substring(0, str.Length);
            }
            DateTime result;
            if (DateTime.TryParseExact(str, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out result)) return result;
            return null;
        }

        public static DateTime UnixTimeStampToDateTime(ulong unixTimeStamp)
        {
            // Unix timestamp is seconds past epoch
            DateTime dateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dateTime = dateTime.AddSeconds(unixTimeStamp).ToLocalTime();
            return dateTime;
        }
    }
}
