import { IColumn } from "../../models/Index";
import { TypeIsNumber, TypeIsDate, TypeIsString } from "../TableUtils";

function toHump(name: string) {
  return name
    .replace(/_([a-z])/g, function (g) {
      return g[1].toUpperCase();
    })
    .replace(/^[a-z]/g, (g) => g.toUpperCase());
}

function GetTsProp(col: IColumn) {
  const isAuto = col.id === 1 && TypeIsNumber(col.type);

  const plist: string[] = [];

  if (col.id === 1) {
    plist.push("primary_key");
  }
  if (!col.null_able) {
    plist.push("not null");
  }

  if (isAuto) {
    plist.push("AUTO_INCREMENT");
  }

  plist.push(`column:${col.name}`);

  const typeStr = (col.null_able ? "*" : "") + GetType(col);

  return `${toHump(col.name)} ${typeStr} \`json:"${col.name
    }" gorm:"${plist.join(";")}"\`\t//${col.comments}`;
}

export default function (tableName: string, cols: IColumn[]): string {
  const arr: string[] = [];

  arr.push(`type ${toHump(tableName)} struct {`);

  cols.forEach((col) => {
    arr.push(GetTsProp(col));
  });

  arr.push(`}`);

  return arr.join("\n");
}

function GetType(col: IColumn) {
  if (TypeIsNumber(col.type)) {
    return `int`;
  }
  if (TypeIsDate(col.type)) {
    return `time.Time`;
  }
  if (TypeIsString(col.type)) {
    return `string`;
  }

  return `string`;
}
