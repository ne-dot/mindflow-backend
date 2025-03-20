// API路径常量
export const API_PATHS = {
  // 用户相关
  USER: {
    ADMIN_LOGIN: '/api/users/admin/login',
    GET_PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
  },
  // Agent相关
  AGENT: {
    LIST: '/api/agents',
    CREATE: '/api/agents',
    UPDATE: '/api/agents/:id',
    DELETE: '/api/agents/:id',
  },
  // 工具相关
  TOOL: {
    LIST: '/api/tools',
    CREATE: '/api/tools',
    UPDATE: '/api/tools/:id',
    DELETE: '/api/tools/:id',
  },
  // 模型相关
  MODEL: {
    LIST: '/api/models',
    CREATE: '/api/models',
    UPDATE: '/api/models/:id',
    DELETE: '/api/models/:id',
  },
  // Prompt相关
  PROMPT: {
    LIST: '/api/prompts',
    CREATE: '/api/prompts',
    UPDATE: '/api/prompts/:id',
    DELETE: '/api/prompts/:id',
  },
};