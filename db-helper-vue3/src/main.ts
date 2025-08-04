import { createApp } from 'vue';

import App from './App.vue';
import router from './router'

const app = createApp(App).use(router);

import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css';
app.use(ElementPlus);

import { InitVxeConfig } from './utils/VxeTableConfig';
InitVxeConfig();

import VxeUIAll from 'vxe-pc-ui';
import 'vxe-pc-ui/es/style.css';
app.use(VxeUIAll);

import VxeUITable from 'vxe-table';
import 'vxe-table/es/style.css';
app.use(VxeUITable);

import * as filters from './filters';
app.config.globalProperties.$filters = {};
// register global utility filters.
Object.keys(filters).forEach((key) => {
  app.config.globalProperties.$filters[key] = filters[key];
});

import * as directives from './directives';
// register global directives.
Object.keys(directives).forEach((key) => {
  app.directive(key, directives[key]);
});

app.mount('#app');

(function () {
  const buildTime: string = process.env.VUE_APP_BUILD_TIME;
  if (buildTime) {
    console.log('Build Time:', new Date(parseInt(buildTime, 10)).toLocaleString());
    console.log('Version:', process.env.VUE_APP_VERSION);
  }
})();
