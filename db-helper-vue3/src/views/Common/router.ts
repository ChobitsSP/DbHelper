import { RouteRecordRaw } from "vue-router"

export default [
  {
    path: '',
    name: 'Index',
    component: () => import('./Main/Index.vue')
  },
  {
    path: "example",
    name: "Example",
    component: () => import("./Example/Index.vue")
  },
] as RouteRecordRaw[];