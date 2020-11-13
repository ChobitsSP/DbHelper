import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

import table from './modules/table'
import user from './modules/user'

Vue.config.devtools = process.env.NODE_ENV !== 'production'

// [vuex] already installed. Vue.use(Vuex) should be called only once.
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    user,
    table
  },
  strict: debug,
  plugins: []
})
