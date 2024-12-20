import Vue from 'vue';

Vue.config.devtools = process.env.NODE_ENV !== 'production';

import App from './App.vue';
import store from './store';
import router from './router';
import './utils/axios';

import Rx from 'rxjs';
import VueRx from 'vue-rx';
Vue.use(VueRx, Rx);

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import * as filters from './filters/Index';

// register global utility filters.
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

import VxeUI from 'vxe-pc-ui';
import 'vxe-pc-ui/lib/style.css';
import VxeUITable from 'vxe-table';
import 'vxe-table/lib/style.css';
import { InitVxeConfig } from './mixins/VxeTableConfig';
Vue.use(VxeUI);
Vue.use(VxeUITable);
InitVxeConfig();

import './assets/app.css';

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
