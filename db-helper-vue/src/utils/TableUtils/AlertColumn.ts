import { IColumn } from '@/models/Index';
import store from '@/store';
import * as Data from '@/data';

export default function (tableName: string, cols: IColumn[]) {
  const providerName = store.state.user.coninfo.providerName;
  return cols.map(t => GetAlertSql(providerName, tableName, t)).join("\r\n");
}

export function GetAlertSql(providerName: string, tableName: string, column: IColumn): string {
  let sql = '';
  const dbType = Data.DbTypes.find(t => t.value === providerName).label;
  if (dbType === Data.DbTypeMySql) {
    sql = GetMySqlAlertSql(tableName, column);
  }
  else if (dbType === Data.DbTypeMsSql) {
    sql = GetMsSqlAlertSql(tableName, column);
  }
  else if (dbType === Data.DbTypeNpgsql) {
    sql = GetNpgsqlAlertSql(tableName, column);
  }
  else if (dbType === Data.DbTypeOracle) {
    sql = GetOracleAlertSql(tableName, column);
  }
  return sql;
}

function GetMsSqlAlertSql(tableName: string, column: IColumn): string {
  let sql = `ALTER TABLE ${tableName} ADD ${column.name} ${column.type}`;

  if (column.type.toUpperCase().includes('VARCHAR') && column.character_maximum_length) {
    sql += `(${column.character_maximum_length})`;
  }

  if (column.type.toUpperCase().includes('DECIMAL') && column.numeric_precision && column.numeric_scale) {
    sql += `(${column.numeric_precision},${column.numeric_scale})`;
  }

  sql += column.null_able ? ' NULL' : ' NOT NULL';

  if (column.comments) {
    sql += `; EXEC sp_addextendedproperty 'MS_Description', N'${column.comments}', 'SCHEMA', 'dbo', 'TABLE', '${tableName}', 'COLUMN', '${column.name}'`;
  }

  return sql + ';';
}

function GetMySqlAlertSql(tableName: string, column: IColumn): string {
  let sql = `ALTER TABLE ${tableName} ADD COLUMN ${column.name} ${column.type}`;

  if (column.type.toUpperCase().includes('VARCHAR') && column.character_maximum_length) {
    sql += `(${column.character_maximum_length})`;
  }

  if (column.type.toUpperCase().includes('DECIMAL') && column.numeric_precision && column.numeric_scale) {
    sql += `(${column.numeric_precision},${column.numeric_scale})`;
  }

  sql += column.null_able ? ' NULL' : ' NOT NULL';

  if (column.comments) {
    sql += ` COMMENT '${column.comments}'`;
  }

  return sql + ';';
}

function GetNpgsqlAlertSql(tableName: string, column: IColumn): string {
  let sql = `ALTER TABLE ${tableName} ADD COLUMN ${column.name} ${column.type}`;

  if (column.type.toUpperCase().includes('VARCHAR') && column.character_maximum_length) {
    sql += `(${column.character_maximum_length})`;
  }

  if (column.type.toUpperCase().includes('NUMERIC') && column.numeric_precision && column.numeric_scale) {
    sql += `(${column.numeric_precision},${column.numeric_scale})`;
  }

  sql += column.null_able ? ' NULL' : ' NOT NULL';

  if (column.comments) {
    sql += `; COMMENT ON COLUMN ${tableName}.${column.name} IS '${column.comments}'`;
  }

  return sql + ';';
}

function GetOracleAlertSql(tableName: string, column: IColumn): string {
  let sql = `ALTER TABLE ${tableName} ADD ${column.name} ${column.type}`;

  if (column.type.toUpperCase().includes('VARCHAR2') && column.character_maximum_length) {
    sql += `(${column.character_maximum_length})`;
  }

  if (column.type.toUpperCase().includes('NUMBER') && column.numeric_precision && column.numeric_scale) {
    sql += `(${column.numeric_precision},${column.numeric_scale})`;
  }

  sql += column.null_able ? ' NULL' : ' NOT NULL';

  if (column.comments) {
    sql += `; COMMENT ON COLUMN ${tableName}.${column.name} IS '${column.comments}'`;
  }

  return sql + ';';
}