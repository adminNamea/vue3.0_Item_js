export default [
  {
    name: 'details',
    path: '/myorder/details',
    meta: {
      title: '工位详情',
    },
    component: () => import(/* webpackChunkName: "myorder" */'@/views/myorder/details.vue'),
  },
  {
    name: 'addStationList',
    path: '/myorder/addStationList',
    component: () => import(/* webpackChunkName: "myorder" */'@/views/myorder/addStationList.vue'),
  },
  {
    name: 'stationList',
    path: '/myorder/stationList',
    meta: {
      title: '大修工位列表',
    },
    component: () => import(/* webpackChunkName: "myorder" */'@/views/myorder/stationList.vue'),
  },
  {
    name: 'replaceRecord',
    path: '/myorder/replaceRecord',
    component: () => import(/* webpackChunkName: "myorder" */'@/views/myorder/replaceRecord.vue'),
  },
  {
    name: 'orderInfo',
    path: '/myorder/orderInfo',
    meta: {
      title: '工单信息',
    },
    component: () => import(/* webpackChunkName: "myorder" */'@/views/myorder/orderInfo.vue'),
  },
  {
    name: 'myorder',
    path: '/myorder',
    meta: {
      title: '我的工单',
    },
    component: () => import(/* webpackChunkName: "myorder" */'@/views/myorder/index.vue'),
  },
];
