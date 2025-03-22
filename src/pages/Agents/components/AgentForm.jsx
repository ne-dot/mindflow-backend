import { UploadOutlined } from '@ant-design/icons';
import { Modal, Form, Input, InputNumber, Select, Upload, Button, message } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { 
  createAgentConfig, 
  updateAgentConfig,
  getVisibilityDisplay,
  getStatusDisplay
} from '../../../store/slices/agentsSlice';

const { Option } = Select;
const { TextArea } = Input;

const AgentForm = ({ visible, agent, onCancel, onSuccess }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { visibilityOptions, statusOptions } = useSelector(state => state.agents);

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
      }
    }
  }, [visible, agent, form]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      // 构建API请求数据
      const { price, ...otherValues } = values;
      const agentData = {
        ...otherValues,
        pricing: price
      };
      
      if (agent) {
        // 更新Agent
        dispatch(updateAgentConfig({ id: agent.key_id, data: agentData }))
          .unwrap()
          .then(() => {
            message.success('Agent已更新');
            onSuccess();
          })
          .catch(err => {
            console.error('更新Agent出错:', err);
          });
      } else {
        // 添加新Agent
        dispatch(createAgentConfig(agentData))
          .unwrap()
          .then(() => {
            message.success('Agent已添加');
            onSuccess();
          })
          .catch(err => {
            console.error('添加Agent出错:', err);
          });
      }
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
        <Form.Item
          name="type"
          label="类型"
          initialValue="assistant"
          rules={[{ required: true, message: '请选择Agent类型' }]}
        >
          <Select placeholder="请选择Agent类型">
            <Option value="assistant">助手</Option>
            <Option value="customer_service">客户服务</Option>
            <Option value="data_analysis">数据分析</Option>
            <Option value="content_creation">内容创作</Option>
            <Option value="other">其他</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="avatar"
          label="头像"
          valuePropName="fileList" // Add this line
          getValueFromEvent={e => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }} // Add this function to properly handle file uploads
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>上传头像</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AgentForm;