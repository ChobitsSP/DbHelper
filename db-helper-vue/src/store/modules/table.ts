import { ActionTree, MutationTree, Module } from 'vuex';

import { IColumn } from '@/models/Index';
import * as types from '../mutation-types';
import { TableState as MyState } from '../types';

import { getColumns } from '@/api';

// initial state
const state: MyState = {
  table: '',
  columns: [],
  isHump: false,
};

// actions
const actions: ActionTree<MyState, any> = {
  getColumns: async function (store, data) {
    const list = await getColumns(data, data.table);
    store.commit('SET_COLUMNS', list);
    store.commit('SET_TABLE_NAME', data.table);
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
  actions,
  mutations,
} as Module<MyState, any>;