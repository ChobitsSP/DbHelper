import { IColumn } from "../../models/Index";
import { TypeIsNumber, TypeIsDate, TypeIsString } from "../TableUtils";
import _ from "lodash";

function GetTsProp(col: IColumn) {
  if (TypeIsNumber(col.type)) {
    return `${col.null_able ? "Integer" : "int"}`;
  }
  if (TypeIsDate(col.type)) {
    return `Date`;
  }
  if (TypeIsString(col.type)) {
    return `String`;
  }

  return `String`;
}

function GetTsComment(comment?: string) {
  if (!comment) return [];

  const arr: string[] = [];

  arr.push("/**");

  comment.split(/\r|\n/).forEach(t => {
    arr.push(" * " + t);
  });

  arr.push(" */");

  return arr;
}

function BuildAdd(tableName: string, cols: IColumn[]) {
  const arr: string[] = [];


  const keyCol = cols[0];

  let clist: IColumn[] = cols;

  if (TypeIsNumber(keyCol.type)) {
    arr.push(`<insert id="add" useGeneratedKeys="true" keyProperty="${cols[0].name}" parameterType="${tableName}">`);
    clist = _.cloneDeep(cols).splice(1);
  } else {
    arr.push(`<insert id="add" parameterType="${tableName}">`);
  }

  const p1 = clist.map(t => t.name).join(",");
  const p2 = clist.map(t => `#{${t.name}}`).join(",");
  arr.push(`insert into ${tableName} (${p1})`);
  arr.push(`values (${p2});`);
  arr.push(`</insert>`);
  return arr.join("\r\n");
}

function BuildUpdate(tableName: string, cols: IColumn[]) {
  const arr: string[] = [];
  arr.push(`<update id="update" parameterType="${tableName}">`);
  const keyCol = cols[0];

  const clist = _.cloneDeep(cols).splice(1);
  const p1 = clist.map(t => `${t.name} = #{${t.name}}`).join(",");
  arr.push(`update ${tableName} set ${p1}`);
  arr.push(`where ${keyCol.name} = #{${keyCol.name}};`);
  arr.push(`</update>`);
  return arr.join("\r\n");
}

function BuildFirst(tableName: string, cols: IColumn[]) {
  const arr: string[] = [];
  arr.push(`<select id="firstByKey" resultType="${tableName}">`);
  const keyCol = cols[0];
  arr.push(`select * from ${tableName} where ${keyCol.name} = #{key};`);
  arr.push(`</select>`);
  return arr.join("\r\n");
}

function BuildDelete(tableName: string, cols: IColumn[]) {
  const arr: string[] = [];
  arr.push(`<delete id="deleteByKey">`);
  const keyCol = cols[0];
  arr.push(`DELETE from ${tableName} where ${keyCol.name} = #{key};`);
  arr.push(`</delete>`);
  return arr.join("\r\n");
}

// https://www.tutorialspoint.com/mybatis/mybatis_mapper_xml.htm
export default function (tableName: string, cols: IColumn[]) {
  const arr: string[] = [];

  arr.push(BuildFirst(tableName, cols));
  arr.push(``);
  arr.push(BuildAdd(tableName, cols));
  arr.push(``);
  arr.push(BuildUpdate(tableName, cols));
  arr.push(``);
  arr.push(BuildDelete(tableName, cols));

  return arr.join("\r\n");
}
