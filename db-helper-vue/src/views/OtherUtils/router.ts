export default [
  {
    path: '/OtherUtils/Json2Ts',
    component: (resolve) => require(['./Json2Ts/Index.vue'], resolve),
    meta: {
      title: 'Json2Ts',
    },
  },
  {
    path: '/OtherUtils/Csv2Json',
    component: (resolve) => require(['./Csv2Json/Index.vue'], resolve),
    meta: {
      title: 'Csv2Json',
    },
  },
];
