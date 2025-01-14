using System.Text;
using System.Security.Cryptography;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;
using System.Net.Http.Json;

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

        public static async Task<T> PostJson<T>(string url, object body, string secret)
        {
            var reg = new Regex(@"\/api\/.+", RegexOptions.IgnoreCase);

            var bodyJson = JsonConvert.SerializeObject(body);

            var dic = new Dictionary<string, string>();
            dic["method"] = reg.Match(url).Groups[0].Value;
            dic["body"] = Convert.ToBase64String(Encoding.UTF8.GetBytes(bodyJson));
            dic["timestamp"] = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            dic["sign"] = SignTopRequest(dic, secret, true);

            var reqJson = JsonConvert.SerializeObject(dic);

            var handler = new HttpClientHandler()
            {
                ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
            };

            using var client = new HttpClient(handler);
            var response = await client.PostAsJsonAsync(url, dic);
            var responseString = await response.Content.ReadAsStringAsync();

            var rsp = JsonConvert.DeserializeObject<TopResult>(responseString);
            if (rsp.code != 0) throw new Exception(rsp.msg);
            if (rsp.result == null || rsp.result.Type == JTokenType.Null) return default;
            return rsp.result.ToObject<T>();
        }

        public class TopResult
        {
            public int code { get; set; }
            public string msg { get; set; }
            public JToken result { get; set; }
        }
    }
}