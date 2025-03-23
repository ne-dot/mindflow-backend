import { EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { Table, Button, Space, Modal, message, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { 
  deleteAgentConfig, 
  fetchVisibilityOptions, 
  fetchStatusOptions,
  getVisibilityDisplay,
  getStatusDisplay
} from '../../../store/slices/agentsSlice';

import AgentForm from './AgentForm';

const AgentTable = ({ agents, pagination, onEdit, onChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visibilityOptions, statusOptions } = useSelector(state => state.agents);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);

  // 组件挂载时获取可见性选项和状态选项
  useEffect(() => {
    dispatch(fetchVisibilityOptions())
      .unwrap()
      .catch(err => {
        console.error('获取可见性选项出错:', err);
      });
    
    dispatch(fetchStatusOptions())
      .unwrap()
      .catch(err => {
        console.error('获取状态选项出错:', err);
      });
  }, [dispatch]);

  // 处理配置按钮点击，跳转到配置页面
  const handleConfigClick = (agent) => {
    navigate(`/agents/config/${agent.key_id}`, { state: { agent } });
  };

  const handleDelete = (agentId) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个Agent吗？',
      onOk: () => {
        dispatch(deleteAgentConfig(agentId))
          .unwrap()
          .then(() => {
            message.success('Agent已删除');
            // 刷新列表
            onChange({
              current: pagination.page,
              pageSize: pagination.page_size
            });
          })
          .catch(err => {
            console.error('删除Agent出错:', err);
          });
      },
    });
  };

  // 处理编辑按钮点击
  const handleEditClick = (agent) => {
    setCurrentAgent(agent);
    setIsEditModalVisible(true);
  };

  // 处理编辑表单取消
  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setCurrentAgent(null);
  };

  // 处理编辑表单成功提交
  const handleEditSuccess = () => {
    setIsEditModalVisible(false);
    setCurrentAgent(null);
    // 刷新列表
    onChange({
      current: pagination.page,
      pageSize: pagination.page_size
    });
  };

  const columns = [
    { 
      title: '中文名/英文名', 
      key: 'names',
      render: (_, record) => (
        <>
          <div>{record.name_zh || record.name}</div>
          <div style={{ color: '#999' }}>{record.name_en}</div>
        </>
      )
    },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '价格', dataIndex: 'pricing', key: 'pricing', render: price => `¥${price}` },
    { 
      title: '可见性', 
      dataIndex: 'visibility', 
      key: 'visibility',
      width: 100,
      render: visibility => {
        const { text, color } = getVisibilityDisplay(visibility);
        return <Tag color={color}>{text}</Tag>;
      },
      filters: visibilityOptions.map(option => ({
        text: getVisibilityDisplay(option).text,
        value: option
      })),
      onFilter: (value, record) => record.visibility === value
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      width: 80,
      render: status => {
        const { text, color } = getStatusDisplay(status);
        return <Tag color={color}>{text}</Tag>;
      },
      filters: statusOptions.map(option => ({
        text: getStatusDisplay(option).text,
        value: option
      })),
      onFilter: (value, record) => record.status === value
    },
    { 
      title: '更新时间', 
      dataIndex: 'update_date', 
      key: 'update_date',
      render: timestamp => new Date(timestamp * 1000).toLocaleString('zh-CN'),
      sorter: (a, b) => a.update_date - b.update_date
    },
    {
      title: '操作',
      key: 'action',
      width: 260, // 增加列宽
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditClick(record)}
          >
            编辑
          </Button>
          <Button 
            icon={<SettingOutlined />} 
            size="small"
            onClick={() => handleConfigClick(record)}
          >
            配置
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDelete(record.key_id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table 
        dataSource={agents} 
        columns={columns} 
        rowKey="key_id"
        pagination={{
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条`
        }}
        onChange={onChange}
      />
      
      {/* 编辑Agent的表单 */}
      <AgentForm
        visible={isEditModalVisible}
        agent={currentAgent}
        onCancel={handleEditCancel}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};

export default AgentTable;