import { createRouter, createWebHashHistory } from "vue-router"

const routes: any[] = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../components/HelloWorld.vue')
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   component: () => import("../views/About.vue")
  // },
  // {
  //   path: "/example",
  //   name: "Example",
  //   component: () => import("../views/Example.vue")
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// router.beforeEach((to, from, next) => {
// 	next()
// })

export default router;