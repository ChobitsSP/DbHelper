import { IColumn } from "../../models/Index";

function GetRow(list: string[]) {
  return [
    '',
    ...list,
    '',
  ].join(' | ');
}

export default function (tableName: string, cols: IColumn[]) {
  const arr: string[] = [];

  const colNames = ['id', '列名', '数据类型', '可空', '描述'];

  arr.push('## ' + tableName);
  arr.push('');
  arr.push('### 列');
  arr.push('');
  arr.push(GetRow(colNames));
  arr.push(GetRow(colNames.map(() => '---')));

  cols.forEach(col => {
    arr.push(GetRow([col.id.toString(), col.name, col.type, col.null_able ? '是' : '否', col.comments]));
  });

  return arr.join("\r\n");
}