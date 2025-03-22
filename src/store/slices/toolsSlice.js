import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import toolApi from '../../services/toolApi';

export const fetchTools = createAsyncThunk(
  'tools/fetchTools',
  async (params = { page: 1, page_size: 10 }, { rejectWithValue }) => {
    try {
      const response = await toolApi.getAllTools(params);
      if (response.success) {
        return {
          // 从 data.items 中获取工具列表
          tools: response.data.items,
          // 从 data.pagination 中获取分页信息
          pagination: response.data.pagination
        };
      } else {
        return rejectWithValue(response.message || '获取工具列表失败');
      }
    } catch (error) {
      console.error('获取工具列表异常:', error);
      return rejectWithValue(error.message || '获取工具列表失败');
    }
  }
);

// 异步创建工具
export const createTool = createAsyncThunk(
  'tools/createTool',
  async (toolData, { rejectWithValue }) => {
    try {
      const response = await toolApi.createTool(toolData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || '添加工具失败');
      }
    } catch (error) {
      return rejectWithValue(error.message || '添加工具失败');
    }
  }
);

// 异步更新工具
export const updateTool = createAsyncThunk(
  'tools/updateTool',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await toolApi.updateTool(id, data);
      if (response.success) {
        return { id, ...data };
      } else {
        return rejectWithValue(response.message || '更新工具失败');
      }
    } catch (error) {
      return rejectWithValue(error.message || '更新工具失败');
    }
  }
);

// 异步删除工具
export const deleteTool = createAsyncThunk(
  'tools/deleteTool',
  async (id, { rejectWithValue }) => {
    try {
      const response = await toolApi.deleteTool(id);
      if (response.success) {
        return id;
      } else {
        return rejectWithValue(response.message || '删除工具失败');
      }
    } catch (error) {
      return rejectWithValue(error.message || '删除工具失败');
    }
  }
);

// 创建工具slice
// 添加获取工具类型的异步 action
export const fetchToolTypes = createAsyncThunk(
  'tools/fetchToolTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await toolApi.getToolTypes();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || '获取工具类型失败');
      }
    } catch (error) {
      return rejectWithValue(error.message || '获取工具类型失败');
    }
  }
);

// 在 initialState 中添加 toolTypes 字段
const toolsSlice = createSlice({
  name: 'tools',
  initialState: {
    tools: [],
    toolTypes: {},
    pagination: {
      page: 1,
      page_size: 10,
      total: 0
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearToolsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取工具列表
      .addCase(fetchTools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTools.fulfilled, (state, action) => {
        state.loading = false;
        state.tools = action.payload.tools;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 创建工具
      .addCase(createTool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTool.fulfilled, (state, action) => {
        state.loading = false;
        state.tools.push(action.payload);
      })
      .addCase(createTool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 更新工具
      .addCase(updateTool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTool.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tools.findIndex(tool => tool.id === action.payload.id);
        if (index !== -1) {
          state.tools[index] = { ...state.tools[index], ...action.payload };
        }
      })
      .addCase(updateTool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 删除工具
      .addCase(deleteTool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTool.fulfilled, (state, action) => {
        state.loading = false;
        state.tools = state.tools.filter(tool => tool.id !== action.payload);
      })
      .addCase(deleteTool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchToolTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchToolTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.toolTypes = action.payload;
      })
      .addCase(fetchToolTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearToolsError } = toolsSlice.actions;
export default toolsSlice.reducer;