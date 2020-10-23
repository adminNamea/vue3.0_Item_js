import { createRouter, createWebHistory } from 'vue-router';
// 我的工单
import myorder from './myorder';
// 我的工作
import mywork from './mywork';
// 我的审批
import myapproval from './myapproval';
// 工卡系统
import jobCard from './jobCard';
// 油样信息系统
import oilInfo from './oilInfo';

const routes = [
  ...oilInfo,
  ...jobCard,
  ...myorder,
  ...mywork,
  ...myapproval,
  // TAKE5
  {
    name: 'TAKE5',
    path: '/TAKE5',
    meta: {
      title: 'TAKE5列表',
    },
    component: () => import(/* webpackChunkName: "index" */'@/views/TAKE5/index.vue'),
  },
  // 新建工单
  {
    name: 'buildorder',
    path: '/buildorder',
    meta: {
      title: '新建工单',
    },
    component: () => import(/* webpackChunkName: "index" */'@/views/buildorder/index.vue'),
  },
  // 主页
  {
    name: 'index',
    path: '/index',
    meta: {
      title: '派工系统',
    },
    component: () => import(/* webpackChunkName: "index" */'@/views/index.vue'),
  },
  // 登陆页
  {
    name: 'login',
    path: '/',
    meta: {
      title: '登陆授权',
    },
    component: () => import(/* webpackChunkName: "index" */'@/views/login.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
