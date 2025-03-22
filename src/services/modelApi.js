import { get, post, put, del } from '../utils/http';

// 获取所有模型配置
const getAllModelConfigs = async (params = {}) => {
  try {
    return await get('/api/model-configs', params);
  } catch (error) {
    console.error('获取模型配置列表失败:', error);
    throw error;
  }
};

// 创建模型配置
const createModelConfig = async (modelData) => {
  try {
    return await post('/api/model-configs', modelData);
  } catch (error) {
    console.error('创建模型配置失败:', error);
    throw error;
  }
};

// 更新模型配置
const updateModelConfig = async (id, modelData) => {
  try {
    return await put(`/api/model-configs/${id}`, modelData);
  } catch (error) {
    console.error('更新模型配置失败:', error);
    throw error;
  }
};

// 删除模型配置
const deleteModelConfig = async (id) => {
  try {
    return await del(`/api/model-configs/${id}`);
  } catch (error) {
    console.error('删除模型配置失败:', error);
    throw error;
  }
};

const modelApi = {
  getAllModelConfigs,
  createModelConfig,
  updateModelConfig,
  deleteModelConfig
};

export default modelApi;