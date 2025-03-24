import { get } from '../utils/http';

const promptApi = {
  // 获取Agent的prompts
  getAgentPrompts : (agentId) => get(`/api/agents/${agentId}/prompts`,)
};

export default promptApi;