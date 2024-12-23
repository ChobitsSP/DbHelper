export default [
  {
    path: '/OtherUtils/Json2Ts',
    component: () => import('./Json2Ts/Index.vue'),
    meta: {
      title: 'Json2Ts',
    },
  },
  {
    path: '/OtherUtils/Csv2Json',
    component: () => import('./Csv2Json/Index.vue'),
    meta: {
      title: 'Csv2Json',
    },
  },
];