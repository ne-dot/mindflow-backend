import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import modelApi from '../../services/modelApi';

// 异步获取所有模型配置
export const fetchModelConfigs = createAsyncThunk(
  'models/fetchModelConfigs',
  async (params = { page: 1, page_size: 10 }, { rejectWithValue }) => {
    try {
      const response = await modelApi.getAllModelConfigs(params);
      if (response.success) {
        return {
          models: response.data.items,
          pagination: response.data.pagination
        };
      } else {
        return rejectWithValue(response.message || '获取模型配置列表失败');
      }
    } catch (error) {
      return rejectWithValue(error.message || '获取模型配置列表失败');
    }
  }
);

// 异步创建模型配置
export const createModelConfig = createAsyncThunk(
  'models/createModelConfig',
  async (modelData, { rejectWithValue }) => {
    try {
      const response = await modelApi.createModelConfig(modelData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || '添加模型配置失败');
      }
    } catch (error) {
      return rejectWithValue(error.message || '添加模型配置失败');
    }
  }
);

// 异步更新模型配置
export const updateModelConfig = createAsyncThunk(
  'models/updateModelConfig',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await modelApi.updateModelConfig(id, data);
      if (response.success) {
        return { id, ...data };
      } else {
        return rejectWithValue(response.message || '更新模型配置失败');
      }
    } catch (error) {
      return rejectWithValue(error.message || '更新模型配置失败');
    }
  }
);

// 异步删除模型配置
export const deleteModelConfig = createAsyncThunk(
  'models/deleteModelConfig',
  async (id, { rejectWithValue }) => {
    try {
      const response = await modelApi.deleteModelConfig(id);
      if (response.success) {
        return id;
      } else {
        return rejectWithValue(response.message || '删除模型配置失败');
      }
    } catch (error) {
      return rejectWithValue(error.message || '删除模型配置失败');
    }
  }
);

// 创建模型slice
const modelsSlice = createSlice({
  name: 'models',
  initialState: {
    models: [],
    pagination: {
      page: 1,
      page_size: 10,
      total: 0,
      total_pages: 1
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearModelsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取模型配置列表
      .addCase(fetchModelConfigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModelConfigs.fulfilled, (state, action) => {
        state.loading = false;
        state.models = action.payload.models;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchModelConfigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 创建模型配置
      .addCase(createModelConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createModelConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.models.push(action.payload);
      })
      .addCase(createModelConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 更新模型配置
      .addCase(updateModelConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateModelConfig.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.models.findIndex(model => model.id === action.payload.id);
        if (index !== -1) {
          state.models[index] = { ...state.models[index], ...action.payload };
        }
      })
      .addCase(updateModelConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 删除模型配置
      .addCase(deleteModelConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteModelConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.models = state.models.filter(model => model.id !== action.payload);
      })
      .addCase(deleteModelConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearModelsError } = modelsSlice.actions;
export default modelsSlice.reducer;