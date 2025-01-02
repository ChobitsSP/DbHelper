import Vue from 'vue';
import Router from 'vue-router';

import { useVersionCheck } from '../utils/VersionCheck';

import BtTable from '../views/BtTable/router';
import TableUtils from '../views/TableUtils/router';
import OtherUtils from '../views/OtherUtils/router';
import Database from '../views/Database/router';

Vue.use(Router);

const routes = [
  {
    path: '/',
    component: () => import('../components/Home.vue'),
    children: [
      ...TableUtils,
      ...BtTable,
      ...OtherUtils,
      ...Database,
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

router.beforeEach((route, _redirect, next) => {
  document.title = route.meta.title || 'DbTools';
  next();
  useVersionCheck();
});

export function useRoute() {
  return router.currentRoute;
}

export function useRouter() {
  return router;
}

export default router;
