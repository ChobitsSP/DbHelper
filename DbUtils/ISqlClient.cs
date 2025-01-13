using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DbUtils
{
    public interface ISqlClient
    {
        Task<T> QueryAsync<T>(string sql);
    }
}
