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
    name: 'TableInfo',
    path: 'Table/TableInfo',
    component: () => import('./TableInfo/Index.vue'),
    meta: {
      title: '数据库表详情',
    },
  },
];