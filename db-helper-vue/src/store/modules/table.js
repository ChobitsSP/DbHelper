import * as types from '../mutation-types';

import Vue from 'vue';
import axios from 'axios';

// initial state
const state = {
  table: '',
  columns: [],
};

// getters
const getters = {};

// actions
const actions = {
  getColumns: async function(t, data) {
    const rsp = await axios.post('/api/sql/tablecolumns', data);

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
let mutations = {};

mutations[types.SET_TABLE_NAME] = function(state, r) {
  state.table = r;
};

mutations[types.SET_COLUMNS] = function(state, r) {
  state.columns = r;
};

export default {
  state,
  getters,
  actions,
  mutations,
};
