import { defineAsyncComponent } from 'vue';

export default [
  {
    name: 'partsProblem',
    path: '/mywork/partsProblem',
    meta: {
      title: '零件问题',
    },
    component: defineAsyncComponent(() => import('@/views/mywork/report/partsProblem/index.vue')),
  },
  {
    name: 'report',
    path: '/mywork/report',
    component: defineAsyncComponent(() => import('@/views/mywork/report/index.vue')),
  },
  {
    name: 'take5',
    path: '/mywork/take5',
    meta: {
      title: '安全五步法',
    },
    component: defineAsyncComponent(() => import('@/views/mywork/take5.vue')),
  },
  {
    name: 'mywork',
    path: '/mywork',
    meta: {
      title: '我的工作',
    },
    component: defineAsyncComponent(() => import('@/views/mywork/index.vue')),
  },
  {
    name: 'fillInfo',
    path: '/mywork/fillInfo',
    meta: {
      title: '补充信息',
    },
    component: defineAsyncComponent(() => import('@/views/mywork/fillInfo.vue')),
  },
  {
    name: 'serviceLog',
    path: '/mywork/serviceLog',
    meta: {
      title: '维修日志',
    },
    component: defineAsyncComponent(() => import('@/views/mywork/serviceLog.vue')),
  },
  {
    name: 'parts',
    path: '/mywork/parts',
    meta: {
      title: '额外零件申请',
    },
    component: defineAsyncComponent(() => import('@/views/mywork/parts.vue')),
  },
  {
    name: 'orderProject',
    path: '/mywork/orderProject',
    meta: {
      title: '工单项目',
    },
    component: defineAsyncComponent(() => import('@/views/mywork/orderProject.vue')),
  },
  {
    name: 'prompt',
    path: '/mywork/prompt',
    meta: {
      title: '温馨提示',
    },
    component: defineAsyncComponent(() => import('@/views/mywork/prompt.vue')),
  },
  {
    name: 'workDetails',
    path: '/mywork/workDetails',
    meta: {
      title: '工作详情',
    },
    component: defineAsyncComponent(() => import('@/views/mywork/workDetails.vue')),
  },
];
