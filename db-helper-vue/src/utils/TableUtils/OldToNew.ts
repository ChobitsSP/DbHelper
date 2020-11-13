import { IColumn } from "../../models/Index";

export default function(table: string, cols: IColumn[]) {
  return cols.map(t => `old.${t.name} = item.${t.name};`).join("\n");
}
