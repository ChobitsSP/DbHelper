export default [
  {
    path: 'Table/ConfigList',
    component: () => import('./ConfigList/Index.vue'),
    meta: {
      title: '数据库配置',
    },
  },
  {
    path: 'Table/TreeList',
    component: () => import('./TreeList/Index.vue'),
    meta: {
      title: '数据库配置',
    },
  },
  {
    path: 'Table/TableInfoDoc',
    component: () => import('./TableInfoDoc/Index.vue'),
    meta: {
      title: '动态表格',
    },
  },
  {
    path: 'Table/DbCompare',
    component: () => import('./DbCompare/index.vue'),
    meta: {
      title: '数据库差异对比',
    },
  },
  {
    path: '',
    component: () => import('./TableInfo/Index.vue'),
    meta: {
      title: '数据库表详情',
    },
  },
  {
    path: 'Table/TableInfo/:dbId([0-9]+)?',
    component: () => import('./TableInfo/Index.vue'),
    props: (route) => ({ dbId: parseInt(route.params.dbId || '0', 10) }),
    meta: {
      title: '数据库表详情',
    },
  },
];