import { PlusOutlined } from '@ant-design/icons';
import { Button, Typography, message, Spin } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchAgents } from '../../store/slices/agentsSlice';

import AgentForm from './components/AgentForm';
import AgentTable from './components/AgentTable';

const { Title } = Typography;

const Agents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  // 使用 useRef 记录是否已经加载过数据
  const dataLoadedRef = useRef(false);

  // 组件挂载时获取数据，但只在第一次进入页面时请求
  useEffect(() => {
    if (!dataLoadedRef.current && agents.length === 0) {
      dispatch(fetchAgents())
        .unwrap()
        .then(() => {
          // 标记数据已加载
          dataLoadedRef.current = true;
        })
        .catch(err => {
          console.error('获取Agent列表出错:', err);
          message.error(`获取Agent列表失败: ${err}`);
        });
    }
  }, [dispatch, agents.length]);

  // 显示错误信息
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // 显示创建Agent的模态框
  const showModal = () => {
    setIsModalVisible(true);
  };

  // 处理编辑Agent，跳转到编辑页面
  const handleEdit = (agent) => {
    navigate(`/agents/config/${agent.key_id}`, { state: { agent } });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSuccess = () => {
    setIsModalVisible(false);
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
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          添加Agent
        </Button>
      </div>
      
      <Spin spinning={loading}>
        <AgentTable 
          agents={agents}
          pagination={pagination}
          onEdit={handleEdit}
          onChange={handleTableChange}
        />
      </Spin>
      
      <AgentForm
        visible={isModalVisible}
        agent={null}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Agents;