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

namespace DbUtils
{
    public interface IDbUtils
    {
        IEnumerable<TableColumn> GetColumns(string table);

        List<string> GetTableNames();

        void UpdateComment(string table, string column, string comment);

        IDbConnection GetDb();
    }

    public static class DbHelper
    {
        public static IDbUtils GetUtils(ConnectionStringSettings config)
        {
            return GetUtils(config.ProviderName, config.ConnectionString);
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
            return Regex.Match(name, @"[a-z0-9_]+", RegexOptions.IgnoreCase).Value;
        }

        public static IList ListGet(this IDbUtils dbu, string table, int skip, int take)
        {
            var sql = "select * from " + SafeTableName(table);

            using (var db = dbu.GetDb())
            {
                return db.Query(sql).Skip(skip).Take(take).AsList();
            }
        }
    }
}
