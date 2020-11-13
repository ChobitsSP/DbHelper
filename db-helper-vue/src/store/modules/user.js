import * as types from "../mutation-types";
import qs from "qs";

// initial state
const state = {
  info: null,
  coninfo: null
};

// getters
const getters = {};

// actions
const actions = {
  async GetUserInfo(store) {}
};

// mutations
let mutations = {};

mutations[types.SET_CONINFO] = function(state, r) {
  state.coninfo = r;
};

export default {
  state,
  getters,
  actions,
  mutations
};
