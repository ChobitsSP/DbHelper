import { IColumn } from "../../models/Index";
import { TypeIsNumber, TypeIsDate, TypeIsString } from "../TableUtils";

function GetTsProp(col: IColumn) {
  if (TypeIsNumber(col.type)) {
    return `${col.null_able ? "Integer" : "int"}`;
  }
  if (TypeIsDate(col.type)) {
    return `Date`;
  }
  if (TypeIsString(col.type)) {
    return `String`;
  }

  return `String`;
}

function GetTsComment(comment?: string) {
  if (!comment) return [];

  const arr: string[] = [];

  arr.push("/**");

  comment.split(/\r|\n/).forEach(t => {
    arr.push(" * " + t);
  });

  arr.push(" */");

  return arr;
}

export default function (tableName: string, cols: IColumn[]) {
  const arr: string[] = [];

  arr.push(`import com.fasterxml.jackson.annotation.JsonProperty`);
  arr.push(`import java.util.*`);
  arr.push(``);

  arr.push(`public class ${tableName} {`);

  cols.forEach((col, i) => {
    const cmlist = GetTsComment(col.comments);

    if (cmlist.length > 0) {
      arr.push(cmlist.join("\r\n"));
    }

    const valType = GetTsProp(col);
    const funcNameCol = col.name[0].toUpperCase() + col.name.slice(1);

    arr.push(`@JsonProperty("${col.name}")`);
    arr.push(`private ${valType} ${col.name};`);
    arr.push(`public ${valType} get${funcNameCol}() { return this.${col.name}; }`);
    arr.push(`public void set${funcNameCol}(${valType} value) { this.${col.name} = value; }`);

    if ((i + 1) !== cols.length) {
      arr.push("");
    }
  });

  arr.push(`}`);

  return arr.join("\r\n");
}
