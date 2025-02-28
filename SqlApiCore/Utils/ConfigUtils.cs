using System.Text.RegularExpressions;

namespace SqlApiCore.Utils
{
    public static class ConfigUtils
    {
        public static IConfigurationRoot GetConfig()
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
#if DEBUG
                    .AddJsonFile("appsettings.Development.json")
#else
                    .AddJsonFile("appsettings.json")
#endif
                    .Build();

            return configuration;
        }

        /// <summary>
        /// 获取数据库连接字符串
        /// </summary>
        public static string GetConnectionString(string name)
        {
            var key = "ConnectionStrings" + name;
            var constr = Environment.GetEnvironmentVariable(key);
            if (!string.IsNullOrEmpty(constr)) return constr;
            constr = GetConfig().GetConnectionString(name);
            return constr;
        }

        public static string GetSectionValue(string name, string defVal = null)
        {
            return GetConfig().GetSectionValue(name, defVal);
        }

        public static string GetSectionValue(this IConfiguration config, string name, string defVal = null)
        {
            var envName = Regex.Replace(name, @"\:", ".");
            var value = Environment.GetEnvironmentVariable(envName);
            if (!string.IsNullOrEmpty(value)) return value;
            return config.GetSection(name)?.Value ?? defVal;
        }
    }
}
