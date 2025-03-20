import { message } from 'antd';
import axios from 'axios';

import ENV from '../config/env';

// Create axios instance
const instance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
instance.interceptors.request.use(
  config => {
    // Get token from localStorage instead of Redux store
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        // Clear tokens from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        // Redirect to login page
        window.location.href = '/login';
        message.error('登录已过期，请重新登录');
      } else {
        message.error(data?.detail || '请求失败');
      }
    } else if (error.request) {
      message.error('服务器无响应，请检查网络连接');
    } else {
      message.error('请求错误: ' + error.message);
    }
    return Promise.reject(error);
  }
);

// Export request methods
export const get = (url, params = {}) => {
  return instance.get(url, { params });
};

export const post = (url, data = {}) => {
  return instance.post(url, data);
};

export const put = (url, data = {}) => {
  return instance.put(url, data);
};

export const del = url => {
  return instance.delete(url);
};

// Create a named export object
const httpClient = {
  get,
  post,
  put,
  delete: del,
};

export default httpClient;
