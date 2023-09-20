import { IColumn } from "../../models/Index";

export default function (tableName: string, cols: IColumn[]) {
  return cols
    .map(c => {
      const label = c.comments || c.name;
      return `<vxe-column field="${c.name}" title="${label}" width="120" sortable></vxe-column>`;
    })
    .join("\n");
}