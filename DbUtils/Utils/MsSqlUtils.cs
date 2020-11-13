using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DbUtils.Utils
{
    public class MsSqlUtils : IDbUtils
    {
        protected string connstr { get; set; }

        public MsSqlUtils(string connstr)
        {
            this.connstr = connstr;
        }

        public IEnumerable<TableColumn> GetColumns(string table)
        {
            table = DbHelper.SafeTableName(table);

            const string sql = "SELECT ORDINAL_POSITION,COLUMN_NAME,DATA_TYPE,IS_NULLABLE FROM INFORMATION_SCHEMA.columns WHERE TABLE_NAME= @table";


            const string sql1 = @"
SELECT
        id=a.colorder,
        name=a.name,
        type=b.name,
        a.length,
		a.prec,
		a.scale,
        null_able = a.isnullable,
        comments=isnull(g.[value],'')
        FROM   syscolumns   a
        left   join   systypes   b   on   a.xusertype=b.xusertype
        inner   join   sysobjects   d   on   a.id=d.id     and   d.xtype='U'   and     d.name<>'dtproperties'
        left   join   syscomments   e   on   a.cdefault=e.id
        left   join   sys.extended_properties   g   on   a.id=g.major_id   and   a.colid=g.minor_id
        left   join   sys.extended_properties   f   on   d.id=f.major_id   and   f.minor_id=0
        where   d.name= @table
        order   by   a.id,a.colorder
";

            using (var db = new SqlConnection(connstr))
            {
                var result = db.Query<TableColumn>(sql1, new { table }).AsList();

                //var list = result.Select(t => new TableColumn()
                //{
                //    id = t.ORDINAL_POSITION,
                //    name = t.COLUMN_NAME,
                //    null_able = t.IS_NULLABLE == "YES",
                //    type = t.DATA_TYPE,
                //    comments = "",
                //}).ToArray();

                return result;
            }
        }

        public List<string> GetTableNames()
        {
            List<string> result;

            const string sql = "select name from sysobjects where xtype='u' order by name";

            using (var db = new SqlConnection(connstr))
            {
                result = db.Query<string>(sql).AsList();
            }

            return result;
        }

        public IDbConnection GetDb()
        {
            return new SqlConnection(connstr);
        }

        public void UpdateComment(string table, string column, string comment)
        {
            throw new NotImplementedException();
        }

        public class RootObject
        {
            public string COLUMN_NAME { get; set; }
            public int ORDINAL_POSITION { get; set; }
            public string COLUMN_DEFAULT { get; set; }
            public string IS_NULLABLE { get; set; }
            public string DATA_TYPE { get; set; }
            public object CHARACTER_MAXIMUM_LENGTH { get; set; }
            public object CHARACTER_OCTET_LENGTH { get; set; }
            public object NUMERIC_PRECISION { get; set; }
            public object NUMERIC_PRECISION_RADIX { get; set; }
            public object NUMERIC_SCALE { get; set; }
            public object DATETIME_PRECISION { get; set; }
            public string CHARACTER_SET_CATALOG { get; set; }
            public string CHARACTER_SET_SCHEMA { get; set; }
            public string CHARACTER_SET_NAME { get; set; }
            public string COLLATION_CATALOG { get; set; }
            public string COLLATION_SCHEMA { get; set; }
            public string COLLATION_NAME { get; set; }
            public string DOMAIN_CATALOG { get; set; }
            public string DOMAIN_SCHEMA { get; set; }
            public string DOMAIN_NAME { get; set; }
        }
    }
}
