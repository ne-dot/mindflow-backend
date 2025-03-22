
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { 
  createAgentConfig, 
  getVisibilityDisplay,
  getStatusDisplay,
  fetchAgents
} from '../../../store/slices/agentsSlice';

const { Option } = Select;
const { TextArea } = Input;

const AgentForm = ({ visible, agent, onCancel, onSuccess }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { visibilityOptions, statusOptions } = useSelector(state => state.agents);
  const [loading, setLoading] = useState(false);

  // 当agent变化时，更新表单
  useEffect(() => {
    if (visible) {
      if (agent) {
        form.setFieldsValue({
          name: agent.name,
          name_zh: agent.name_zh,
          name_en: agent.name_en,
          description: agent.description,
          price: agent.pricing,
          visibility: agent.visibility,
          status: agent.status,
          type: agent.type
        });
      } else {
        form.resetFields();
        // 设置默认值
        form.setFieldsValue({
          visibility: 'public',
          status: 'draft',
          type: 'assistant',
          price: 0
        });
      }
    }
  }, [visible, agent, form]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      // 设置loading状态
      setLoading(true);
      
      // 构建API请求数据，确保字段名与API一致
      const { price, ...otherValues } = values;
      const agentData = {
        ...otherValues,
        pricing: price // 确保使用pricing字段而不是price
      };
      
      // 添加新Agent
      dispatch(createAgentConfig(agentData))
        .unwrap()
        .then((response) => {
          message.success('Agent已添加');
          // 调用onSuccess回调，确保刷新列表
          onSuccess();
          fetchAgents();
          // 关闭模态框
          onCancel();
        })
        .catch(err => {
          console.error('添加Agent出错:', err);
          message.error(err.message || '添加失败');
        })
        .finally(() => {
          // 无论成功失败，都关闭loading状态
          setLoading(false);
          onCancel();
        });
    });
  };

  // 获取状态选项的显示文本
  const getStatusText = (value) => {
    return getStatusDisplay(value).text;
  };

  // 获取可见性选项的显示文本
  const getVisibilityText = (value) => {
    return getVisibilityDisplay(value).text;
  };

  return (
    <Modal
      title={agent ? '编辑Agent' : '添加Agent'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true, message: '请输入Agent名称' }]}
        >
          <Input placeholder="请输入Agent名称" />
        </Form.Item>
        
        {/* 其他表单项保持不变 */}
        <Form.Item
          name="name_zh"
          label="中文名称"
        >
          <Input placeholder="请输入Agent中文名称" />
        </Form.Item>
        <Form.Item
          name="name_en"
          label="英文名称"
        >
          <Input placeholder="请输入Agent英文名称" />
        </Form.Item>
        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入Agent描述' }]}
        >
          <TextArea rows={4} placeholder="请输入Agent描述" />
        </Form.Item>
        <Form.Item
          name="price"
          label="价格"
          initialValue={0}
          rules={[{ required: true, message: '请输入价格' }]}
        >
          <InputNumber 
            min={0} 
            precision={2} 
            style={{ width: '100%' }} 
            placeholder="请输入价格" 
            addonAfter="元" 
          />
        </Form.Item>
        <Form.Item
          name="visibility"
          label="可见性"
          initialValue="public"
          rules={[{ required: true, message: '请选择可见性' }]}
        >
          <Select placeholder="请选择可见性">
            {visibilityOptions.map(option => (
              <Option key={option} value={option}>
                {getVisibilityText(option)}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label="状态"
          initialValue="draft"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select placeholder="请选择状态">
            {statusOptions.map(option => (
              <Option key={option} value={option}>
                {getStatusText(option)}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AgentForm;