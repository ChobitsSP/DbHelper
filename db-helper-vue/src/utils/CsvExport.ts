import * as XLSX from "xlsx";

interface IColumn {
  prop: string;
  label: string;
  formatter(row: any, column: IColumn, cellValue: any);
}

function GetRow(row: any, columns: IColumn[]) {
  const arr = [];

  columns.forEach(col => {
    let val = row[col.prop];

    if (col.formatter) {
      val = col.formatter(row, col, val);
    }

    arr.push(val);
  });

  return arr;
}

export default function CsvExport(
  data: any[],
  columns: IColumn[],
  fileName: string = "file1"
) {
  const rows = data.map(t => GetRow(t, columns));
  const fieldNames = columns.map(t => t.label);
  ExportExcel([fieldNames, ...rows], fileName);
}

export function ExportExcel(rows: any[][], filename = "file1") {
  /* original data */
  const ws_name = "SheetJS";

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);

  /* add worksheet to workbook */
  XLSX.utils.book_append_sheet(wb, ws, ws_name);

  /* write workbook */
  XLSX.writeFile(wb, filename + ".xlsx");
}