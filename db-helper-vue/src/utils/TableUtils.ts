import { IColumn } from '@/models/Index';

const numberlist = ["NUMBER", "integer", "smallint", "int", "numeric", "bigint"];

const datelist = ["DATE", "Date", "timestamp without time zone", "timestamp with time zone", "date", "datetime", "smalldatetime"];

const strlist = [
  "character varying",
  "uuid",
  "VARCHAR2",
  "NVARCHAR2",
  "uniqueidentifier",
  "nvarchar",
  "varchar",
  "text",
  "String",
  "string",
];

function StringEqualsIgnoreCase(str1: string, str2: string) {
  return str1.toLowerCase() === str2.toLowerCase();
}

export function TypeIsDecimal(type: string) {
  return ["decimal", "numeric", "money"].some(t => StringEqualsIgnoreCase(t, type));
}

export function TypeIsLong(type: string) {
  return ['bigint'].some(t => StringEqualsIgnoreCase(t, type));
}

export function TypeIsNumber(type: string) {
  return numberlist.some(t => StringEqualsIgnoreCase(t, type));
}

export function TypeIsString(type: string) {
  return strlist.some(t => StringEqualsIgnoreCase(t, type));
}

export function TypeIsDate(type: string) {
  return datelist.some(t => StringEqualsIgnoreCase(t, type));
}

export function TypeIsJs(type: string) {
  return ["string", "number", "boolean", "Date"].some(t => StringEqualsIgnoreCase(t, type));
}

export function BuildInsertSql(tableName: string, columns: IColumn[], row: Record<string, string>) {
  let sql = `insert into ${tableName} (`;
  let values = "values (";
  columns.forEach((column, index) => {
    if (index > 0) {
      sql += ", ";
      values += ", ";
    }
    sql += column.name;

    const value = row[column.name];

    if (value == null || value == '') {
      values += 'null';
    }
    else if (TypeIsString(column.type) || TypeIsDate(column.type)) {
      values += `'${value}'`;
    } else {
      values += value;
    }
  });
  sql += ") ";
  values += ")";
  sql += values;
  return sql;
}