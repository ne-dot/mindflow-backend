import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Layout, Button, Spin, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { fetchAgentById, configureAgentAction } from '../../store/slices/agentsSlice';

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
  const [saving, setSaving] = useState(false);

  // 获取Agent详情
  useEffect(() => {
    if (id) {
      dispatch(fetchAgentById(id))
        .unwrap()
        .catch(err => {
          console.error('获取Agent详情出错:', err);
          toast.error(`获取Agent详情失败: ${err}`);
          navigate('/agents');
        });
    }
  }, [id, dispatch, navigate]);

  // 保存Agent
  const handleSave = () => {
    try {
      form.validateFields().then(values => {
        setSaving(true);
        
        // 构建配置数据
        const configData = {
          prompt_zh: values.prompt_zh,
          prompt_en: values.prompt_en,
          tool_ids: selectedTools.map(tool => tool.id),
          model_id: values.model, // 使用表单值或当前agent的model_id作为后备
          model_params: {
            temperature: values.temperature || 0.7,
            max_tokens: values.max_tokens || 2000
          }
        };
    
        // 显示加载中的toast
        const toastId = toast.loading('正在保存配置...');
        
        dispatch(configureAgentAction({ agentId: id, configData }))
          .unwrap()
          .then(response => {
            // 更新toast为成功
            toast.update(toastId, { 
              render: 'Agent配置已成功保存', 
              type: 'success',  // Changed from toast.TYPE.SUCCESS to 'success'
              isLoading: false,
              autoClose: 2000
            });
          })
          .catch(err => {
            console.error('配置Agent出错:', err);
            // 更新toast为错误
            toast.update(toastId, { 
              render: err || '配置失败', 
              type: 'error',  // Changed from toast.TYPE.ERROR to 'error'
              isLoading: false,
              autoClose: 2000
            });
          })
          .finally(() => {
            console.log('保存操作完成');
            setSaving(false);
          });
      }).catch(err => {
        console.error('表单验证失败:', err);
        toast.error('表单验证失败，请检查输入');
      });
    } catch (error) {
      console.error('保存过程中发生未捕获的错误:', error);
      toast.error('保存过程中发生错误: ' + error.message);
    }
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
      {/* 添加ToastContainer组件 */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ marginRight: 16 }}>
            返回
          </Button>
          <h2 style={{ margin: 0 }}>{agent?.name}</h2>
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
      
      {/* 其余布局保持不变 */}
      <Layout>
        <Sider width={400} style={{ background: '#fff', overflowY: 'auto' }}>
          <PromptEditor form={form} />
        </Sider>
        
        <Content style={{ background: '#fff', overflowY: 'auto' }}>
          <ToolSelector 
            form={form} 
            selectedTools={selectedTools} 
            setSelectedTools={setSelectedTools} 
          />
          <ModelSelector form={form} />
        </Content>
        
        <Sider width={600} style={{ background: '#fff',  overflowY: 'auto' }}>
          <AgentTester agent={agent} />
        </Sider>
      </Layout>
    </Layout>
  );
};

export default AgentConfig;