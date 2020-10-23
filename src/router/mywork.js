export default [
  {
    name: 'partsProblem',
    path: '/mywork/partsProblem',
    meta: {
      title: '零件问题',
    },
    component: () => import(/* webpackChunkName: "mywork" */'@/views/mywork/report/partsProblem/index.vue'),
  },
  {
    name: 'report',
    path: '/mywork/report',
    component: () => import(/* webpackChunkName: "mywork" */'@/views/mywork/report/index.vue'),
  },
  {
    name: 'take5',
    path: '/mywork/take5',
    meta: {
      title: '安全五步法',
    },
    component: () => import(/* webpackChunkName: "mywork" */'@/views/mywork/take5.vue'),
  },
  {
    name: 'mywork',
    path: '/mywork',
    meta: {
      title: '我的工作',
    },
    component: () => import(/* webpackChunkName: "mywork" */'@/views/mywork/index.vue'),
  },
  {
    name: 'fillInfo',
    path: '/mywork/fillInfo',
    meta: {
      title: '补充信息',
    },
    component: () => import(/* webpackChunkName: "mywork" */'@/views/mywork/fillInfo.vue'),
  },
  {
    name: 'serviceLog',
    path: '/mywork/serviceLog',
    meta: {
      title: '维修日志',
    },
    component: () => import(/* webpackChunkName: "mywork" */'@/views/mywork/serviceLog.vue'),
  },
  {
    name: 'parts',
    path: '/mywork/parts',
    meta: {
      title: '额外零件申请',
    },
    component: () => import(/* webpackChunkName: "mywork" */'@/views/mywork/parts.vue'),
  },
  {
    name: 'orderProject',
    path: '/mywork/orderProject',
    meta: {
      title: '工单项目',
    },
    component: () => import(/* webpackChunkName: "mywork" */'@/views/mywork/orderProject.vue'),
  },
  {
    name: 'prompt',
    path: '/mywork/prompt',
    meta: {
      title: '温馨提示',
    },
    component: () => import(/* webpackChunkName: "mywork" */'@/views/mywork/prompt.vue'),
  },
  {
    name: 'workDetails',
    path: '/mywork/workDetails',
    meta: {
      title: '工作详情',
    },
    component: () => import(/* webpackChunkName: "mywork" */'@/views/mywork/workDetails.vue'),
  },
];
