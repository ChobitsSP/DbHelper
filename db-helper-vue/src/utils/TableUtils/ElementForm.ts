import { IColumn } from "../../models/Index";
import { TypeIsNumber, TypeIsDate, TypeIsString } from "../TableUtils";

export default function(table: string, cols: IColumn[]) {
  const temp = cols
    .map(c => {
      const label = c.comments || c.name;

      return `<el-form-item label="${label}" prop="${c.name}">
${GetField(c)}
</el-form-item>`;
    })
    .join("\n");

  return temp;
}

function GetField(col: IColumn) {
  if (TypeIsDate(col.type)) return GetDateInput(col);
  if (TypeIsNumber(col.type)) return GetNumInput(col);
  return GetInput(col);
}

function GetDateInput(col: IColumn) {
  return `<el-date-picker type="date" placeholder="选择日期" v-model="item.${
    col.name
  }"></el-date-picker>`;
}

function GetInput(col: IColumn) {
  const placeholder = col.comments || "";

  return `<el-input v-model="item.${
    col.name
  }" placeholder="${placeholder}"></el-input>`;
}

function GetNumInput(col: IColumn) {
  const label = col.comments || "";

  return `<el-input-number type="number" v-model.number="item.${
    col.name
  }" label="${label}"></el-input-number>`;
}
