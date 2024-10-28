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
            public string TABLE_NAME { get; set; }
            public int COLUMN_ID { get; set; }
            public string COLUMN_NAME { get; set; }
            public string COMMENTS { get; set; }
            public string DATA_TYPE { get; set; }
            public string NULLABLE { get; set; }
        }

        public IEnumerable<TableColumn> GetColumns(string table)
        {
            string fields = @"
t1.TABLE_NAME,
1 as COLUMN_ID, 
t2.COLUMN_NAME, 
t2.DATA_TYPE, 
1 as DATA_LENGTH, 
t2.is_nullable as NULLABLE,
pg_catalog.col_description(c.oid, t2.ordinal_position::int) as COMMENTS";

            string sql = @"
SELECT {0}
FROM information_schema.tables t1
INNER JOIN information_schema.columns t2 ON t1.TABLE_NAME = t2.TABLE_NAME
INNER JOIN pg_catalog.pg_class c ON c.relname = t1.TABLE_NAME
WHERE t1.table_schema = 'public'";

            if (!string.IsNullOrEmpty(table))
            {
                sql += " AND t1.table_name = @table";
            }

            sql += " ORDER BY t1.table_name, t2.ordinal_position";

            sql = string.Format(sql, fields);

            List<TableColumnsItem> list;

            using (var db = new NpgsqlConnection(connstr))
            {
                list = db.Query<TableColumnsItem>(sql, new { table }).AsList();
            }

            var result = list.Select(t => new TableColumn()
            {
                table = t.TABLE_NAME,
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
            // comment on column ecif_point_rule.add_growth is @comment;
            string sql = string.Format("comment on column {0}.{1} is '{2}'", table, column, comment);

            using (var db = new NpgsqlConnection(connstr))
            {
                db.Execute(sql, new { comment });
            }
        }

        public void TableDataAdd(string table, string[] columns, object data)
        {
            throw new NotImplementedException();
        }
    }
}