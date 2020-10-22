import { createApp } from 'vue';
import OSS from 'ali-oss';
import lrz from 'lrz';
import Vant, { Dialog } from 'vant';
import App from './App.vue';
import router from './router';
import store from './store';
import http from './service/http';
import 'vant/lib/index.css';

const app = createApp(App);
app.config.globalProperties.$api = http;
app.config.globalProperties.filterTime = (e = 0, f = 'YYYY-mm-dd HH:MM') => {
  let ret;
  let fmt = f;
  const date = new Date(e);
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  Object.keys(opt).forEach((k) => {
    ret = new RegExp(`(${k})`).exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')));
    }
  });
  return fmt;
};
router.beforeEach((to, _from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
  if (store.state.userName) {
    if (to.name === 'login') {
      next('/index');
    } else {
      next();
    }
  } else if (to.name !== 'login') {
    store.dispatch('login').then(() => {
      next();
    }).catch((message) => {
      Dialog({ message });
    });
  } else {
    next();
  }
});
app.config.globalProperties.putOSS = async (v) => {
  const oss = await http.getOssConfig()
    .then((res) => ({
      accessKeyId: res.AccessKeyId,
      accessKeySecret: res.AccessKeySecret,
      timeout: 10000,
      region: 'oss-cn-shenzhen',
      stsToken: res.SecurityToken,
      bucket: res.bucket,
      objPath: res.objPath,
      secure: true,
    }))
    .catch((message) => Dialog({ message }));
  const date = new Date();
  const rst = (await lrz(v.file, { quality: 0.97 })).file;
  const y = date.getFullYear().toString();
  const m = (date.getMonth() + 1);
  const d = date.getDate().toString();
  const h = date.getHours().toString();
  const M = date.getMinutes().toString();
  const s = date.getSeconds().toString();
  // eslint-disable-next-line no-bitwise
  const name = `${oss.objPath}spotImg/${y}${m}${d}${h}${M}${s}${(Math.random() * 100) | 0}.png`;
  const res = await new OSS(oss)
    .put(name, rst)
    .catch((message) => {
      Dialog({ message });
      return false;
    });
  return res && res.name.replace(oss.objPath, '');
};
app.config.globalProperties.delOSS = async (name) => {
  if (!name || name.length === 0) {
    return false;
  }
  const oss = await http.getOssConfig()
    .then((res) => ({
      accessKeyId: res.AccessKeyId,
      accessKeySecret: res.AccessKeySecret,
      timeout: 10000,
      stsToken: res.SecurityToken,
      region: 'oss-cn-shenzhen',
      bucket: res.bucket,
      secure: true,
      objPath: res.objPath,
    }))
    .catch((message) => Dialog({ message }));
  if (typeof name === 'string') {
    return new OSS(oss)
      .delete(oss.objPath + name)
      .catch((message) => {
        Dialog({ message });
        return false;
      });
  }
  return new OSS(oss)
    .deleteMulti(name.map((path) => oss.objPath + path))
    .catch((message) => {
      Dialog({ message });
      return false;
    });
};
app
  .use(store)
  .use(router)
  .use(Vant).mount('#app');
