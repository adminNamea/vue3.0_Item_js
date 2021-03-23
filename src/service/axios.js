import axios from 'axios';
import qs from 'qs';

axios.defaults.timeout = 100000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
const isNoD = false; // process.env.NODE_ENV !== 'development'
axios.defaults.baseURL = `https://${isNoD ? 'internal' : 'dni'}.cel-cat.com.cn/xcadmin/public/index.php/woapi/`;
// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
  // 判断是否存在token，如果存在的话，则每个http header都加上token
  if (sessionStorage.getItem('token')) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Token = sessionStorage.getItem('token');
  }
  // 在发送请求之前做某件事
  if (config.method === 'post') {
    // eslint-disable-next-line no-param-reassign
    config.data = qs.stringify(config.data);
  }
  return config;
}, (error) => Promise.reject(error));

// 返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
  // 判断请求头是否有token，如果有则刷新本地token
  if (res.headers.Token) {
    sessionStorage.setItem('token', res.headers.Token);
  }
  // 对响应数据做些事
  if (!res.data.data) {
    if (res.data.code === 200) {
      return Promise.resolve({ suc: res.suc, ...res.data });
    }
    return Promise.reject(res.data.msg);
  }
  return Promise.resolve(res.data.data);
}, (error) => {
  // eslint-disable-next-line no-console
  console.log(error);
  return Promise.reject(error);
});

// 返回一个Promise(发送post请求)
export default function fetch(url, params) {
  return axios.post(url, params);
}
