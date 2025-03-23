import { Card, Form, Select, InputNumber } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchModelConfigs } from '../../../store/slices/modelsSlice';

const { Option } = Select;

const ModelSelector = ({ form }) => {
  const dispatch = useDispatch();
  const { models, loading } = useSelector(state => state.models);

  // 组件挂载时获取模型列表
  useEffect(() => {
    dispatch(fetchModelConfigs());
  }, [dispatch]);

  return (
    <Card title="模型配置" style={{ marginBottom: 16 }}>
      <Form form={form} layout="vertical">
        {/* 模型选择 - 单选 */}
        <Form.Item
          name="model"
          label="模型选择"
          rules={[{ required: true, message: '请选择模型' }]}
          initialValue="gpt-4"
        >
          <Select 
            placeholder="请选择模型"
            loading={loading}
          >
            {models.map(model => (
              <Option key={model.id} value={model.id}>
                {model.model_name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        {/* 参数设置 */}
        <Form.Item label="参数设置">
          <Card size="small" bordered={false} style={{ background: '#f9f9f9' }}>
            <Form.Item
              name="temperature"
              label="温度"
              rules={[{ required: true, message: '请设置温度' }]}
              initialValue={0.7}
            >
              <InputNumber 
                min={0} 
                max={2} 
                step={0.1} 
                style={{ width: '100%' }} 
                placeholder="设置模型温度" 
              />
            </Form.Item>
            
            <Form.Item
              name="max_tokens"
              label="最大输出长度"
              rules={[{ required: true, message: '请设置最大输出长度' }]}
              initialValue={2000}
            >
              <InputNumber 
                min={1} 
                max={8000} 
                style={{ width: '100%' }} 
                placeholder="设置最大输出长度" 
              />
            </Form.Item>
          </Card>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ModelSelector;