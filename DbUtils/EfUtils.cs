using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace DbUtils
{
    public static class EfUtils
    {
        static Regex r1 = new Regex(@"///");
        static Regex r2 = new Regex(@"(\w+) { get; set; }");
        static Regex r3 = new Regex(@"(?:\r\n|\r|\n)");

        /// <summary>
        /// 给文件添加注释
        /// </summary>
        /// <param name="filePath"></param>
        public static void AddComments(IDbUtils db, string filePath)
        {
            TableColumn[] cols;

            var alllines = File.ReadAllLines(filePath);
            // if (alllines.Any(t => t.Contains("/// <summary>"))) return;

            try
            {
                var tbName = Path.GetFileNameWithoutExtension(filePath);
                cols = db.GetColumns(tbName).ToArray();
            }
            catch (Exception ex)
            {
                return;
            }

            bool flag = false;

            var lines = alllines
                .Where(t => !r1.IsMatch(t))
                .Select(line =>
                {
                    var m = r2.Match(line);
                    var arr = new string[] { line };

                    if (m.Success)
                    {
                        var name = m.Groups[1].Value;
                        var col = cols.Where(t => t.name == name).FirstOrDefault();

                        if (col != null && col.comments != null)
                        {
                            flag = true;
                            return GetComments(col.comments).Concat(arr);
                        }
                    }

                    return arr;
                })
                .SelectMany(t => t)
                .ToArray();

            if (flag) File.WriteAllLines(filePath, lines, Encoding.UTF8);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="str"></param>

        static IEnumerable<string> GetComments(string str)
        {
            yield return "        /// <summary>";

            var list = r3.Split(str);

            foreach (var s in list)
            {
                yield return "        /// " + s;
            }

            yield return "        /// </summary>";
        }

        public static string OracleXmlSeq(string xml)
        {
            var reg1 = new Regex(@"(?<=</Key>[\s]+)<Property Name=""SEQ_[^>]+>", RegexOptions.Singleline);

            return reg1.Replace(xml, m =>
            {
                return OracleAddId(m.Value);
            });
        }

        static string OracleAddId(string tbxml)
        {
            if (tbxml.Contains("StoreGeneratedPattern")) return tbxml;


            const string Identity = @" StoreGeneratedPattern=""Identity""";
            return tbxml.Replace(" />", Identity + " />");


            var doc = XElement.Parse(tbxml);
            var key = doc.Element("Key").Element("PropertyRef").Attribute("Name").Value;
            var p = doc.Elements("Property").First();
            var name = p.Attribute("Name").Value;

            if (key == name && name.StartsWith("SEQ_"))
            {
                p.SetAttributeValue("StoreGeneratedPattern", "123123");
            }

            var str = doc.ToString();
            return str;
        }
    }
}
