const routes = [
  {
    path: 'TableInfo/:table',
    name: 'TableInfo',
    component: resolve => require(['./views/TableInfo'], resolve),
  },
  {
    path: 'TableList',
    name: 'TableList',
    component: resolve => require(['./views/TableList'], resolve),
  }
]

export default routes
