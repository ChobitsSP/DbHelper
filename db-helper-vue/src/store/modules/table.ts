import * as types from '../mutation-types';

import { ActionTree, MutationTree } from 'vuex';
import { IColumn } from '@/models/Index';

import axios from '@/utils/AxiosUtils';

interface MyState {
  table: string;
  columns: IColumn[];
}

// initial state
const state: MyState = {
  table: '',
  columns: [],
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
let mutations: MutationTree<MyState> = {};

mutations[types.SET_TABLE_NAME] = function (state, r: string) {
  state.table = r;
};

mutations[types.SET_COLUMNS] = function (state, r: any[]) {
  state.columns = r;
};

export default {
  state,
  getters,
  actions,
  mutations,
};
