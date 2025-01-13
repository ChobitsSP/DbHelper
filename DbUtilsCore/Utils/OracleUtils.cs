using System.Data;

namespace DbUtilsCore.Utils
{
    public class OracleUtils : IDbUtils
    {
        protected ISqlClient client { get; set; }

        public OracleUtils(ISqlClient client)
        {
            this.client = client;
        }

        public class TableColumnsItem
        {
            public int COLUMN_ID { get; set; }
            public string COLUMN_NAME { get; set; }
            public string COMMENTS { get; set; }
            public string DATA_TYPE { get; set; }
            public string NULLABLE { get; set; }
        }

        public async Task<List<TableColumn>> GetColumns(string table)
        {
            table = DbHelper.SafeTableName(table);

            string fields = "t2.COLUMN_ID,t1.COLUMN_NAME,COMMENTS,t2.DATA_TYPE,t2.DATA_LENGTH,t2.NULLABLE";

            string sql = "select {0} from user_col_comments t1 inner join user_tab_columns t2 on t1.COLUMN_NAME = t2.COLUMN_NAME and t1.TABLE_NAME = t2.TABLE_NAME where t1.table_name = '{1}' order by column_id asc";

            sql = string.Format(sql, fields, table);

            var list = await client.QueryAsync<TableColumnsItem>(sql);

            var result = list.Select(t => new TableColumn()
            {
                id = t.COLUMN_ID,
                name = t.COLUMN_NAME,
                comments = t.COMMENTS,
                null_able = t.NULLABLE == "Y",
                type = t.DATA_TYPE,
            }).ToList();

            return result;
        }

        public async Task<List<string>> GetTableNames()
        {
            const string sql = "SELECT table_name FROM user_tables order by table_name";
            var list = await client.QueryAsync<string>(sql);
            return list;
        }

        public Task UpdateComment(string table, string column, string comment)
        {
            throw new NotImplementedException();
        }

        public Task TableDataAdd(string table, string[] columns, object data)
        {
            throw new NotImplementedException();
        }

        static string SqlPager(string sql, int skip, int take)
        {
            int endRow = skip + take;
            return $@"SELECT * FROM (
                SELECT subquery.*, ROWNUM rnum
                FROM ({sql}) subquery
                WHERE ROWNUM <= {endRow}
            ) WHERE rnum > {skip}";
        }

        public Task<List<T>> PagerList<T>(string sql, int skip, int take)
        {
            var pagerSql = SqlPager(sql, skip, take);
            return client.QueryAsync<T>(pagerSql);
        }
    }
}
