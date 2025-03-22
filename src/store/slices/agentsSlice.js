import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getAgents, createAgent, updateAgent, deleteAgent } from '../../services/agent';

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

const initialState = {
  agents: [],
  loading: false,
  error: null,
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
      });
  }
});

export default agentsSlice.reducer;