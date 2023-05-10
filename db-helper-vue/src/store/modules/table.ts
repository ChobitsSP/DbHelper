import * as types from '../mutation-types';

import { ActionTree, MutationTree } from 'vuex';
import { IColumn } from '@/models/Index';

import axios from '@/utils/AxiosUtils';

interface MyState {
  table: string;
  columns: IColumn[];
  isHump: boolean;
}

// initial state
const state: MyState = {
  table: '',
  columns: [],
  isHump: false,
};

// getters
const getters = {};

// actions
const actions: ActionTree<MyState, any> = {
  getColumns: async function (t, data) {
    const rsp = await axios.post<IColumn[]>('/api/sql/tablecolumns', data);
    if (rsp.code === 0) {
      const list = rsp.data;
      list.forEach((col, i) => {
        col.id = i + 1;
      });
      t.commit('SET_COLUMNS', list);
      t.commit('SET_TABLE_NAME', data.table);
    }
  },
};

// mutations
const mutations: MutationTree<MyState> = {
  [types.SET_TABLE_NAME](state, r: string) {
    state.table = r;
  },
  [types.SET_COLUMNS](state, r: IColumn[]) {
    state.columns = r;
  },
  [types.SET_IS_HUMP](state, r: boolean) {
    state.isHump = r;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
