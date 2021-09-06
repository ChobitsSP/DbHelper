import { IColumn } from "../../models/Index";
import { TypeIsNumber, TypeIsDate, TypeIsString, TypeIsDecimal } from "../TableUtils";

function GetTsProp(col: IColumn) {
  if (TypeIsDecimal(col.type)) {
    return `decimal${col.null_able ? "?" : ""}`;
  }
  if (TypeIsNumber(col.type)) {
    return `int${col.null_able ? "?" : ""}`;
  }
  if (TypeIsDate(col.type)) {
    return `DateTime${col.null_able ? "?" : ""}`;
  }
  if (TypeIsString(col.type)) {
    return `string`;
  }

  return `string`;
}

function GetTsComment(comment?: string) {
  if (!comment) return [];

  const arr: string[] = [];

  arr.push("/// <summary>");

  comment.split(/\r|\n/).forEach(t => {
    arr.push("/// " + t);
  });

  arr.push("/// </summary>");

  return arr;
}

export default function (tableName: string, cols: IColumn[]) {
  const arr: string[] = [];

  arr.push(`using System.Collections.Generic;`);
  arr.push(`using System.ComponentModel.DataAnnotations;`);
  arr.push(`using System.ComponentModel.DataAnnotations.Schema;`);
  arr.push(`using System.Linq;`);
  arr.push(`using System.Text;`);
  arr.push(`using System.Threading.Tasks;`);

  arr.push(`[Table("${tableName}")]`);
  arr.push(`public partial class ${tableName} {`);

  cols.forEach((col, i) => {
    const cmlist = GetTsComment(col.comments);

    if (cmlist.length > 0) {
      arr.push(cmlist.join("\r\n"));
    }

    if (i === 0) {
      arr.push("[Key]");
      if (TypeIsNumber(col.type)) {
        arr.push("[DatabaseGenerated(DatabaseGeneratedOption.Identity)]");
      }
    }

    arr.push(`public ${GetTsProp(col)} ${col.name} { get; set; }`);

    if ((i + 1) !== cols.length) {
      arr.push("");
    }
  });

  arr.push(`}`);

  return arr.join("\r\n");
}
