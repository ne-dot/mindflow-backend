import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Space, Modal, message } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { deleteTool } from '../../../store/slices/toolsSlice';

const ToolActions = ({ record, onEdit }) => {
  const dispatch = useDispatch();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 修改handleDelete函数，使用自定义Modal而不是Modal.confirm
  const showDeleteConfirm = (toolId) => {
    if (!toolId) {
      console.error('工具ID为空，无法删除');
      return;
    }
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async (toolId) => {
    if (!toolId) return;
    
    setDeleteLoading(true);
    try {
      await dispatch(deleteTool(toolId))
        .unwrap()
        .then(() => {
          message.success('工具已删除');
          setDeleteModalVisible(false);
        });
    } catch (err) {
      console.error('删除工具出错:', err);
      message.error('删除工具失败');
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
        <p>确定要删除这个工具吗？</p>
      </Modal>
    </>
  );
};

export default ToolActions;