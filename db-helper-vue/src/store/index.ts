import Vue from 'vue';
import Vuex from 'vuex';

import table from './modules/table';
import user from './modules/user';

import { RootState } from './types';

Vue.config.devtools = process.env.NODE_ENV !== 'production';

// [vuex] already installed. Vue.use(Vuex) should be called only once.
Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  modules: {
    user,
    table,
  },
});
