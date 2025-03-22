import { get, post, put, del } from '../utils/http';

// 工具相关API
const toolApi = {
  // 获取所有工具
  getAllTools: () => get('/api/tools'),
  
  // 获取单个工具
  getTool: (id) => get(`/api/tools/${id}`),
  
  // 创建工具
  createTool: (data) => post('/api/tools', data),
  
  // 更新工具
  updateTool: (id, data) => put(`/api/tools/${id}`, data),
  
  // 删除工具
  deleteTool: (id) => del(`/api/tools/${id}`),
};

export default toolApi;