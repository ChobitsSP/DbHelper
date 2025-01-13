using DbUtilsCore;
using Microsoft.AspNetCore.Mvc;
using SqlApiCore.Models;

namespace SqlApiCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SqlController : ControllerBase
    {
        public class SqlRequest
        {
            public string providerName { get; set; }
            public string connectionString { get; set; }
            public string table { get; set; }
            public string comment { get; set; }
            public string column { get; set; }

            public string api_url { get; set; }
            public string api_secret { get; set; }

            public IDbUtils GetUtils()
            {
                if (string.IsNullOrEmpty(this.api_url))
                {
                    return DbHelper.GetUtils(providerName, connectionString);
                }
                else
                {
                    return DbHelper.GetApiUtils(api_url, api_secret, providerName);
                }
            }
        }

        [HttpPost("TableNames")]
        public async Task<ItemResult> TableNames(SqlRequest req)
        {
            var utils = req.GetUtils();
            var list = await utils.GetTableNames();
            return new ItemResult(list);
        }

        [HttpPost("TableColumns")]
        public async Task<ItemResult> TableColumns(SqlRequest req)
        {
            var utils = req.GetUtils();
            var list = await utils.GetColumns(req.table);
            return new ItemResult(list);
        }

        public class ListGetReq : SqlRequest
        {
            public string sql { get; set; }
            public int skip { get; set; } = 0;
            public int take { get; set; } = 50;
        }

        [HttpPost("ListGet")]
        public async Task<ItemResult> ListGet(ListGetReq req)
        {
            var utils = req.GetUtils();
            var result = await utils.PagerList<dynamic>(req.sql, req.skip, req.take);
            return new ItemResult(result);
        }

        [HttpPost("UpdateColumnComment")]
        public async Task<ItemResult> UpdateColumnComment(SqlRequest req)
        {
            var utils = req.GetUtils();
            await utils.UpdateComment(req.table, req.column, req.comment);
            return new ItemResult();
        }

        public class TableDataAddReq : SqlRequest
        {
            public string[] import_cols { get; set; }
            public Dictionary<string, object>[] import_datas { get; set; }
        }

        [HttpPost("TableDataAdd")]
        public async Task<ItemResult> TableDataAdd(TableDataAddReq req)
        {
            var utils = req.GetUtils();

            foreach (var row in req.import_datas)
            {
                await utils.TableDataAdd(req.table, req.import_cols, row);
            }

            return new ItemResult();
        }
    }
}
