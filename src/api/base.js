import axios from 'axios';

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin-Type': '*',
  },
  baseURL: 'http://localhost:3001/',
  timeout: 20000,
  validateStatus(status) {
    return status >= 200 && status < 600;
  },
  // 表示跨域请求时是否需要使用凭证
  // withCredentials: true,
});

instance.interceptors.request.use(config => {
  if (localStorage.getItem('token')) {
    config.headers.token = localStorage.getItem('token');
  }
  error => {
    return Promise.reject(error);
  };
  return config;
});
instance.interceptors.response.use(
  config => {
    if (config.status === 401) {
      return Promise.reject(config);
    }
    return config;
  },
  error => {
    console.log(error);
  }
);
export default instance;
