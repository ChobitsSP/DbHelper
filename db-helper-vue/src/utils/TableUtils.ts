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
  return [
    "money",
    "decimal",
    "NUMBER",
    "integer",
    "smallint",
    "int",
    "numeric",
    "bigint",
  ].some(t => StringEqualsIgnoreCase(t, type));
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

/**
 * SQL 字符串
 * @param value - 要转义的字符串
 * @param char - 用于转义的字符，默认为单引号
 * @returns 转义后的字符串
 */
function getEscape(value: string, char = "'"): string {
  return value.replace(new RegExp(char, 'g'), `${char}${char}`);
}

export function BuildUpdateSql(tableName: string, columns: IColumn[], row: Record<string, string>, keyFields: string[] = []) {
  const setSql = Object.keys(row).filter(key => !keyFields.includes(key)).map(field => {
    const column = columns.find(t => t.name === field);
    const value = GetSqlValue(column, row[field]);
    return `${field} = ${value}`
  }).join(',');

  const whereSql = keyFields.map(field => {
    const column = columns.find(t => t.name === field);
    const value = GetSqlValue(column, row[field]);
    return `${field} = ${value}`
  }).join(' and ');

  let sql = `update ${tableName} set ${setSql} where ${whereSql}`;
  return sql;
}

function GetSqlValue(column: IColumn, value: string) {
  if (value == null || value === '') {
    if (column.null_able) {
      return 'null';
    }
    else if (TypeIsDate(column.type)) {
      return `'${moment().format('YYYY-MM-DD HH:mm:ss')}'`;
    }
    else if (TypeIsNumber(column.type)) {
      return `0`;
    }
    else if (TypeIsString(column.type)) {
      return `''`;
    }
    else {
      throw new Error(`column ${column.name} type ${column.type} cannot be null`);
    }
  }
  else if (TypeIsDate(column.type)) {
    if (moment(value).isValid()) {
      return `'${moment(value).format('YYYY-MM-DD HH:mm:ss')}'`;
    }
    else {
      return `'${value}'`;
    }
  }
  else if (TypeIsString(column.type)) {
    if (typeof value === 'string') {
      return `'${getEscape(value)}'`;
    }
    else {
      return `'${value}'`;
    }
  } else {
    return value;
  }
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
    values += GetSqlValue(column, row[column.name]);
  });
  sql += ") ";
  values += ")";
  sql += values;
  return sql;
}

export function CheckIsSelect(sql: string) {
  return sql && /^\s{0,}select /i.test(sql);
}