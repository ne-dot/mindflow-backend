import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { fetchAgentTriggers } from '../../services/trigger';

// 异步 Action: 获取触发记录
export const fetchAgentTriggersAction = createAsyncThunk(
  'agentTriggers/fetchTriggers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetchAgentTriggers(params);
      const invocations = response.invocations;
      if (invocations && invocations.length > 0) {
        // 转换数据格式
        const formattedData = {
          items: invocations.map(item => ({
            id: item.id,
            agent_id: item.agent_id,
            agent_name: item.agent?.name || '未知',
            query: item.input_text,
            response: item.metrics?.output_text || '',
            status: item.status,
            created_at: item.created_at,
            used_tools: item.used_tools || [],
            tool_results: item.tool_results || null,
            cost_time: item.metrics?.cost_time || 0
          })),
          total: response.total || invocations.invocations.length
        };
        
        return formattedData;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// 创建 Slice
const agentTriggersSlice = createSlice({
  name: 'agentTriggers',
  initialState: {
    triggerRecords: { items: [], total: 0 },
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 处理获取触发记录
      .addCase(fetchAgentTriggersAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentTriggersAction.fulfilled, (state, action) => {
        state.loading = false;
        state.triggerRecords = action.payload;
      })
      .addCase(fetchAgentTriggersAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});

export default agentTriggersSlice.reducer;