using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using SqlApiCore.Models;
using SqlApiCore.Utils;
using System.Data;
using MySqlConnector;
using Microsoft.Data.SqlClient;
using Oracle.ManagedDataAccess.Client;
using Dapper;

namespace SqlApiCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DbController : ControllerBase
    {
        static IDbConnection GetDbConnection()
        {
            var constr = ConfigUtils.GetConnectionString("Default");
            var type = ConfigUtils.GetSectionValue("DefaultProvider");

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

        public class DbQueryReq
        {
            public string sql { get; set; }
            public JObject param { get; set; }
        }

        [HttpPost("DbQuery")]
        public async Task<ItemResult> DbQuery(JObject reqObj)
        {
            var req = this.ValidBody<DbQueryReq>(reqObj);

            using var conn = GetDbConnection();
            var param = new Dictionary<string, object>();
            if (req.param != null && req.param.Type == JTokenType.Object)
            {
                param = req.param.ToObject<Dictionary<string, object>>();
            }
            var result = await conn.QueryAsync(req.sql, param);
            var list = result.AsList();
            return new ItemResult(list);
        }
    }
}
