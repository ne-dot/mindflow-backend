import { configureStore } from '@reduxjs/toolkit';

import agentsReducer from './slices/agentsSlice';
import authReducer from './slices/authSlice';
import modelsReducer from './slices/modelsSlice';
import promptsReducer from './slices/promptsSlice';
import toolsReducer from './slices/toolsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    models: modelsReducer,
    tools: toolsReducer,
    agents: agentsReducer,
    prompts: promptsReducer,
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
