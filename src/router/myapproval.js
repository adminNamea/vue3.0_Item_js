import { defineAsyncComponent } from 'vue';

export default [
  {
    name: 'cardDetails',
    path: '/myapproval/cardDetails',
    meta: {
      title: '工卡详情',
    },
    component: defineAsyncComponent(() => import('@/views/myapproval/cardDetails.vue')),
  },
  {
    name: 'feesDetails',
    path: '/myapproval/feesDetails',
    meta: {
      title: '费用详情',
    },
    component: defineAsyncComponent(() => import('@/views/myapproval/feesDetails.vue')),
  },
  {
    name: 'approvalDetails',
    path: '/myapproval/approvalDetails',
    meta: {
      title: '审批详情',
    },
    component: defineAsyncComponent(() => import('@/views/myapproval/approvalDetails.vue')),
  },
  {
    name: 'myByOrdey',
    path: '/myapproval/myByOrdey',
    meta: {
      title: '我的审批',
    },
    component: defineAsyncComponent(() => import('@/views/myapproval/myByOrdey.vue')),
  },
  {
    name: 'myByFees',
    path: '/myapproval/myByFees',
    meta: {
      title: '我的费用',
    },
    component: defineAsyncComponent(() => import('@/views/myapproval/myByFees.vue')),
  },
  {
    name: 'orderApproval',
    path: '/myapproval/orderApproval',
    meta: {
      title: '工单审批',
    },
    component: defineAsyncComponent(() => import('@/views/myapproval/orderApproval.vue')),
  },
  {
    name: 'feesApproval',
    path: '/myapproval/feesApproval',
    meta: {
      title: '费用审批',
    },
    component: defineAsyncComponent(() => import('@/views/myapproval/feesApproval.vue')),
  },
  {
    name: 'cardApproval',
    path: '/myapproval/cardApproval',
    meta: {
      title: '工卡审批',
    },
    component: defineAsyncComponent(() => import('@/views/myapproval/cardApproval.vue')),
  },
  {
    name: 'addFees',
    path: '/myapproval/addFees',
    meta: {
      title: '添加费用',
    },
    component: defineAsyncComponent(() => import('@/views/myapproval/addFees.vue')),
  },
  {
    name: 'myapproval',
    path: '/myapproval',
    meta: {
      title: '我的审批',
    },
    component: defineAsyncComponent(() => import('@/views/myapproval/index.vue')),
  }];