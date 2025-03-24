import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import promptApi from '../../services/prompt';

// 异步获取Agent的prompts
export const fetchAgentPrompts = createAsyncThunk(
  'prompts/fetchAgentPrompts',
  async (agentId, { rejectWithValue }) => {
    try {
      const response = await promptApi.getAgentPrompts(agentId);
      if (response.success) {
        return response.data.prompts;
      } else {
        return rejectWithValue(response.message || '获取Agent prompts失败');
      }
    } catch (error) {
      return rejectWithValue(error.message || '获取Agent prompts失败');
    }
  }
);


const promptsSlice = createSlice({
  name: 'prompts',
  initialState: {
    prompts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearPromptsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取Agent prompts
      .addCase(fetchAgentPrompts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentPrompts.fulfilled, (state, action) => {
        state.loading = false;
        state.prompts = action.payload;
      })
      .addCase(fetchAgentPrompts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearPromptsError } = promptsSlice.actions;
export default promptsSlice.reducer;