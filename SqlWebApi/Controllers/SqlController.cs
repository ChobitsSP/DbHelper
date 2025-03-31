using DbUtilsCore;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace SqlWebApi.Controllers
{
    [RoutePrefix("api/sql")]
    public class SqlController : ApiController
    {
        public class SqlRequest
        {
            public string providerName { get; set; }
            public string connectionString { get; set; }
            public string table { get; set; }
            public string comment { get; set; }
            public string column { get; set; }

            public IDbUtils GetUtils()
            {
                return DbHelper.GetUtils(providerName, connectionString);
            }
        }

        [HttpPost]
        [Route("TableNames")]
        public async Task<ItemResult> TableNames(SqlRequest req)
        {
            var utils = req.GetUtils();
            var list = await utils.GetTableNames();
            return new ItemResult(list);
        }

        [HttpPost]
        [Route("TableColumns")]
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

        [HttpPost]
        [Route("ListGet")]
        public async Task<ItemResult> ListGet(ListGetReq req)
        {
            var utils = req.GetUtils();
            var result = await utils.PagerList<dynamic>(req.sql, req.skip, req.take);
            return new ItemResult(result);
        }

        [HttpPost]
        [Route("UpdateColumnComment")]
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

        [HttpPost]
        [Route("TableDataAdd")]
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
