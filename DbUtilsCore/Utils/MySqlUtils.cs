using System.Data;
using Dapper;

namespace DbUtilsCore.Utils
{
    public class MySqlUtils : IDbUtils
    {
        protected ISqlClient client { get; set; }

        public MySqlUtils(ISqlClient client)
        {
            this.client = client;
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

        public async Task<List<TableColumn>> GetColumns(string table)
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
and table_schema = DATABASE()";

            if (!string.IsNullOrEmpty(table))
            {
                sql += " and table_name = ?table";
            }

            sql += " ORDER BY table_name, ORDINAL_POSITION;";

            var list = await client.QueryAsync<TableColumnsItem>(sql, new { table });

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
            }).ToList();

            return result;
        }

        class TableNamesItem
        {
            public string table_name { get; set; }
        }

        public async Task<List<string>> GetTableNames()
        {
            const string sql = @"
select table_name from information_schema.tables 
where table_schema = DATABASE()
and table_type='BASE TABLE';";
            var list = await client.QueryAsync<TableNamesItem>(sql);
            return list.Select(t => t.table_name).ToList();
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
        public async Task UpdateComment(string table, string column, string comment)
        {
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
    table_schema = DATABASE()
and column_name = ?column_name
and table_name = ?table_name
";

            var result = await client.QueryFirstAsync<UpdateCommentResult>(sql, new
            {
                column_name = column,
                table_name = table,
            });
            if (result == null) return;

            var sql2 = result.script + " COMMENT ?comment";
            await client.ExecuteAsync(sql2, new { comment });
        }

        public async Task TableDataAdd(string table, string[] columns, object data)
        {
            var str1 = string.Join(",", columns);
            var str2 = string.Join(",", columns.Select(t => "?" + t));

            var sql = string.Format(@"insert into {0} ({1}) values ({2})", table, str1, str2);

            await client.ExecuteAsync(sql, data);
        }

        public Task<List<T>> PagerList<T>(string sql, int skip, int take)
        {
            if (take > 0)
            {
                if (skip > 0)
                {
                    var pagerSql = $"SELECT * FROM ({sql}) AS subquery LIMIT {skip}, {take}";
                    return client.QueryAsync<T>(pagerSql);
                }
                else
                {
                    return client.QueryAsync<T>(sql, take);
                }
            }
            else
            {
                return client.QueryAsync<T>(sql);
            }
        }
    }
}
