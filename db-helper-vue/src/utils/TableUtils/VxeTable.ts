import { IColumn } from "../../models/Index";
import { TypeIsNumber, TypeIsDate, TypeIsString, TypeIsDecimal } from "../TableUtils";

export default function (tableName: string, cols: IColumn[]) {
  return cols
    .map(c => {
      const label = c.comments || c.name;

      if (TypeIsDate(c.type)) {
        return `<vxe-column 
        field="${c.name}" 
        title="${label}" 
        width="160"
        :formatter="CellFormat.GetDate()"
        sortable>
        </vxe-column>`;
      }

      return `<vxe-column field="${c.name}" title="${label}" width="120" sortable></vxe-column>`;
    })
    .join("\n");
}