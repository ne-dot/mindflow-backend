import { PlusOutlined } from '@ant-design/icons';
import { Typography, Button, Spin, Table } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchTools } from '../../store/slices/toolsSlice';

import ToolForm from './components/ToolForm';
import useToolsHook from './hooks/useToolsHook';

const { Title } = Typography;

const Tools = () => {
  const dispatch = useDispatch();
  const { tools, loading } = useSelector(state => state.tools);
  const { 
    isModalVisible, 
    showModal, 
    editingTool,
    columns
  } = useToolsHook();

  React.useEffect(() => {
    dispatch(fetchTools())
      .unwrap()
      .catch(err => {
        console.error('获取工具列表出错:', err);
      });
  }, [dispatch]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>工具管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          添加工具
        </Button>
      </div>
      
      <Spin spinning={loading}>
        <Table dataSource={tools} columns={columns} rowKey="id" />
      </Spin>
      
      <ToolForm 
        visible={isModalVisible} 
        editingTool={editingTool} 
      />
    </div>
  );
};

export default Tools;