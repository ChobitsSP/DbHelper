using Npgsql;
using Dapper;
using MySqlConnector;
using Microsoft.Data.SqlClient;
using Oracle.ManagedDataAccess.Client;
using System.Data;
using Newtonsoft.Json.Linq;

namespace DbUtilsCore
{
    public interface ISqlClient
    {
        Task<List<T>> QueryAsync<T>(string sql, object param = null, int take = 0);
        Task<T> QueryFirstAsync<T>(string sql, object param = null);
        Task ExecuteAsync(string sql, object param = null);
        IDbConnection GetDb();
    }

    public class ApiClient : ISqlClient
    {
        public string endpoint { get; set; }
        public string secret { get; set; }

        public Task ExecuteAsync(string sql, object param = null)
        {
            return TopUtils.PostJson<JToken>(this.endpoint, new
            {
                sql,
                param,
            }, this.secret);
        }

        public IDbConnection GetDb()
        {
            throw new NotImplementedException();
        }

        public async Task<List<T>> QueryAsync<T>(string sql, object param = null, int take = 0)
        {
            var result = await TopUtils.PostJson<JToken>(this.endpoint, new
            {
                sql,
                param,
                take,
            }, this.secret);
            if (result.Type == JTokenType.Array)
            {
                return result.ToObject<List<T>>();
            }
            else
            {
                return new List<T> { result.ToObject<T>() };
            }
        }

        public async Task<T> QueryFirstAsync<T>(string sql, object param = null)
        {
            var list = await this.QueryAsync<T>(sql, param, 1);
            return list.FirstOrDefault();
        }
    }

    public abstract class BaseSqlClient : ISqlClient
    {
        public string connstr { get; set; }
        public BaseSqlClient(string connstr)
        {
            this.connstr = connstr;
        }

        public abstract IDbConnection GetDb();

        public async Task<List<T>> QueryAsync<T>(string sql, object param = null, int take = 0)
        {
            using var db = this.GetDb();

            if (take > 0)
            {
                var rows = await db.QueryAsync<T>(sql, param);
                var list = rows.Take(take).AsList();
                return list;
            }
            else
            {
                var rows = await db.QueryAsync<T>(sql, param);
                var list = rows.AsList();
                return list;
            }
        }

        public async Task<T> QueryFirstAsync<T>(string sql, object param = null)
        {
            var list = await this.QueryAsync<T>(sql, param, 1);
            return list.FirstOrDefault();
        }

        public Task ExecuteAsync(string sql, object param = null)
        {
            using var db = this.GetDb();
            return db.ExecuteAsync(sql, param);
        }
    }

    public class NpgSqlClient : BaseSqlClient
    {
        public NpgSqlClient(string connstr) : base(connstr) { }
        public override IDbConnection GetDb()
        {
            return new NpgsqlConnection(connstr);
        }
    }

    public class OracleSqlClient : BaseSqlClient
    {
        public OracleSqlClient(string connstr) : base(connstr) { }
        public override IDbConnection GetDb()
        {
            return new OracleConnection(connstr);
        }
    }

    public class MsSqlClient : BaseSqlClient
    {
        public MsSqlClient(string connstr) : base(connstr) { }
        public override IDbConnection GetDb()
        {
            return new SqlConnection(connstr);
        }
    }

    public class MySqlClient : BaseSqlClient
    {
        public MySqlClient(string connstr) : base(connstr) { }
        public override IDbConnection GetDb()
        {
            return new MySqlConnection(connstr);
        }
    }
}
