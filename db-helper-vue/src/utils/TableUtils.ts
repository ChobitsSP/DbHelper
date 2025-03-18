import moment from 'moment';
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

    if (value == null || value === '') {
      if (column.null_able) {
        values += 'null';
      }
      else if (TypeIsDate(column.type)) {
        values += `'${moment().format('YYYY-MM-DD HH:mm:ss')}'`;
      }
      else if (TypeIsNumber(column.type) || TypeIsLong(column.type) || TypeIsDecimal(column.type)) {
        values += `0`;
      }
      else if (TypeIsString(column.type)) {
        values += `''`;
      }
      else {
        throw new Error(`column ${column.name} type ${column.type} cannot be null`);
      }
    }
    else if (TypeIsDate(column.type)) {
      if (moment(value).isValid()) {
        values += `'${moment(value).format('YYYY-MM-DD HH:mm:ss')}'`;
      }
      else {
        values += `'${value}'`;
      }
    }
    else if (TypeIsString(column.type)) {
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

export function CheckIsSelect(sql: string) {
  return sql && /^\s{0,}select /i.test(sql);
}