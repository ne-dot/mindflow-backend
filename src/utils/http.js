import axios from 'axios';
import { message } from 'antd';
import ENV from '../config/env';
import store from '../store';
import { logout } from '../store/slices/authSlice';

// 创建axios实例
const instance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 从Redux获取token
    const { auth } = store.getState();
    
    // 如果有token则添加到请求头
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 处理错误响应
    if (error.response) {
      // 服务器返回了错误状态码
      const { status, data } = error.response;
      
      // 处理401未授权错误
      if (status === 401) {
        // 使用Redux action登出
        store.dispatch(logout());
        
        // 重定向到登录页
        window.location.href = '/login';
        message.error('登录已过期，请重新登录');
      } else {
        // 显示错误信息
        message.error(data?.detail || '请求失败');
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      message.error('服务器无响应，请检查网络连接');
    } else {
      // 请求配置出错
      message.error('请求错误: ' + error.message);
    }
    
    return Promise.reject(error);
  }
);

// 封装GET请求
export const get = (url, params = {}) => {
  return instance.get(url, { params });
};

// 封装POST请求
export const post = (url, data = {}) => {
  return instance.post(url, data);
};

// 封装PUT请求
export const put = (url, data = {}) => {
  return instance.put(url, data);
};

// 封装DELETE请求
export const del = (url) => {
  return instance.delete(url);
};

// 导出默认对象
export default {
  get,
  post,
  put,
  delete: del,
};