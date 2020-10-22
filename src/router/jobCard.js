import { defineAsyncComponent } from 'vue';

export default [
  {
    name: 'jCLog',
    path: '/jCLog',
    meta: {
      title: '工卡记录',
    },
    component: defineAsyncComponent(() => import('@/views/jobCard/jCLog.vue')),
  },
  {
    name: 'editJCard',
    path: '/editJCard',
    meta: {
      title: '工卡编辑',
    },
    component: defineAsyncComponent(() => import('@/views/jobCard/editJCard.vue')),
  }];
