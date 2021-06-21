import Vue from 'vue';
import Router from 'vue-router';

//import Table from "../views/Table/router";
import BtTable from '../views/BtTable/router.js';
import TableUtils from '../views/TableUtils/router.js';
import OtherUtils from '../views/OtherUtils/router.js';

Vue.use(Router);

const routes = [
  {
    path: '/',
    component: () => import('../components/Home.vue'),
    children: [
      {
        path: '',
        name: 'index',
        redirect: '/Table/TableInfo',
        // component: () => import("../views/Index.vue"),
        // meta: {
        //   noauth: true
        // }
      },
      ...BtTable,
      //...Table,
      ...TableUtils,
      ...OtherUtils,
    ],
  },
];

const router = new Router({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    return { x: 0, y: 0 };
  },
});

router.beforeEach((route, redirect, next) => {
  document.title = route.meta.title || 'element-demo';
  next();
});

export default router;
