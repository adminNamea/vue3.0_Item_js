export default [
  {
    name: 'jCLog',
    path: '/jCLog',
    meta: {
      title: '工卡记录',
    },
    component: () => import(/* webpackChunkName: "jobCard" */'@/views/jobCard/jCLog.vue'),
  },
  {
    name: 'editJCard',
    path: '/editJCard',
    meta: {
      title: '工卡编辑',
    },
    component: () => import(/* webpackChunkName: "jobCard" */'@/views/jobCard/editJCard.vue'),
  }];
