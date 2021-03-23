import Vant, { Dialog } from 'vant';
import createApp from './crVue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'vant/lib/index.css';
import plugin, { zisf } from './plugin';

function tran() {
  return zisf(store.state.is_hk, this);
}
// eslint-disable-next-line no-extend-native
String.prototype.tran = tran;
const app = createApp(App);
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
app
  .use(store)
  .use(router)
  .use(Vant)
  .use(plugin)
  .mount(document.querySelector('#app'));
