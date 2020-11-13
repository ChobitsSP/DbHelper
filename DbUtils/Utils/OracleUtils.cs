using Dapper;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DbUtils.Utils
{
    public class OracleUtils : IDbUtils
    {
        protected string connstr { get; set; }

        public OracleUtils(string connstr)
        {
            this.connstr = connstr;
        }

        public class TableColumnsItem
        {
            public int COLUMN_ID { get; set; }
            public string COLUMN_NAME { get; set; }
            public string COMMENTS { get; set; }
            public string DATA_TYPE { get; set; }
            public string NULLABLE { get; set; }
        }

        public IEnumerable<TableColumn> GetColumns(string table)
        {
            table = DbHelper.SafeTableName(table);

            string fields = "t2.COLUMN_ID,t1.COLUMN_NAME,COMMENTS,t2.DATA_TYPE,t2.DATA_LENGTH,t2.NULLABLE";

            string sql = "select {0} from user_col_comments t1 inner join user_tab_columns t2 on t1.COLUMN_NAME = t2.COLUMN_NAME and t1.TABLE_NAME = t2.TABLE_NAME where t1.table_name = '{1}' order by column_id asc";

            sql = string.Format(sql, fields, table);

            List<TableColumnsItem> list;

            using (var db = new OracleConnection(connstr))
            {
                list = db.Query<TableColumnsItem>(sql).AsList();
            }

            var result = list.Select(t => new TableColumn()
            {
                id = t.COLUMN_ID,
                name = t.COLUMN_NAME,
                comments = t.COMMENTS,
                null_able = t.NULLABLE == "Y",
                type = t.DATA_TYPE,
            });

            return result;
        }

        public List<string> GetTableNames()
        {
            List<string> result;

            const string sql = "SELECT table_name FROM user_tables order by table_name";

            using (var db = new OracleConnection(connstr))
            {
                result = db.Query<string>(sql).AsList();
            }

            return result;
        }

        public IDbConnection GetDb()
        {
            return new OracleConnection(connstr);
        }

        public void UpdateComment(string table, string column, string comment)
        {
            throw new NotImplementedException();
        }
    }
}
