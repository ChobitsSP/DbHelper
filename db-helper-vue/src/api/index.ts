import http from '@/utils/AxiosUtils';
import { IColumn } from '@/models/Index';

interface DbConfig {
  providerName: string;
  connectionString: string;
}

/**
 * 获取数据库列信息
 * @param config 
 * @param table 为空则查询所有表
 * @returns 
 */
export async function getColumns(config: DbConfig, table?: string) {
  const rsp = await http.post<IColumn[]>('/api/sql/tablecolumns', {
    ...config,
    table,
  });
  if (rsp.code !== 0) throw new Error(rsp.msg);
  const list = rsp.data;
  list.forEach((col, i) => {
    col.id = i + 1;
    // if (table) {
    //   col.table = table;
    // }
  });
  return list;
}

/**
 * 获取数据库表名
 * @param config 
 * @returns 
 */
export async function getTables(config: DbConfig) {
  const rsp = await http.post<string[]>('/api/sql/tablenames', config);
  if (rsp.code !== 0) throw new Error(rsp.msg);
  return rsp.data;
}
