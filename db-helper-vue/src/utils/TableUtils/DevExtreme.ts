import { IColumn } from "src/models/Index";
import { TypeIsNumber, TypeIsDate, TypeIsString } from "../TableUtils";
import { DevColumn } from "../DevOptions/DataGrid";

export default function(table: string, cols: IColumn[]) {
  const list = cols.map(col => {
    const item: DevColumn = {
      dataField: col.name,
      caption: col.comments || col.name
      //name: col.name
    };

    if (TypeIsNumber(col.type)) {
      item.dataType = "number";
    } else if (TypeIsDate(col.type)) {
      item.dataType = "datetime";
      item.format = "yyyy-MM-dd HH:mm:ss";
    } else if (TypeIsString(col.type)) {
      item.dataType = "string";
    }

    return item;
  });

  return JSON.stringify(list);
}
