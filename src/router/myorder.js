import { defineAsyncComponent } from 'vue';

export default [
  {
    name: 'details',
    path: '/myorder/details',
    meta: {
      title: '工位详情',
    },
    component: defineAsyncComponent(() => import('@/views/myorder/details.vue')),
  },
  {
    name: 'addStationList',
    path: '/myorder/addStationList',
    component: defineAsyncComponent(() => import('@/views/myorder/addStationList.vue')),
  },
  {
    name: 'stationList',
    path: '/myorder/stationList',
    meta: {
      title: '大修工位列表',
    },
    component: defineAsyncComponent(() => import('@/views/myorder/stationList.vue')),
  },
  {
    name: 'replaceRecord',
    path: '/myorder/replaceRecord',
    component: defineAsyncComponent(() => import('@/views/myorder/replaceRecord.vue')),
  },
  {
    name: 'orderInfo',
    path: '/myorder/orderInfo',
    meta: {
      title: '工单信息',
    },
    component: defineAsyncComponent(() => import('@/views/myorder/orderInfo.vue')),
  },
  {
    name: 'myorder',
    path: '/myorder',
    meta: {
      title: '我的工单',
    },
    component: defineAsyncComponent(() => import('@/views/myorder/index.vue')),
  },
];
