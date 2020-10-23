export default [
  {
    name: 'oilInfo',
    path: '/oilInfo',
    meta: {
      title: '油样基础录入',
    },
    component: () => import(/* webpackChunkName: "oilInfo" */'@/views/oilInfo/index.vue'),
  },
  {
    name: 'scanCode',
    path: '/scanCode',
    meta: {
      title: '油样基础录入',
    },
    component: () => import(/* webpackChunkName: "oilInfo" */'@/views/oilInfo/scanCode.vue'),
  },
  {
    name: 'oilInfoDetails',
    path: '/oilInfoDetails',
    meta: {
      title: '油样基础录入',
    },
    component: () => import(/* webpackChunkName: "oilInfo" */'@/views/oilInfo/oilInfoDetails.vue'),
  },
];
