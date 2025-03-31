using DbUtilsCore;
using Newtonsoft.Json.Linq;
using System.Configuration;
using System.Threading.Tasks;
using System.Web.Http;

namespace SqlWebApi.Controllers
{
    [RoutePrefix("api/Db")]
    public class DbController : ApiController
    {
        public class DbQueryReq
        {
            public string sql { get; set; }
            public JObject param { get; set; }
        }

        [HttpPost]
        [Route("DbQuery")]
        public async Task<ItemResult> DbQuery(JObject reqObj)
        {
            DbQueryReq req = this.ValidBody<DbQueryReq>(reqObj);

            var constr = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            var type = ConfigurationManager.AppSettings["DbType"];

            var list = await DbHelper.DbQuery(constr, type, req.sql, req.param);

            return new ItemResult(list);
        }
    }
}
