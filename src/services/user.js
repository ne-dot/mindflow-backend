import { API_PATHS } from '../constants/apiPaths';
import http from '../utils/http';

// 用户相关API
const UserApi = {
  // 管理员登录
  adminLogin: data => {
    return http.post(API_PATHS.USER.ADMIN_LOGIN, data);
  },

  // 获取用户资料
  getProfile: () => {
    return http.get(API_PATHS.USER.GET_PROFILE);
  },

  // 更新用户资料
  updateProfile: data => {
    return http.put(API_PATHS.USER.UPDATE_PROFILE, data);
  },
};

export default UserApi;