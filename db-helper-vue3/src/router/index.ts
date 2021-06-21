import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

import Common from "../views/Common/router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/components/Home.vue"),
    children: [
      ...Common,
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// router.beforeEach((to, from, next) => {
// 	next()
// })

export default router;