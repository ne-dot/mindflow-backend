import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import toolsReducer from './slices/toolsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tools: toolsReducer,
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
