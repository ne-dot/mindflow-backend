import { get, post, put, del } from '../utils/http';

// 工具相关API
const toolApi = {
  // 获取所有工具
  getAllTools: async (params = {}) => {
    const { page = 1, page_size = 10 } = params;
    try {
      const response = await get(`/api/tools?page=${page}&page_size=${page_size}`);
      
      return response;
    } catch (error) {
      console.error('获取工具列表失败:', error);
      throw error;
    }
  },
  
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
