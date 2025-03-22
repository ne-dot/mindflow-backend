import { get, post, put, del } from '../utils/http';

// 工具相关API
const toolApi = {
  // 获取所有工具
  getAllTools:(params) => get(`/api/tools?page=${params.page}&page_size=${params.page_size}`),
  // 获取单个工具
  getTool: (id) => get(`/api/tools/${id}`),
  // 创建工具
  createTool: (data) => post('/api/tools', data),
  // 更新工具
  updateTool: (id, data) => put(`/api/tools/${id}`, data),
  // 删除工具
  deleteTool: (id) => del(`/api/tools/${id}`),
  // 获取工具类型
  getToolTypes: () => get('/api/tools/types')
};

// 将新方法添加到导出对象中
export default toolApi;

