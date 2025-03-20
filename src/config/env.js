// 环境配置
const ENV = {
  development: {
    API_BASE_URL: 'http://localhost:8000',
  },
  test: {
    API_BASE_URL: 'http://test-api.example.com',
  },
  production: {
    API_BASE_URL: 'https://api.example.com',
  }
};

// 当前环境，可以根据环境变量或其他方式动态设置
const currentEnv = process.env.REACT_APP_ENV || 'development';

// 导出当前环境的配置
export default ENV[currentEnv];