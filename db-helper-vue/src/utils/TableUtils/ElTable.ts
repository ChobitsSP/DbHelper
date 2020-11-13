import { IColumn } from "../../models/Index";

export default function(tableName: string, cols: IColumn[]) {
  const arr: string[] = [];
  return cols
    .map(c => {
      const label = c.comments || c.name;

      return `<el-table-column prop="${
        c.name
      }" label="${label}" sortable="custom"></el-table-column>`;
    })
    .join("\n");
}
