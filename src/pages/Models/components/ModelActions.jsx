import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Space, Modal, message } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { deleteModelConfig, fetchModelConfigs } from '../../../store/slices/modelsSlice';

const ModelActions = ({ record, onEdit }) => {
  const dispatch = useDispatch();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const showDeleteConfirm = (modelId) => {
    if (!modelId) {
      console.error('模型ID为空，无法删除');
      return;
    }
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async (modelId) => {
    if (!modelId) return;
    
    setDeleteLoading(true);
    try {
      await dispatch(deleteModelConfig(modelId))
        .unwrap()
        .then(() => {
          message.success('模型已删除');
          setDeleteModalVisible(false);
          // 刷新列表
          dispatch(fetchModelConfigs());
        });
    } catch (err) {
      console.error('删除模型出错:', err);
      message.error('删除模型失败');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
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
          onClick={() => showDeleteConfirm(record?.id)}
        >
          删除
        </Button>
      </Space>

      <Modal
        title={
          <div>
            <ExclamationCircleFilled style={{ color: '#faad14', marginRight: 8 }} />
            确认删除
          </div>
        }
        open={deleteModalVisible}
        onOk={() => handleDeleteConfirm(record?.id)}
        onCancel={() => setDeleteModalVisible(false)}
        okText="确认"
        cancelText="取消"
        confirmLoading={deleteLoading}
      >
        <p>确定要删除模型 "{record?.model_name}" 吗？</p>
      </Modal>
    </>
  );
};

export default ModelActions;