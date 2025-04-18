﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DbUtilsCore
{
    public class TableColumn
    {
        public int id { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public bool null_able { get; set; }
        public string comments { get; set; }
        public long? character_maximum_length { get; set; }
        public int? numeric_precision { get; set; }
        public int? numeric_scale { get; set; }
        public string table { get; set; }
    }
}
