import { Form, Input, InputNumber, Modal, Switch, message } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createModelConfig, updateModelConfig } from '../../../store/slices/modelsSlice';

const ModelForm = ({ visible, editingModel, onCancel }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.models);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && editingModel) {
      // 处理嵌套对象
      const formValues = {
        name: editingModel.model_name,
        weight: editingModel.weight,
        priority: editingModel.priority,
        enabled: editingModel.is_enabled,
        base_api_url: editingModel.base_api_url,
        api_key: editingModel.api_key,
        temperature: editingModel.config?.temperature,
        max_tokens: editingModel.config?.max_tokens,
        top_p: editingModel.config?.top_p
      };
      form.setFieldsValue(formValues);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, editingModel, form]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      // 构建API请求数据
      const { temperature, max_tokens, top_p, enabled, name, ...otherValues } = values;
      
      const config = {};
      if (temperature !== undefined) config.temperature = temperature;
      if (max_tokens !== undefined) config.max_tokens = max_tokens;
      if (top_p !== undefined) config.top_p = top_p;
      
      const modelData = {
        model_name: name,
        is_enabled: enabled,
        config,
        ...otherValues
      };
      
      if (editingModel) {
        // 更新模型
        dispatch(updateModelConfig({ id: editingModel.id, data: modelData }))
          .unwrap()
          .then(() => {
            message.success('模型已更新');
            onCancel();
          })
          .catch(err => {
            console.error('更新模型出错:', err);
          });
      } else {
        // 添加新模型
        dispatch(createModelConfig(modelData))
          .unwrap()
          .then(() => {
            message.success('模型已添加');
            onCancel();
          })
          .catch(err => {
            console.error('添加模型出错:', err);
          });
      }
    });
  };

  return (
    <Modal
      title={editingModel ? '编辑模型' : '添加模型'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      destroyOnClose
      width={600}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true, message: '请输入模型名称' }]}
        >
          <Input placeholder="请输入模型名称" />
        </Form.Item>
        <Form.Item
          name="weight"
          label="权重"
          rules={[{ required: true, message: '请输入权重' }]}
        >
          <InputNumber min={0} max={1} step={0.1} placeholder="0.0-1.0" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="priority"
          label="优先级"
          rules={[{ required: true, message: '请输入优先级' }]}
        >
          <InputNumber min={1} step={1} placeholder="数字越大优先级越高" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="base_api_url"
          label="API地址"
          rules={[{ required: true, message: '请输入API地址' }]}
        >
          <Input placeholder="请输入API地址" />
        </Form.Item>
        <Form.Item
          name="api_key"
          label="API密钥"
        >
          <Input.Password placeholder="请输入API密钥" />
        </Form.Item>
        <Form.Item
          name="temperature"
          label="温度"
          tooltip="控制输出的随机性，值越高输出越随机"
        >
          <InputNumber min={0} max={1} step={0.1} placeholder="0.0-1.0" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="max_tokens"
          label="最大Token数"
          tooltip="模型一次生成的最大token数量"
        >
          <InputNumber min={1} step={1} placeholder="例如：2048" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="top_p"
          label="Top P"
          tooltip="控制输出的多样性，值越高输出越多样"
        >
          <InputNumber min={0} max={1} step={0.01} placeholder="0.0-1.0" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="enabled"
          label="状态"
          valuePropName="checked"
        >
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModelForm;