using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Dapper;

namespace DbUtilsCore
{
    public interface IDbUtils
    {
        IEnumerable<TableColumn> GetColumns(string table);

        List<string> GetTableNames();

        void UpdateComment(string table, string column, string comment);

        IDbConnection GetDb();

        void TableDataAdd(string table, string[] columns, object data);

        string SqlPager(string sql, int skip, int take);
    }

    public static class DbHelper
    {
        public static IDbUtils GetUtils(ISqlClient client)
        {
            return null;
        }

        public static IDbUtils GetUtils(string ProviderName, string ConnectionString)
        {
            switch (ProviderName)
            {
                case "Npgsql":
                    return new Utils.NpgUtils(ConnectionString);
                case "MySql.Data.MySqlClient":
                    return new Utils.MySqlUtils(ConnectionString);
                case "System.Data.SqlClient":
                    return new Utils.MsSqlUtils(ConnectionString);
                case "Oracle.ManagedDataAccess.Client":
                    return new Utils.OracleUtils(ConnectionString);
                default:
                    return new Utils.MsSqlUtils(ConnectionString);
            }
        }

        public static string SafeTableName(string name)
        {
            if (string.IsNullOrEmpty(name)) return name;
            return Regex.Match(name, @"[a-z0-9_]+", RegexOptions.IgnoreCase).Value;
        }

        public static async Task<IList> ListGet(this IDbUtils dbu, string sql, int skip, int take)
        {
            using (var db = dbu.GetDb())
            {

                sql = dbu.SqlPager(sql, skip, take);
                var result = await db.QueryAsync(sql);
                var list = result.AsList();
                return list;
            }
        }
    }
}
