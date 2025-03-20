import { API_PATHS } from '../constants/apiPaths';
import http from '../utils/http';

// 用户相关API
export const userApi = {
  // 管理员登录
  adminLogin: data => {
    return http.post(API_PATHS.USER.ADMIN_LOGIN, data);
  },

  // 获取用户资料
  getProfile: () => {
    return http.get(API_PATHS.USER.GET_PROFILE);
  },

  // 更新用户资料
  updateProfile: data => {
    return http.put(API_PATHS.USER.UPDATE_PROFILE, data);
  },
};

// Agent相关API
export const agentApi = {
  // 获取Agent列表
  getList: () => {
    return http.get(API_PATHS.AGENT.LIST);
  },

  // 创建Agent
  create: data => {
    return http.post(API_PATHS.AGENT.CREATE, data);
  },

  // 更新Agent
  update: (id, data) => {
    const url = API_PATHS.AGENT.UPDATE.replace(':id', id);
    return http.put(url, data);
  },

  // 删除Agent
  delete: id => {
    const url = API_PATHS.AGENT.DELETE.replace(':id', id);
    return http.delete(url);
  },
};

// 工具相关API
export const toolApi = {
  // 获取工具列表
  getList: () => {
    return http.get(API_PATHS.TOOL.LIST);
  },

  // 创建工具
  create: data => {
    return http.post(API_PATHS.TOOL.CREATE, data);
  },

  // 更新工具
  update: (id, data) => {
    const url = API_PATHS.TOOL.UPDATE.replace(':id', id);
    return http.put(url, data);
  },

  // 删除工具
  delete: id => {
    const url = API_PATHS.TOOL.DELETE.replace(':id', id);
    return http.delete(url);
  },
};

// 模型相关API
export const modelApi = {
  // 获取模型列表
  getList: () => {
    return http.get(API_PATHS.MODEL.LIST);
  },

  // 创建模型
  create: data => {
    return http.post(API_PATHS.MODEL.CREATE, data);
  },

  // 更新模型
  update: (id, data) => {
    const url = API_PATHS.MODEL.UPDATE.replace(':id', id);
    return http.put(url, data);
  },

  // 删除模型
  delete: id => {
    const url = API_PATHS.MODEL.DELETE.replace(':id', id);
    return http.delete(url);
  },
};

// Prompt相关API
export const promptApi = {
  // 获取Prompt列表
  getList: () => {
    return http.get(API_PATHS.PROMPT.LIST);
  },

  // 创建Prompt
  create: data => {
    return http.post(API_PATHS.PROMPT.CREATE, data);
  },

  // 更新Prompt
  update: (id, data) => {
    const url = API_PATHS.PROMPT.UPDATE.replace(':id', id);
    return http.put(url, data);
  },

  // 删除Prompt
  delete: id => {
    const url = API_PATHS.PROMPT.DELETE.replace(':id', id);
    return http.delete(url);
  },
};
