import { IColumn } from '@/models/Index';
import store from '@/store';
import * as Data from '@/data';

export default function (tableName: string, cols: IColumn[]) {
  const providerName = store.state.user.coninfo.providerName;
  const dbType = Data.DbTypes.find(t => t.value === providerName).label;

  let list: string[] = [];

  if (dbType === Data.DbTypeMySql) {
    list = cols.map(t => GetMySqlAlertSql(tableName, t));
  }
  else if (dbType === Data.DbTypeMsSql) {
    list = cols.map(t => GetMsSqlAlertSql(tableName, t));
  }
  else if (dbType === Data.DbTypeNpgsql) {
    list = cols.map(t => GetNpgsqlAlertSql(tableName, t));
  }
  else if (dbType === Data.DbTypeOracle) {
    // ::todo 之后再做
  }

  return list.join("\r\n");
}

function GetMsSqlAlertSql(tableName: string, column: IColumn) {
  return '';
}

function GetMySqlAlertSql(tableName: string, column: IColumn) {
  return '';
}

function GetNpgsqlAlertSql(tableName: string, column: IColumn) {
  return '';
}