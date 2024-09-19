using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using MySql.Data.MySqlClient;

namespace DbUtils.Utils
{
    public class MySqlUtils : IDbUtils
    {
        protected string connstr { get; set; }

        public MySqlUtils(string connstr)
        {
            this.connstr = connstr;
        }

        public class TableColumnsItem
        {
            public int ORDINAL_POSITION { get; set; }
            public string COLUMN_NAME { get; set; }
            public string COLUMN_DEFAULT { get; set; }
            public string DATA_TYPE { get; set; }
            public string IS_NULLABLE { get; set; }
            public string COLUMN_TYPE { get; set; }
            public string COLUMN_COMMENT { get; set; }
            public ulong? CHARACTER_MAXIMUM_LENGTH { get; set; }
            public int? NUMERIC_PRECISION { get; set; }
            public int? NUMERIC_SCALE { get; set; }
            public string table_name { get; set; }
        }

        public IEnumerable<TableColumn> GetColumns(string table)
        {
            var sql = @"SELECT
table_name,
ORDINAL_POSITION,
COLUMN_NAME,
COLUMN_DEFAULT,
IS_NULLABLE,
DATA_TYPE,
COLUMN_TYPE,
CHARACTER_MAXIMUM_LENGTH,
NUMERIC_PRECISION,
NUMERIC_SCALE,
COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE 1=1
and table_schema = ?table_schema";

            if (!string.IsNullOrEmpty(table))
            {
                sql += " and table_name = ?table";
            }

            sql += " ORDER BY table_name, ORDINAL_POSITION;";

            List<TableColumnsItem> list;

            var builder = new MySqlConnectionStringBuilder(connstr);

            using (var db = new MySqlConnection(connstr))
            {
                list = db.Query<TableColumnsItem>(sql, new { table, table_schema = builder.Database }).AsList();
            }

            var result = list.Select(t => new TableColumn()
            {
                id = t.ORDINAL_POSITION,
                name = t.COLUMN_NAME,
                comments = t.COLUMN_COMMENT,
                null_able = t.IS_NULLABLE == "YES",
                type = t.DATA_TYPE,
                character_maximum_length = t.CHARACTER_MAXIMUM_LENGTH,
                numeric_precision = t.NUMERIC_PRECISION,
                numeric_scale = t.NUMERIC_SCALE,
                table = t.table_name,
            });

            return result;
        }

        public List<string> GetTableNames()
        {
            List<string> result;

            var sb = new StringBuilder();

            var config = new MySqlConnectionStringBuilder(this.connstr);

            const string sql = @"
select table_name from information_schema.tables 
where table_schema = ?table_schema
and table_type='BASE TABLE';";

            using (var db = new MySqlConnection(connstr))
            {
                result = db.Query<string>(sql, new { table_schema = config.Database }).AsList();
            }

            return result;
        }

        public IDbConnection GetDb()
        {
            return new MySqlConnection(connstr);
        }

        class UpdateCommentResult
        {
            public string script { get; set; }
        }

        /// <summary>
        /// https://stackoverflow.com/a/17791564/2586541
        /// </summary>
        /// <param name="table"></param>
        /// <param name="column"></param>
        /// <param name="comment"></param>
        public void UpdateComment(string table, string column, string comment)
        {
            var config = new MySqlConnectionStringBuilder(this.connstr);

            var sql = @"
SELECT 
CONCAT('ALTER TABLE `',
        TABLE_SCHEMA,
        '`.`',
        table_name,
        '` CHANGE `',
        column_name,
        '` `',
        column_name,
        '` ',
        column_type,
        ' ',
        IF(is_nullable = 'YES', '' , 'NOT NULL '),
        IF(column_default IS NOT NULL, concat('DEFAULT ', IF(column_default IN ('CURRENT_TIMESTAMP', 'CURRENT_TIMESTAMP()', 'NULL', 'b\'0\'', 'b\'1\''), column_default, CONCAT('\'',column_default,'\'') ), ' '), ''),
        IF(column_default IS NULL AND is_nullable = 'YES' AND column_key = '' AND column_type = 'timestamp','NULL ', ''),
        IF(column_default IS NULL AND is_nullable = 'YES' AND column_key = '','DEFAULT NULL ', ''),
        extra) as script
FROM
    information_schema.columns
WHERE
    table_schema = ?table_schema
and column_name = ?column_name
and table_name = ?table_name
";

            using (var db = new MySqlConnection(connstr))
            {
                var result = db.Query<UpdateCommentResult>(sql, new { table_schema = config.Database, column_name = column, table_name = table }).FirstOrDefault();
                if (result == null) return;

                var sql2 = result.script + " COMMENT ?comment";

                db.Execute(sql2, new { comment });
            }
        }

        public void TableDataAdd(string table, string[] columns, object data)
        {
            var str1 = string.Join(",", columns);
            var str2 = string.Join(",", columns.Select(t => "?" + t));

            var sql = string.Format(@"insert into {0} ({1}) values ({2})", table, str1, str2);

            using (var db = new MySqlConnection(connstr))
            {
                db.Execute(sql, data);
            }
        }
    }
}
