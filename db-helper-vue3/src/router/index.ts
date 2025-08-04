import { createRouter, createWebHistory } from 'vue-router';

import Common from '../views/Common/router';
import Test from '../views/Test/router';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    ...Common,
    ...Test,
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/Common/NotFound/index.vue'),
      props: true,
    },
  ],
});

export default router;