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
    path: '/OtherUtils/Csv2NetClass',
    component: () => import('./Csv2NetClass/Index.vue'),
    meta: {
      title: 'Convert Csv to C# Class',
    },
  },
  {
    path: '/OtherUtils/Jar2Pom',
    component: () => import('./Jar2Pom/index.vue'),
    meta: {
      title: 'Jar2Pom',
    },
  },
  {
    path: '/OtherUtils/PasswordGenerator',
    component: () => import('./PasswordGenerator/index.vue'),
    meta: {
      title: 'PasswordGenerator',
    },
  },
  {
    path: '/OtherUtils/FileUpload',
    component: () => import('./FileUpload/index.vue'),
    meta: {
      title: 'FileUpload',
    },
  },
];