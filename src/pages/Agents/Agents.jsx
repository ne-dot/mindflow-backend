import { PlusOutlined } from '@ant-design/icons';
import { Button, Typography, message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAgents } from '../store/slices/agentsSlice';

import AgentForm from './components/AgentForm';
import AgentTable from './components/AgentTable';


const { Title } = Typography;

const Agents = () => {
  const dispatch = useDispatch();
  const { agents, loading, pagination, error } = useSelector(state => state.agents || {
    agents: [],
    loading: false,
    pagination: {
      page: 1,
      page_size: 10,
      total: 0,
      total_pages: 1
    },
    error: null
  });
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  // 组件挂载时获取数据
  useEffect(() => {
    dispatch(fetchAgents())
      .unwrap()
      .catch(err => {
        console.error('获取Agent列表出错:', err);
        message.error(`获取Agent列表失败: ${err}`);
      });
  }, [dispatch]);

  // 显示错误信息
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const showModal = (agent = null) => {
    setEditingAgent(agent);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingAgent(null);
  };

  const handleSuccess = () => {
    setIsModalVisible(false);
    setEditingAgent(null);
    // 刷新列表
    dispatch(fetchAgents({
      page: pagination.page,
      page_size: pagination.page_size
    }));
  };

  // 处理表格分页变化
  const handleTableChange = (pagination) => {
    dispatch(fetchAgents({
      page: pagination.current,
      page_size: pagination.pageSize
    }));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>Agent管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          添加Agent
        </Button>
      </div>
      
      <Spin spinning={loading}>
        <AgentTable 
          agents={agents}
          pagination={pagination}
          onEdit={showModal}
          onChange={handleTableChange}
        />
      </Spin>
      
      <AgentForm
        visible={isModalVisible}
        agent={editingAgent}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Agents;