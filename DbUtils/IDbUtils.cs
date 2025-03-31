using MySqlConnector;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Dapper;
using Newtonsoft.Json.Linq;

namespace DbUtilsCore
{
    public interface IDbUtils
    {
        Task<List<TableColumn>> GetColumns(string table);

        Task<List<string>> GetTableNames();

        Task UpdateComment(string table, string column, string comment);

        Task TableDataAdd(string table, string[] columns, object data);

        Task<List<T>> PagerList<T>(string sql, int skip, int take);
    }

    public static class DbHelper
    {
        public static IDbUtils GetUtils(string ProviderName, string ConnectionString)
        {
            switch (ProviderName)
            {
                case "Npgsql":
                    return new Utils.NpgUtils(new NpgSqlClient(ConnectionString));
                case "MySql.Data.MySqlClient":
                    return new Utils.MySqlUtils(new MySqlClient(ConnectionString));
                case "System.Data.SqlClient":
                    return new Utils.MsSqlUtils(new MsSqlClient(ConnectionString));
                case "Oracle.ManagedDataAccess.Client":
                    return new Utils.OracleUtils(new OracleSqlClient(ConnectionString));
                default:
                    return new Utils.MsSqlUtils(new MsSqlClient(ConnectionString));
            }
        }

        public static string SafeTableName(string name)
        {
            if (string.IsNullOrEmpty(name)) return name;
            return Regex.Match(name, @"[a-z0-9_]+", RegexOptions.IgnoreCase).Value;
        }

        static IDbConnection GetDbConnection(string constr, string type)
        {
            if (type == "MySql")
            {
                return new MySqlConnection(constr);
            }
            else if (type == "SqlServer")
            {
                return new SqlConnection(constr);
            }
            else if (type == "PostgreSql")
            {
                return new Npgsql.NpgsqlConnection(constr);
            }
            else if (type == "Oracle")
            {
                return new OracleConnection(constr);
            }
            else
            {
                throw new Exception("Unknown provider");
            }
        }

        public static async Task<List<dynamic>> DbQuery(string constr, string type, string sql, JObject reqParam = null)
        {
            using (var conn = GetDbConnection(constr, type))
            {
                var param = new Dictionary<string, object>();
                if (reqParam != null && reqParam.Type == JTokenType.Object)
                {
                    param = reqParam.ToObject<Dictionary<string, object>>();
                }
                var result = await conn.QueryAsync(sql, param);
                var list = result.AsList();
                return list;
            }
        }
    }
}
