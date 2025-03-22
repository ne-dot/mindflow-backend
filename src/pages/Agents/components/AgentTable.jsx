import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Button, Space, Modal, message, Tag } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { 
  deleteAgentConfig, 
  fetchVisibilityOptions, 
  fetchStatusOptions,
  getVisibilityDisplay,
  getStatusDisplay
} from '../../../store/slices/agentsSlice';

const AgentTable = ({ agents, pagination, onEdit, onChange }) => {
  const dispatch = useDispatch();
  const { visibilityOptions, statusOptions } = useSelector(state => state.agents);

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
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => onEdit(record)}
          >
            编辑
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
  );
};

export default AgentTable;