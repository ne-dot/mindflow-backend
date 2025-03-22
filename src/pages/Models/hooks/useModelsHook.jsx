import { useState } from 'react';

import ModelActions from '../components/ModelActions';

const useModelsHook = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingModel, setEditingModel] = useState(null);

  const showModal = (model = null) => {
    setEditingModel(model);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setEditingModel(null);
  };

  // 定义表格列
  const columns = [
    { title: '名称', dataIndex: 'model_name', key: 'model_name' },
    { title: '权重', dataIndex: 'weight', key: 'weight' },
    { title: '优先级', dataIndex: 'priority', key: 'priority' },
    { title: 'API地址', dataIndex: 'base_api_url', key: 'base_api_url', ellipsis: true },
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
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <ModelActions record={record} onEdit={showModal} />
      ),
    },
  ];

  return {
    isModalVisible,
    showModal,
    hideModal,
    editingModel,
    columns
  };
};

export default useModelsHook;