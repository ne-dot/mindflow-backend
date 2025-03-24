import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Layout, Button, message, Spin, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { fetchAgentById } from '../../store/slices/agentsSlice';

import AgentTester from './components/AgentTester';
import ModelSelector from './components/ModelSelector';
import PromptEditor from './components/PromptEditor';
import ToolSelector from './components/ToolSelector';

const { Header, Content, Sider } = Layout;

const AgentConfig = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { loading, agent } = useSelector(state => state.agents);
  const [selectedTools, setSelectedTools] = useState([]);

  // 获取Agent详情
  useEffect(() => {
    if (id) {
      dispatch(fetchAgentById(id))
        .unwrap()
        .catch(err => {
          console.error('获取Agent详情出错:', err);
          message.error(`获取Agent详情失败: ${err}`);
          navigate('/agents');
        });
    }
  }, [id, dispatch, navigate]);

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
          <h2 style={{ margin: 0 }}>{agent?.name}</h2>
        </div>
        {/* 删除了保存按钮和相关的保存逻辑 */}
      </Header>
      
      <Layout>
        {/* 左侧 - Prompts编辑 */}
        <Sider width={400} style={{ background: '#fff', overflowY: 'auto' }}>
          <PromptEditor form={form} />
        </Sider>
        
        {/* 中间 - 工具选择和参数设置 */}
        <Content style={{ background: '#fff', overflowY: 'auto' }}>
          <ToolSelector 
            form={form} 
            selectedTools={selectedTools} 
            setSelectedTools={setSelectedTools} 
          />
          <ModelSelector form={form} />
        </Content>
        
        {/* 右侧 - 测试Agent */}
        <Sider width={600} style={{ background: '#fff',  overflowY: 'auto' }}>
          <AgentTester agent={agent} />
        </Sider>
      </Layout>
    </Layout>
  );
};

export default AgentConfig;