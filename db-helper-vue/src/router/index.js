import Vue from "vue";
import Router from "vue-router";

//import Table from "../views/Table/router";
import BtTable from "../views/BtTable/router.js";
import TableUtils from "../views/TableUtils/router.js";

Vue.use(Router);

const routes = [
  {
    path: "/",
    component: resolve => require(["../components/Home.vue"], resolve),
    children: [
      {
        path: "",
        name: "index",
        redirect: "/Table/TableInfo"
        // component: resolve => require(["../views/Index.vue"], resolve),
        // meta: {
        //   noauth: true
        // }
      },
      ...BtTable,
      //...Table,
      ...TableUtils
    ]
  }
];

const router = new Router({
  mode: "history",
  routes,
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    return { x: 0, y: 0 };
  }
});

router.beforeEach((route, redirect, next) => {
  document.title = route.meta.title || "element-demo";
  next();
});

export default router;
