const numberlist = ["NUMBER", "integer", "smallint", "int", "numeric", "bigint"];

const datelist = ["DATE", "Date", "timestamp without time zone", "timestamp with time zone", "date", "datetime"];

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

export function TypeIsDecimal(type: string) {
  return ["decimal"].some(t => t === type);
}

export function TypeIsNumber(type: string) {
  return numberlist.some(t => t === type);
}

export function TypeIsString(type: string) {
  return strlist.some(t => t === type);
}

export function TypeIsDate(type: string) {
  return datelist.some(t => t === type);
}

export function TypeIsJs(type: string) {
  return ["string", "number", "boolean", "Date"].some(t => t === type);
}