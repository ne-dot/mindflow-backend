import { get, post, put, del } from '../utils/http';

// Then update all api references to agentApi in your functions

export const getAgents = async (params) => {
  const page = params.page || 1;
  const page_size = params.page_size || 10;
  return get(`/api/agents?page=${page}&page_size=${page_size}`);
};

// 创建Agent
export const createAgent = async (agentData) => {
  return post('/api/agents/create', agentData);
};

// 更新Agent
export const updateAgent = async (id, agentData) => {
  return put(`/api/agents/${id}`, agentData);
};

export const deleteAgent = async (id) => {
  return del(`/api/agents/${id}`);
};

// 添加获取可见性选项的函数
export const getVisibilityOptions = async () => {
  return get('/api/agents/visibility/options');
};

// 添加获取状态选项的函数
export const getStatusOptions = async () => {
  return get('/api/agents/status/options');
};

// 获取 Agent 的工具列表
export const  getAgentTools = async (agentId) => {
  return get(`/api/agents/${agentId}/tools`);
};

// 获取Agent的模型配置
export const getAgentModel = async (agentId) => {
  return get(`/api/agents/${agentId}/models`);
};
