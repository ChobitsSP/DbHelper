export default [
  {
    path: "Table/ConfigList",
    component: () => import("./ConfigList/Index.vue"),
    meta: {
      title: "数据库配置"
    }
  },
  {
    path: "Table/TreeList",
    component: () => import("./TreeList/Index.vue"),
    meta: {
      title: "数据库配置"
    }
  },
  {
    path: "Table/TableInfo",
    component: () => import("./TreeList/Index.vue"),
    meta: {
      title: "数据库表详情"
    },
    children: [
      {
        path: ""
      },
      {
        name: "TableInfo2",
        path: ":id([0-9]+)/:name",
        component: () => import("./TableInfo/Index.vue"),
        props: route => {
          const id = parseInt(route.params.id, 10);
          const name = route.params.name;
          return { id, name };
        }
      }
    ]
  }
];
