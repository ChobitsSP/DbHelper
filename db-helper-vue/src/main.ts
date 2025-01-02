import Vue from 'vue';

Vue.config.devtools = process.env.NODE_ENV !== 'production';

import App from './App.vue';
import store from './store';
import router from './router';
import './utils/axios';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, { size: 'small' });

import * as filters from './filters/Index';
// register global utility filters.
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

import * as directives from './directives';
Object.keys(directives).forEach((key) => {
  Vue.directive(key, directives[key]);
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

(function () {
  const buildTime: string = process.env.VUE_APP_BUILD_TIME;
  if (buildTime) {
    console.log('Build Time:', new Date(parseInt(buildTime, 10)).toLocaleString());
    console.log('Version:', process.env.VUE_APP_VERSION);
  }
})();
