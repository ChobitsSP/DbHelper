import { computed } from 'vue';
import store from './index';
import { IColumn } from '../models/Index';

export function useMainStore() {
  /** 列信息 */
  const columns = computed<IColumn[]>(() => store.state.table.columns);

  /** 数据库连接信息 */
  const coninfo = computed(() => store.state.user.coninfo);

  /** 表名称 */
  const tableName = computed<string>(() => store.state.table.table);

  const isHump = computed<boolean>(() => store.state.table.isHump);

  return {
    coninfo,
    columns,
    tableName,
    isHump,
  };
}