import { IColumn } from "../../models/Index";

export default function(tableName: string, cols: IColumn[]) {
  const col = cols[0];
  const pk = col.name;

  const arr = [];

  arr.push(`CREATE SEQUENCE SEQ_${tableName}`);
  arr.push("INCREMENT BY 1 -- 每次加几个");
  arr.push("START WITH 1 -- 从1开始计数");
  arr.push("NOMAXVALUE -- 不设置最大值");
  arr.push("NOCYCLE -- 一直累加，不循环");
  arr.push("NOCACHE -- 不建缓冲区");

  arr.push(`CREATE OR REPLACE TRIGGER "TIGER_SEQ_${tableName}" BEFORE`);
  arr.push(`INSERT ON ${tableName} FOR EACH ROW WHEN (new.${pk} is null)`);
  arr.push("begin");
  arr.push(`select SEQ_${tableName}.nextval into:new.${pk} from dual;`);
  arr.push("end;");

  return arr.join("\r\n");
}
