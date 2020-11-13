export default [
  {
    path: "Table/ConfigList",
    component: resolve => require(["./ConfigList/Index.vue"], resolve),
    meta: {
      title: "数据库配置"
    }
  },
  {
    path: "Table/TreeList",
    component: resolve => require(["./TreeList/Index.vue"], resolve),
    meta: {
      title: "数据库配置"
    }
  },
  {
    path: "Table/TableInfo",
    component: resolve => require(["./TreeList/Index.vue"], resolve),
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
        component: resolve => require(["./TableInfo/Index.vue"], resolve),
        props: route => {
          const id = parseInt(route.params.id, 10);
          const name = route.params.name;
          return { id, name };
        }
      }
    ]
  }
];
