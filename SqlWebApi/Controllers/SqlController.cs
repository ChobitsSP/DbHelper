using DbUtils;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
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

            public int skip { get; set; } = 0;
            public int take { get; set; } = 5;
        }

        [HttpPost]
        [Route("TableNames")]
        public ItemResult TableNames(SqlRequest req)
        {
            var utils = DbHelper.GetUtils(req.providerName, req.connectionString);
            var list = utils.GetTableNames();
            return new ItemResult(list);
        }

        [HttpPost]
        [Route("TableColumns")]
        public ItemResult TableColumns(SqlRequest req)
        {
            var utils = DbHelper.GetUtils(req.providerName, req.connectionString);
            var list = utils.GetColumns(req.table);
            return new ItemResult(list);
        }

        [HttpPost]
        [Route("ListGet")]
        public ItemResult ListGet(SqlRequest req)
        {
            var utils = DbHelper.GetUtils(req.providerName, req.connectionString);
            var result = utils.ListGet(req.table, req.skip, req.take);
            return new ItemResult(result);
        }

        [HttpPost]
        [Route("UpdateColumnComment")]
        public ItemResult UpdateColumnComment(SqlRequest req)
        {
            var utils = DbHelper.GetUtils(req.providerName, req.connectionString);
            utils.UpdateComment(req.table, req.column, req.comment);
            return new ItemResult();
        }

        public class TableDataAddReq : SqlRequest
        {
            public string[] import_cols { get; set; }
            public JObject[] import_datas { get; set; }
        }

        [HttpPost]
        [Route("TableDataAdd")]
        public ItemResult TableDataAdd(TableDataAddReq req)
        {
            var utils = DbHelper.GetUtils(req.providerName, req.connectionString);
            utils.TableDataAdd(req.table, req.import_cols, req.import_datas);
            return new ItemResult();
        }
    }
}
