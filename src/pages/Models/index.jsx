import { PlusOutlined } from '@ant-design/icons';
import { Button, Spin, Table, Typography, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchModelConfigs } from '../../store/slices/modelsSlice';

import ModelForm from './components/ModelForm';
import useModelsHook from './hooks/useModelsHook';

const { Title } = Typography;

const Models = () => {
  const dispatch = useDispatch();
  const { models, loading, pagination, error } = useSelector(state => state.models);
  const [localLoading, setLocalLoading] = useState(true);
  const { 
    isModalVisible, 
    showModal, 
    hideModal,
    editingModel,
    columns
  } = useModelsHook();

  // 组件挂载时获取模型列表
  useEffect(() => {
    setLocalLoading(true);
    dispatch(fetchModelConfigs())
      .unwrap()
      .then(() => {
        setLocalLoading(false);
      })
      .catch(err => {
        console.error('获取模型列表出错:', err);
        message.error(`获取模型列表失败: ${err}`); 
        setLocalLoading(false);
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
        <Title level={2}>模型管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          添加模型
        </Button>
      </div>
      
      <Spin spinning={loading || localLoading}>
        <Table 
          dataSource={models} 
          columns={columns} 
          rowKey="id"
          pagination={{
            current: pagination?.page || 1,
            pageSize: pagination?.page_size || 10,
            total: pagination?.total || 0,
            onChange: (page, pageSize) => {
              dispatch(fetchModelConfigs({ page, page_size: pageSize }));
            }
          }}
        />
      </Spin>
      
      <ModelForm 
        visible={isModalVisible} 
        editingModel={editingModel} 
        onCancel={hideModal} 
      />
    </div>
  );
};

export default Models;