// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';

Vue.config.devtools = process.env.NODE_ENV !== 'production';

import App from './App';
import store from './store';
import router from './router';

import * as filters from './filters/Index';
import Vue2Filters from 'vue2-filters';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './assets/app.css';
import './utils/axios';

import Rx from 'rxjs';
import VueRx from 'vue-rx';

Vue.use(ElementUI);
Vue.use(Vue2Filters);
Vue.use(VueRx, Rx);

// register global utility filters.
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

import 'xe-utils';
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';
import '/src/assets/print.css';
Vue.use(VXETable);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
