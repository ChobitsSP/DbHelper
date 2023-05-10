import { computed } from 'vue';
import store from './index';
import { IColumn } from '../models/Index';

export function useMainStore() {
  /** 列信息 */
  const columns = computed<IColumn[]>(() => store.state.table.columns);

  /** 数据库连接信息 */
  const coninfo = computed(() => store.state.user.coninfo);

  return {
    coninfo,
    columns,
  };
}