﻿using DbUtils;
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
        public IEnumerable<string> TableNames(SqlRequest req)
        {
            var utils = DbHelper.GetUtils(req.providerName, req.connectionString);
            var list = utils.GetTableNames();
            return list;
        }

        [HttpPost]
        [Route("TableColumns")]
        public IEnumerable<TableColumn> TableColumns(SqlRequest req)
        {
            var utils = DbHelper.GetUtils(req.providerName, req.connectionString);
            var list = utils.GetColumns(req.table);
            return list;
        }

        [HttpPost]
        [Route("ListGet")]
        public IList ListGet(SqlRequest req)
        {
            var utils = DbHelper.GetUtils(req.providerName, req.connectionString);
            return utils.ListGet(req.table, req.skip, req.take);
        }

        [HttpPost]
        [Route("UpdateColumnComment")]
        public ItemResult UpdateColumnComment(SqlRequest req)
        {
            var utils = DbHelper.GetUtils(req.providerName, req.connectionString);
            utils.UpdateComment(req.table, req.column, req.comment);
            return new ItemResult();
        }
    }
}
