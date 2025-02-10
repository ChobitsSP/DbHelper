export default [
  {
    path: 'Database/ExecuteSql',
    component: () => import('./ExecuteSql/index.vue'),
    meta: {
      title: 'ExecuteSql',
    },
  },
  {
    path: 'Database/ImportData',
    component: () => import('./ImportData/index.vue'),
    meta: {
      title: 'ImportData',
    },
  },
];