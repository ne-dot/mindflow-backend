import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';

// 配置Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    // 这里可以添加其他reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略非序列化值的检查
        ignoredActions: ['auth/login/rejected'],
      },
    }),
});

export default store;
