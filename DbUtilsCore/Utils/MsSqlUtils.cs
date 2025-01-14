using Dapper;
using System.Data;

namespace DbUtilsCore.Utils
{
    public class MsSqlUtils : IDbUtils
    {
        protected ISqlClient client { get; set; }

        public MsSqlUtils(ISqlClient client)
        {
            this.client = client;
        }

        public async Task<List<TableColumn>> GetColumns(string table)
        {
            table = DbHelper.SafeTableName(table);

            // const string sql = "SELECT ORDINAL_POSITION,COLUMN_NAME,DATA_TYPE,IS_NULLABLE FROM INFORMATION_SCHEMA.columns WHERE TABLE_NAME= @table";

            var sql1 = @"
SELECT
        id = a.colorder,
        name = a.name,
        type = b.name,
        [table] = d.name,
        character_maximum_length = a.length,
		numeric_precision = a.prec,
		numeric_scale = a.scale,
        null_able = a.isnullable,
        comments= isnull(g.[value],'')
        FROM   syscolumns   a
        left   join   systypes   b   on   a.xusertype=b.xusertype
        inner   join   sysobjects   d   on   a.id=d.id     and   d.xtype='U'   and     d.name<>'dtproperties'
        left   join   syscomments   e   on   a.cdefault=e.id
        left   join   sys.extended_properties   g   on   a.id=g.major_id   and   a.colid=g.minor_id
        left   join   sys.extended_properties   f   on   d.id=f.major_id   and   f.minor_id=0
        where 1=1
";

            if (!string.IsNullOrEmpty(table))
            {
                sql1 += " and d.name = @table ";
            }

            sql1 += " order by d.name, a.id, a.colorder";

            var list = await client.QueryAsync<TableColumn>(sql1, new { table });
            return list;
        }

        public async Task<List<string>> GetTableNames()
        {
            const string sql = "select name from sysobjects where xtype='u' order by name";
            var list = await client.QueryAsync<string>(sql);
            return list;
        }

        /// <summary>
        /// https://stackoverflow.com/questions/9018518/how-to-add-a-comment-to-an-existing-table-column-in-sql-server
        /// </summary>
        /// <param name="table"></param>
        /// <param name="column"></param>
        /// <param name="comment"></param>
        public async Task UpdateComment(string table, string column, string comment)
        {
            //            var sql = @"
            //EXEC sp_updateextendedproperty 
            //@name = N'MS_Description', @value = 'Your description',
            //@level0type = N'Schema', @level0name = dbo, 
            //@level1type = N'Table',  @level1name = Your Table Name, 
            //@level2type = N'Column', @level2name = Yuur Column Name;
            //";

            using var db = client.GetDb();

            // var hasDesc = false;

            var p = new DynamicParameters();
            p.Add("@name", "MS_Description");
            p.Add("@value", comment);

            p.Add("@level0type", "Schema");
            p.Add("@level0name", "dbo");
            p.Add("@level1type", "Table");
            p.Add("@level1name", table);
            p.Add("@level2type", "Column");
            p.Add("@level2name", column);

            try
            {
                await db.ExecuteAsync("sys.sp_updateextendedproperty", p, commandType: CommandType.StoredProcedure);
            }
            catch
            {
                await db.ExecuteAsync("sys.sp_addextendedproperty", p, commandType: CommandType.StoredProcedure);
            }
        }

        public Task TableDataAdd(string table, string[] columns, object data)
        {
            throw new NotImplementedException();
        }

        public Task<List<T>> PagerList<T>(string sql, int skip, int take)
        {
            if (take > 0)
            {
                if (skip > 0)
                {
                    var pagerSql = $"SELECT * FROM ({sql}) AS subquery ORDER BY (SELECT NULL) OFFSET {skip} ROWS FETCH NEXT {take} ROWS ONLY";
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
