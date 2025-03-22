import { message } from 'antd';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import ToolActions from '../components/ToolActions';

// 创建一个全局状态对象，用于跨组件共享状态
window.toolFormState = {
  isModalVisible: false,
  editingTool: null,
  setIsModalVisible: null,
  setEditingTool: null
};

const useToolsHook = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const { error } = useSelector(state => state.tools);

  // 初始化全局状态
  useEffect(() => {
    window.toolFormState.setIsModalVisible = setIsModalVisible;
    window.toolFormState.setEditingTool = setEditingTool;
  }, []);

  // 监听错误状态
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const showModal = (tool = null) => {
    setEditingTool(tool);
    setIsModalVisible(true);
  };

  // 表格列配置
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', ellipsis: true, width: 250 },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { 
      title: '类型', 
      dataIndex: 'tool_type', 
      key: 'tool_type',
      render: type => {
        const typeMap = {
          'api': 'API接口',
          'function': '函数',
          'plugin': '插件'
        };
        return typeMap[type] || type;
      }
    },
    { title: '端点', dataIndex: 'endpoint', key: 'endpoint', ellipsis: true },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { 
      title: '状态', 
      dataIndex: 'is_enabled', 
      key: 'is_enabled',
      render: enabled => (
        <span style={{ color: enabled ? 'green' : 'red' }}>
          {enabled ? '启用' : '禁用'}
        </span>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: timestamp => new Date(timestamp * 1000).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <ToolActions record={record} onEdit={showModal} />
      ),
    },
  ];

  return {
    isModalVisible,
    setIsModalVisible,
    editingTool,
    setEditingTool,
    showModal,
    columns
  };
};

export default useToolsHook;