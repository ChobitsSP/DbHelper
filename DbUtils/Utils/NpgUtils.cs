using Dapper;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DbUtils.Utils
{
    public class NpgUtils : IDbUtils
    {
        protected string connstr { get; set; }

        public NpgUtils(string connstr)
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

            string fields = @"
1 as COLUMN_ID, 
t2.COLUMN_NAME, 
t2.DATA_TYPE, 
1 as DATA_LENGTH, 
t2.is_nullable as NULLABLE,

(SELECT pg_catalog.col_description(c.oid, t2.ordinal_position::int) FROM pg_catalog.pg_class c 
WHERE c.oid = (SELECT '{0}'::regclass::oid)
AND c.relname = t2.table_name) as COMMENTS";

            fields = string.Format(fields, table);

            string sql = "select {0} from information_schema.tables t1 inner join information_schema.columns t2 on t1.TABLE_NAME = t2.TABLE_NAME where t1.table_schema ='public' and t1.table_name = @table";

            sql = string.Format(sql, fields);

            List<TableColumnsItem> list;

            using (var db = new NpgsqlConnection(connstr))
            {
                list = db.Query<TableColumnsItem>(sql, new { table }).AsList();
            }

            var result = list.Select(t => new TableColumn()
            {
                id = t.COLUMN_ID,
                name = t.COLUMN_NAME,
                comments = t.COMMENTS,
                null_able = t.NULLABLE == "YES",
                type = t.DATA_TYPE,
            });

            return result;
        }

        public List<string> GetTableNames()
        {
            List<string> result;

            const string sql = "SELECT table_name FROM information_schema.tables where table_schema ='public' order by table_name";

            using (var db = new NpgsqlConnection(connstr))
            {
                result = db.Query<string>(sql).AsList();
            }

            return result;
        }

        public IDbConnection GetDb()
        {
            return new NpgsqlConnection(connstr);
        }

        public void UpdateComment(string table, string column, string comment)
        {
            // COMMENT ON COLUMN bill.id IS '±àºÅ';
            throw new NotImplementedException();
        }

        public void TableDataAdd(string table, string[] columns, object data)
        {
            throw new NotImplementedException();
        }
    }
}