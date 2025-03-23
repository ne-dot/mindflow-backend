import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Layout, Button, message, Spin, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { fetchAgentById, updateAgentConfig } from '../../store/slices/agentsSlice';

import AgentTester from './components/AgentTester';
import ModelSelector from './components/ModelSelector';
import PromptEditor from './components/PromptEditor';
import ToolSelector from './components/ToolSelector';

const { Header, Content, Sider } = Layout;

const AgentConfig = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { loading } = useSelector(state => state.agents);
  const [agent, setAgent] = useState(location.state?.agent || null);
  const [saving, setSaving] = useState(false);
  const [selectedTools, setSelectedTools] = useState([]);

  // 获取Agent详情
  useEffect(() => {
    if (!agent && id) {
      dispatch(fetchAgentById(id))
        .unwrap()
        .then(response => {
          if (response.success) {
            setAgent(response.data);
          } else {
            message.error('获取Agent详情失败');
            navigate('/agents');
          }
        })
        .catch(err => {
          console.error('获取Agent详情出错:', err);
          message.error(`获取Agent详情失败: ${err}`);
          navigate('/agents');
        });
    }
  }, [id, agent, dispatch, navigate]);

  // 当agent变化时，更新表单和工具列表
  useEffect(() => {
    if (agent) {
      form.setFieldsValue({
        name: agent.name,
        name_zh: agent.name_zh,
        name_en: agent.name_en,
        description: agent.description,
        price: agent.pricing,
        visibility: agent.visibility,
        status: agent.status,
        type: agent.type,
        prompt: agent.prompt || '',
        model: agent.model || 'gpt-4',
        temperature: agent.temperature || 0.7,
        max_tokens: agent.max_tokens || 2000,
      });
      
      // 如果agent有工具数据，设置已选工具
      if (agent.tools && Array.isArray(agent.tools)) {
        setSelectedTools(agent.tools);
      }
    }
  }, [agent, form]);

  // 保存Agent
  const handleSave = () => {
    form.validateFields().then(values => {
      setSaving(true);
      
      const { price, ...otherValues } = values;
      const agentData = {
        ...otherValues,
        pricing: price,
        tools: selectedTools
      };
      
      dispatch(updateAgentConfig({ id, data: agentData }))
        .unwrap()
        .then(response => {
          if (response.success) {
            message.success('Agent已更新');
            setAgent(response.data);
          } else {
            message.error(response.message || '更新失败');
          }
        })
        .catch(err => {
          console.error('更新Agent出错:', err);
          message.error(err.message || '更新失败');
        })
        .finally(() => {
          setSaving(false);
        });
    });
  };

  // 返回列表页
  const handleBack = () => {
    navigate('/agents');
  };

  if (loading && !agent) {
    return <Spin size="large" />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ marginRight: 16 }}>
            返回
          </Button>
          <h2 style={{ margin: 0 }}>编辑Agent: {agent?.name}</h2>
        </div>
        <Button 
          type="primary" 
          icon={<SaveOutlined />} 
          onClick={handleSave}
          loading={saving}
        >
          保存
        </Button>
      </Header>
      
      <Layout>
        {/* 左侧 - Prompts编辑 */}
        <Sider width={400} style={{ background: '#fff', padding: '16px', overflowY: 'auto' }}>
          <PromptEditor form={form} />
        </Sider>
        
        {/* 中间 - 工具选择和参数设置 */}
        <Content style={{ padding: '16px', background: '#fff', overflowY: 'auto' }}>
          <ToolSelector 
            form={form} 
            selectedTools={selectedTools} 
            setSelectedTools={setSelectedTools} 
          />
          <ModelSelector form={form} />
        </Content>
        
        {/* 右侧 - 测试Agent */}
        <Sider width={400} style={{ background: '#fff', padding: '16px', overflowY: 'auto' }}>
          <AgentTester agent={agent} />
        </Sider>
      </Layout>
    </Layout>
  );
};

export default AgentConfig;