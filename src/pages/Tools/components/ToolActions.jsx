import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Space, Modal, message } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';

import { deleteTool } from '../../../store/slices/toolsSlice';

const ToolActions = ({ record, onEdit }) => {
  const dispatch = useDispatch();

  const handleDelete = toolId => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个工具吗？',
      onOk: async () => {
        await dispatch(deleteTool(toolId))
          .unwrap()
          .then(() => {
            message.success('工具已删除');
          })
          .catch(err => {
            console.error('删除工具出错:', err);
          });
      },
    });
  };

  return (
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
        onClick={() => handleDelete(record.id)}
      >
        删除
      </Button>
    </Space>
  );
};

export default ToolActions;