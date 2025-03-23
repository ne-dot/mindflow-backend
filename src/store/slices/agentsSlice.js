import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getAgents, createAgent, updateAgent, deleteAgent, getVisibilityOptions, getStatusOptions } from '../../services/agent';

// 异步Action: 获取Agent列表
export const fetchAgents = createAsyncThunk(
  'agents/fetchAgents',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getAgents(params);
      if (response.data && response.success) {
        return {
          agents: response.data.agents,
          pagination: response.data.pagination
        };
      } else {
        return rejectWithValue(response.data?.message || '获取Agent列表失败');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 异步Action: 创建Agent
export const createAgentConfig = createAsyncThunk(
  'agents/createAgent',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createAgent(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 异步Action: 更新Agent
export const updateAgentConfig = createAsyncThunk(
  'agents/updateAgent',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateAgent(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 异步Action: 删除Agent
export const deleteAgentConfig = createAsyncThunk(
  'agents/deleteAgent',
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteAgent(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 添加获取可见性选项的异步 action
export const fetchVisibilityOptions = createAsyncThunk(
  'agents/fetchVisibilityOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getVisibilityOptions();
      if (response.success) {
        return response.data.options;
      } else {
        return rejectWithValue(response.message || '获取可见性选项失败');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// 添加获取状态选项的异步 action
export const fetchStatusOptions = createAsyncThunk(
  'agents/fetchStatusOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getStatusOptions();
      if (response.success) {
        return response.data.options;
      } else {
        return rejectWithValue(response.message || '获取状态选项失败');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 获取单个Agent详情
export const fetchAgentById = createAsyncThunk(
  'agents/fetchAgentById',
  async (id, { rejectWithValue }) => {
    try {
      // 这里将来会实现真正的API调用
      // const response = await agentService.getAgentById(id);
      // return response;
      
      // 临时返回mock数据
      return {
        success: true,
        message: "操作成功",
        data: {
          key_id: id,
          name: "测试Agent",
          name_zh: "测试Agent中文名",
          name_en: "Test Agent",
          description: "这是一个测试用的Agent描述",
          pricing: 9.99,
          visibility: "public",
          status: "published",
          type: "assistant",
          prompt: "你是一个有用的AI助手，请帮助用户解决问题。",
          create_date: Math.floor(Date.now() / 1000),
          update_date: Math.floor(Date.now() / 1000)
        }
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  agents: [],
  loading: false,
  error: null,
  visibilityOptions: [],
  statusOptions: [],
  pagination: {
    page: 1,
    page_size: 10,
    total: 0,
    total_pages: 1
  }
};

const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 处理fetchAgents
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.agents = action.payload.agents || [];
        state.pagination = action.payload.pagination || {
          page: 1,
          page_size: 10,
          total: 0,
          total_pages: 1
        };
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取Agent列表失败';
      })
      // 处理createAgentConfig
      .addCase(createAgentConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAgentConfig.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAgentConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '创建Agent失败';
      })
      
      // 处理updateAgentConfig
      .addCase(updateAgentConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAgentConfig.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateAgentConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '更新Agent失败';
      })
      
      // 处理deleteAgentConfig
      .addCase(deleteAgentConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAgentConfig.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteAgentConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '删除Agent失败';
      })
      .addCase(fetchVisibilityOptions.fulfilled, (state, action) => {
        state.visibilityOptions = action.payload;
      })
      .addCase(fetchStatusOptions.fulfilled, (state, action) => {
        state.statusOptions = action.payload;
      })
       // 获取单个Agent详情
      .addCase(fetchAgentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentById.fulfilled, (state, action) => {
        state.loading = false;
        // 不需要在全局状态中存储单个Agent详情
      })
      .addCase(fetchAgentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '获取Agent详情失败';
      });
  }
});


export default agentsSlice.reducer;


// 根据可见性值获取显示文本和颜色
export const getVisibilityDisplay = (visibility) => {
  switch(visibility) {
    case 'public':
      return { text: '公开', color: 'green' };
    case 'private':
      return { text: '私有', color: 'red' };
    case 'organization':
      return { text: '组织', color: 'blue' };
    default:
      return { text: visibility, color: 'default' };
  }
};

// 根据状态值获取显示文本和颜色
export const getStatusDisplay = (status) => {
  switch(status) {
    case 'published':
      return { text: '已发布', color: 'green' };
    case 'draft':
      return { text: '草稿', color: 'orange' };
    case 'archived':
      return { text: '已归档', color: 'gray' };
    case 'inactive':
      return { text: '禁用', color: 'red' };
    default:
      return { text: status, color: 'default' };
  }
};