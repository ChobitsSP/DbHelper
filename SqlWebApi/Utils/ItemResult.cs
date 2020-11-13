using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SqlWebApi
{
    public class ItemResult
    {
        public int code { get; set; }

        public string msg { get; set; }

        public object result { get; set; }
    }
}