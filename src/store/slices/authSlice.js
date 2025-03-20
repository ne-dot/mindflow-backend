import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { userApi } from '../../services/api';

// 异步登录action
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await userApi.adminLogin({
      email: credentials.email,
      password: credentials.password,
    });
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: '登录失败' });
  }
});

// 从localStorage加载token
const loadTokenFromStorage = () => {
  try {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh_token');
    return { token, refreshToken };
  } catch (error) {
    return { token: null, refreshToken: null };
  }
};

// 初始状态
const initialState = {
  user: null,
  ...loadTokenFromStorage(),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

// 创建auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;

        // 保存到localStorage
        localStorage.setItem('token', action.payload.access_token);
        localStorage.setItem('refresh_token', action.payload.refresh_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '登录失败';
      });
  },
});

// 导出actions和reducer
export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
