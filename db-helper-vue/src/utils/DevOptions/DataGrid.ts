export interface DevColumn<T = any> {
  /**
   * Aligns the content of the column.
   */
  alignment?: undefined | "center" | "left" | "right";

  allowEditing?: boolean;
  allowExporting?: boolean;
  allowFiltering?: boolean;
  allowFixing?: boolean;
  allowGrouping?: boolean;
  allowHeaderFiltering?: boolean;
  allowHiding?: boolean;
  allowReordering?: boolean;
  allowResizing?: boolean;
  allowSearch?: boolean;
  allowSorting?: boolean;

  dataField?: string;
  caption?: string;
  dataType?: "string" | "number" | "date" | "boolean" | "object" | "datetime";

  /**
   * https://js.devexpress.com/Documentation/18_2/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/#format
   */
  format?: string;

  name?: string;

  /**
   * Customizes the text displayed in column cells.
   */
  customizeText?(cellInfo: CellInfo): string;

  cellTemplate?: CellTempFunc | string;

  minWidth?: number;
  visible?: boolean;
  width?: number;
}

export interface DevSummary {
  totalItems: TotalItems[];
}

interface TotalItems {
  column?: string;
  summaryType?: string;
  customizeText?(cell: CellInfo): string;
}

interface CellInfo {
  value: string | number | Date;
  valueText: string;
  target: string;
  groupInterval?: string | number;
}

interface CellTempFunc {
  (cellElement: Element, cellInfo: CellTempFuncInfo);
}

interface CellTempFuncInfo {
  data: any;
  component: any;
  value: any;
  displayValue: any;
  text: string;
  columnIndex: number;
  rowIndex: number;
  column: any;
  rowType: "data" | "group";
}
