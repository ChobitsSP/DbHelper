import { MutationTree, Module } from 'vuex';

import * as types from '../mutation-types';
import { UserState as MyState } from '../types';

// initial state
const state: MyState = {
  coninfo: null
};

// mutations
let mutations: MutationTree<MyState> = {};

mutations[types.SET_CONINFO] = function (state, r) {
  state.coninfo = r;
};

export default {
  state,
  mutations
} as Module<MyState, any>;