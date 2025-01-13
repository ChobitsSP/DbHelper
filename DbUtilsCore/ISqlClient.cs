using Npgsql;
using Dapper;
using MySqlConnector;
using Microsoft.Data.SqlClient;
using Oracle.ManagedDataAccess.Client;
using System.Data;

namespace DbUtilsCore
{
    public interface ISqlClient
    {
        Task<List<T>> QueryAsync<T>(string sql, object param = null);
        IDbConnection GetDb();
        string GetDatabaseName();
    }

    public class ApiClient : ISqlClient
    {
        public string endpoint { get; set; }
        public string secret { get; set; }

        public string GetDatabaseName()
        {
            throw new NotImplementedException();
        }

        public IDbConnection GetDb()
        {
            throw new NotImplementedException();
        }

        public Task<List<T>> QueryAsync<T>(string sql, object param = null)
        {
            throw new NotImplementedException();
        }
    }

    public class NpgSqlClient : ISqlClient
    {
        public string connstr { get; set; }
        public NpgSqlClient(string connstr)
        {
            this.connstr = connstr;
        }

        public string GetDatabaseName()
        {
            var builder = new NpgsqlConnectionStringBuilder(this.connstr);
            return builder.Database;
        }

        public IDbConnection GetDb()
        {
            return new NpgsqlConnection(connstr);
        }

        public async Task<List<T>> QueryAsync<T>(string sql, object param = null)
        {
            using var db = new NpgsqlConnection(connstr);
            var list = (await db.QueryAsync<T>(sql, param)).AsList();
            return list;
        }
    }

    public class OracleSqlClient : ISqlClient
    {
        public string connstr { get; set; }
        public OracleSqlClient(string connstr)
        {
            this.connstr = connstr;
        }

        public string GetDatabaseName()
        {
            throw new NotImplementedException();
        }

        public IDbConnection GetDb()
        {
            return new OracleConnection(connstr);
        }

        public async Task<List<T>> QueryAsync<T>(string sql, object param = null)
        {
            using var db = new OracleConnection(connstr);
            var list = (await db.QueryAsync<T>(sql, param)).AsList();
            return list;
        }
    }

    public class MsSqlClient : ISqlClient
    {
        public string connstr { get; set; }
        public MsSqlClient(string connstr)
        {
            this.connstr = connstr;
        }

        public string GetDatabaseName()
        {
            var builder = new SqlConnectionStringBuilder(this.connstr);
            return builder.InitialCatalog;
        }

        public IDbConnection GetDb()
        {
            return new SqlConnection(connstr);
        }

        public async Task<List<T>> QueryAsync<T>(string sql, object param = null)
        {
            using var db = new SqlConnection(connstr);
            var list = (await db.QueryAsync<T>(sql, param)).AsList();
            return list;
        }
    }

    public class MySqlClient : ISqlClient
    {
        public string connstr { get; set; }
        public MySqlClient(string connstr)
        {
            this.connstr = connstr;
        }

        public string GetDatabaseName()
        {
            var builder = new MySqlConnectionStringBuilder(this.connstr);
            return builder.Database;
        }

        public IDbConnection GetDb()
        {
            return new MySqlConnection(connstr);
        }

        public async Task<List<T>> QueryAsync<T>(string sql, object param = null)
        {
            using var db = new MySqlConnection(connstr);
            var list = (await db.QueryAsync<T>(sql, param)).AsList();
            return list;
        }
    }
}
