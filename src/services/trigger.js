import http from '../utils/http';

// 获取触发记录列表
export const fetchAgentTriggers = async (params) => {
  const queryParams = new URLSearchParams();
  
  if (params.agentId) {
    queryParams.append('agent_id', params.agentId);
  }
  if (params.status) {
    queryParams.append('status', params.status);
  }
  if (params.dateRange && params.dateRange[0] && params.dateRange[1]) {
    queryParams.append('start_time', params.dateRange[0].valueOf());
    queryParams.append('end_time', params.dateRange[1].valueOf());
  }
  queryParams.append('page', params.page);
  queryParams.append('page_size', params.pageSize);
  
  const response = await http.get(`api/invocations?${queryParams.toString()}`);
  
  return response.data;
};
