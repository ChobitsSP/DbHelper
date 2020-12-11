const numberlist = ["NUMBER", "integer", "smallint", "int", "numeric", "bigint"];
const datelist = ["DATE", "timestamp without time zone", "date", "datetime"];
const strlist = [
  "character varying",
  "uuid",
  "VARCHAR2",
  "NVARCHAR2",
  "uniqueidentifier",
  "nvarchar",
  "varchar",
  "text"
];

export function TypeIsNumber(type: string) {
  return numberlist.some(t => t === type);
}

export function TypeIsString(type: string) {
  return strlist.some(t => t === type);
}

export function TypeIsDate(type: string) {
  return datelist.some(t => t === type);
}
