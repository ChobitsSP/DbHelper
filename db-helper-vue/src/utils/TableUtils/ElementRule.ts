import { IColumn } from "../../models/Index";
import { TypeIsNumber, TypeIsDate, TypeIsString } from "../TableUtils";

export default function(table: string, cols: IColumn[]) {
  const obj: any = {};

  cols.forEach(c => {
    const arr = GetRules(c);
    if (arr.length) obj[c.name] = arr;
  });

  return JSON.stringify(obj);

  // const temp = cols
  //   .map(c => {
  //     const required = c.null_able ? "false" : "true";

  //     const row = `${c.name}: [
  //       { required: ${required}, message: '请输入${c.comments ||
  //       ""}', trigger: 'blur' }
  //     ]`;

  //     return row;
  //   })
  //   .join(",\n");

  // return `{${temp}}`;
}

function GetRules(col: IColumn): any[] {
  const arr = [];

  if (!col.null_able) {
    arr.push({
      required: true,
      message: "必填",
      trigger: TypeIsDate(col.type) ? "change" : "blur"
    });
  }

  return arr;
}
