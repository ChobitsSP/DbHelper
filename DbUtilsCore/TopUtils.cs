using System.Text;
using System.Security.Cryptography;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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

        public static async Task<TopResult> PostForm(string url, IDictionary<string, string> body)
        {
            using var client = new HttpClient();
            var content = new FormUrlEncodedContent(body);
            var response = await client.PostAsync(url, content);
            var responseString = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<TopResult>(responseString);
            return result;
        }

        public class TopResult
        {
            public int code { get; set; }
            public string msg { get; set; }
            public JToken result { get; set; }
        }
    }
}