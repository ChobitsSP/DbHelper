﻿using System.Collections;
using System.Configuration.Provider;
using System.Text.RegularExpressions;
using Dapper;

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

        public static IDbUtils GetApiUtils(string endpoint, string secret, string ProviderName)
        {
            var apiClient = new ApiClient()
            {
                endpoint = endpoint,
                secret = secret,
            };
            switch (ProviderName)
            {
                case "Npgsql":
                    return new Utils.NpgUtils(apiClient);
                case "MySql.Data.MySqlClient":
                    return new Utils.MySqlUtils(apiClient);
                case "System.Data.SqlClient":
                    return new Utils.MsSqlUtils(apiClient);
                case "Oracle.ManagedDataAccess.Client":
                    return new Utils.OracleUtils(apiClient);
                default:
                    return new Utils.MsSqlUtils(apiClient);
            }
        }

        public static string SafeTableName(string name)
        {
            if (string.IsNullOrEmpty(name)) return name;
            return Regex.Match(name, @"[a-z0-9_]+", RegexOptions.IgnoreCase).Value;
        }
    }
}
