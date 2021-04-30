import { IColumn } from "../../models/Index";

export default function (tableName: string, cols: IColumn[]) {
  const arr: string[] = [];
  cols.forEach((col, i) => {
    const funcNameCol = col.name[0].toUpperCase() + col.name.slice(1);
    arr.push(`old.set${funcNameCol}(item.get${funcNameCol}());`);
  });
  return arr.join("\r\n");
}
