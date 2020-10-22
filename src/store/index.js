import { createStore } from 'vuex';
import dd from 'dingtalk-jsapi';
import http from '../service/http';

export default createStore({
  state: {
    userName: '',
    avatar: '',
    roleName: '',
    mine_type: 0,
    userId: '',
  },
  mutations: {
    SET_PROFILE(state, o) {
      state.userName = o.userName;
      state.avatar = o.avatar;
      state.roleName = o.roleName;
      state.mine_type = o.mine_type;
      state.userId = o.userId;
    },
  },
  actions: {
    setUserInfo({ commit }, user) {
      commit('SET_PROFILE', user);
    },
    async login({ commit }) {
      // eslint-disable-next-line no-restricted-globals
      const res = await http.getConfig({ url: location.href });
      const code = await dd.runtime.permission
        .requestAuthCode({
          corpId: res.corpId,
        }).then((result) => result.code).catch(() => true);
      const data = await http.getToken(code);
      if (data.userName) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('code', code);
        commit('SET_PROFILE', data);
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('用户信息获取失败');
      }
      return data;
    },
  },
});
