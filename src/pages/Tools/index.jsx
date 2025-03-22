import { PlusOutlined } from '@ant-design/icons';
import { Typography, Button, Spin, Table, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchTools } from '../../store/slices/toolsSlice';

import ToolForm from './components/ToolForm';
import useToolsHook from './hooks/useToolsHook';

const { Title } = Typography;

const Tools = () => {
  const dispatch = useDispatch();
  const { tools, loading, pagination, error } = useSelector(state => state.tools);
  const [fetchError, setFetchError] = useState(null);
  const [localLoading, setLocalLoading] = useState(true); // 添加本地loading状态
  const { 
    isModalVisible, 
    showModal, 
    editingTool,
    columns
  } = useToolsHook();

  useEffect(() => {
    setLocalLoading(true); // 开始加载时设置loading为true
    dispatch(fetchTools())
      .unwrap()
      .then(() => {
        setLocalLoading(false); // 加载成功后设置loading为false
      })
      .catch(err => {
        console.error('获取工具列表出错:', err);
        setFetchError(err);
        message.error(`获取工具列表失败: ${err}`);
        setLocalLoading(false); // 加载失败后也要设置loading为false
      });
  }, [dispatch]);

  // 显示错误信息
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>工具管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          添加工具
        </Button>
      </div>
      
      {fetchError && (
        <div style={{ marginBottom: 16, color: 'red' }}>
          加载失败: {fetchError}
        </div>
      )}
      
      <Spin spinning={loading || localLoading}> {/* 使用redux的loading状态和本地loading状态 */}
        <Table 
          dataSource={tools} 
          columns={columns} 
          rowKey="id"
          pagination={{
            current: pagination?.page || 1,
            pageSize: pagination?.page_size || 10,
            total: pagination?.total || 0,
            onChange: (page, pageSize) => {
              dispatch(fetchTools({ page, page_size: pageSize }));
            }
          }}
        />
      </Spin>
      
      <ToolForm 
        visible={isModalVisible} 
        editingTool={editingTool} 
      />
    </div>
  );
};

export default Tools;