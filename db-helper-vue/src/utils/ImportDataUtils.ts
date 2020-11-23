import { IColumn } from "../models/Index";
import { TypeIsNumber, TypeIsDate, TypeIsString } from "./TableUtils";
import moment from "moment";

function IsEmpty(value: string) {
  return value == null || value == "";
}

export function RowTypeTrans(rows: { [key: string]: any }[], columns: IColumn[]) {
  rows.forEach(row => {
    Object.keys(row).forEach(key => {
      const col = columns.find(t => t.name === key);
      if (col == null) return;

      const value: string = row[key];

      if (col.null_able && IsEmpty(value)) {
        row[key] = null;
        return;
      }

      if (TypeIsNumber(col.type)) {
        row[key] = parseFloat(value || "0");
        return;
      }

      if (TypeIsDate(col.type)) {
        row[key] = moment(value || new Date()).toDate();
      }
    })
  })
}