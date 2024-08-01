import { IColumn } from "../../models/Index";
import { TypeIsNumber, TypeIsDate, TypeIsString, TypeIsDecimal } from "../TableUtils";

export default function (table: string, cols: IColumn[]) {
  const temp = cols
    .map(c => {
      const label = c.comments || c.name;

      return `<el-col :span="24">
<el-form-item label="${label}" prop="${c.name}">
${GetField(c)}
</el-form-item>
</el-col>`;
    })
    .join("\n");

  return temp;
}

function GetField(col: IColumn) {
  if (TypeIsDate(col.type)) return GetDateInput(col);
  if (TypeIsDecimal(col.type)) return GetDecimalInput(col);
  if (TypeIsNumber(col.type)) return GetNumInput(col);
  return GetInput(col);
}

function GetDateInput(col: IColumn) {
  return `<el-date-picker type="date" placeholder="选择日期" v-model="item.${col.name
    }" clearable></el-date-picker>`;
}

function GetInput(col: IColumn) {
  const placeholder = col.comments || "";

  return `<el-input v-model="item.${col.name
    }" clearable placeholder="${placeholder}"></el-input>`;
}

function GetNumInput(col: IColumn) {
  return `<el-input-number type="number" v-model.number="item.${col.name
    }" controls-position="right"></el-input-number>`;
}

function GetDecimalInput(col: IColumn) {
  return `<el-input-number v-model="item.${col.name
    }" controls-position="right" :precision="2"></el-input-number>`;
}