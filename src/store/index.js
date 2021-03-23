import { createStore } from 'vuex';
import dd from 'dingtalk-jsapi';
import http from '../service/http';

let token = process.env.VUE_APP_CS_TOKEN;
sessionStorage.setItem('token', token);
export default createStore({
  state: {
    userName: '',
    avatar: '',
    roleName: '',
    mine_type: 0,
    userId: '',
    isRole: 0,
    is_hk: 0,
  },
  mutations: {
    SET_PROFILE(state, o) {
      state.userName = o.userName;
      state.avatar = o.avatar;
      state.roleName = o.roleName;
      state.mine_type = o.mine_type;
      state.userId = o.userId;
      state.isRole = o.role === 1;
      state.is_hk = o.is_hk;
    },
  },
  actions: {
    setUserInfo({ commit }, user) {
      commit('SET_PROFILE', user);
    },
    async login({ commit }) {
      // eslint-disable-next-line no-restricted-globals
      const res = await http.getConfig({ url: location.href });
      let user = {};
      if (!token) {
        const code = await dd.runtime.permission
          .requestAuthCode({
            corpId: res.corpId,
          }).then((result) => {
            dd.config({
              ...res,
              jsApiList: [
                'device.geolocation.get'
              ]
            });
            return result.code;
          }).catch(() => false);
        if (code) {
          token = (await http.getToken(code)).token;
          sessionStorage.setItem('token', token);
        }
      }
      user = await http.getProfile();
      if (user.userName) {
        commit('SET_PROFILE', user);
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('用户信息获取失败');
      }
    },
  },
});
