export default [
  {
    path: '/OtherUtils/Json2Ts',
    component: () => import('./Json2Ts/Index.vue'),
    meta: {
      title: 'Convert Json to Ts',
    },
  },
  {
    path: '/OtherUtils/Csv2Json',
    component: () => import('./Csv2Json/Index.vue'),
    meta: {
      title: 'Convert Csv to Json',
    },
  },
  {
    path: '/OtherUtils/Jar2Pom',
    component: () => import('./Jar2Pom/index.vue'),
    meta: {
      title: 'Jar2Pom',
    },
  },
];