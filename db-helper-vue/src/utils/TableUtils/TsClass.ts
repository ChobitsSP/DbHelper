import { IColumn } from "../../models/Index";
import { TypeIsNumber, TypeIsDate, TypeIsString } from "../TableUtils";

function GetTsProp(col: IColumn) {
  if (TypeIsNumber(col.type)) {
    return `${col.name}${col.null_able ? "?" : ""}: number;`;
  }
  if (TypeIsDate(col.type)) {
    return `${col.name}${col.null_able ? "?" : ""}: Date | string;`;
  }
  if (TypeIsString(col.type)) {
    return `${col.name}${col.null_able ? "?" : ""}: string;`;
  }

  return `${col.name}${col.null_able ? "?" : ""}: any;`;
}

function GetTsComment(comment?: string) {
  if (!comment) return "";

  const arr: string[] = [];

  arr.push("/**");

  comment.split(/\r|\n/).forEach(t => {
    arr.push(" * " + t);
  });

  arr.push(" */");

  return arr.join("\r\n");
}

export default function(tableName: string, cols: IColumn[]) {
  const arr: string[] = [];

  arr.push(`class ${tableName} {`);

  cols.forEach(col => {
    arr.push(GetTsComment(col.comments));
    arr.push(GetTsProp(col));
  });

  arr.push(`}`);

  return arr.join("\r\n");
}
