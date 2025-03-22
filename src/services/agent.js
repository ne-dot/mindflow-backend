import { get, post, put, del } from '../utils/http';

// Then update all api references to agentApi in your functions

export const getAgents = async (params) => {
  return get('/api/agents', { params });
};

export const createAgent = async (data) => {
  return post('/api/agents', data);
};

export const updateAgent = async (id, data) => {
  return put(`/api/agents/${id}`, data);
};

export const deleteAgent = async (id) => {
  return del(`/api/agents/${id}`);
};