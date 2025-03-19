import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Typography, message, InputNumber, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExperimentOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Models = () => {
  const [models, setModels] = useState([
    { 
      id: 1, 
      name: 'GPT-4', 
      provider: 'openai', 
      type: 'text', 
      version: '1.0',
      parameters: { temperature: 0.7, max_tokens: 2048 },
      description: '强大的大语言模型，支持复杂推理和创意生成',
      status: 'active' 
    },
    { 
      id: 2, 
      name: 'DALL-E 3', 
      provider: 'openai', 
      type: 'image', 
      version: '3.0',
      parameters: { quality: 'high', style: 'vivid' },
      description: '先进的图像生成模型，可以根据文本描述创建高质量图像',
      status: 'active' 
    },
    { 
      id: 3, 
      name: 'Claude 2', 
      provider: 'anthropic', 
      type: 'text', 
      version: '2.0',
      parameters: { temperature: 0.5, max_tokens: 4096 },
      description: '擅长长文本理解和生成的大语言模型',
      status: 'inactive' 
    },
  ]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingModel, setEditingModel] = useState(null);

  const showModal = (model = null) => {
    setEditingModel(model);
    if (model) {
      // 处理嵌套对象
      const formValues = {
        ...model,
        temperature: model.parameters?.temperature,
        max_tokens: model.parameters?.max_tokens,
        quality: model.parameters?.quality,
        style: model.parameters?.style,
      };
      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      // 处理参数对象
      const { temperature, max_tokens, quality, style, ...modelData } = values;
      const parameters = {};
      
      if (values.type === 'text') {
        if (temperature !== undefined) parameters.temperature = temperature;
        if (max_tokens !== undefined) parameters.max_tokens = max_tokens;
      } else if (values.type === 'image') {
        if (quality !== undefined) parameters.quality = quality;
        if (style !== undefined) parameters.style = style;
      }
      
      const modelWithParams = {
        ...modelData,
        parameters
      };
      
      if (editingModel) {
        // 更新模型
        setModels(models.map(model => 
          model.id === editingModel.id ? { ...model, ...modelWithParams } : model
        ));
        message.success('模型已更新');
      } else {
        // 添加新模型
        const newModel = {
          id: models.length + 1,
          ...modelWithParams,
        };
        setModels([...models, newModel]);
        message.success('模型已添加');
      }
      setIsModalVisible(false);
    });
  };

  const handleDelete = (modelId) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个模型吗？',
      onOk: () => {
        setModels(models.filter(model => model.id !== modelId));
        message.success('模型已删除');
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { 
      title: '提供商', 
      dataIndex: 'provider', 
      key: 'provider',
      render: provider => {
        const colorMap = {
          'openai': 'green',
          'anthropic': 'blue',
          'google': 'orange',
          'meta': 'purple'
        };
        return <Tag color={colorMap[provider] || 'default'}>{provider.toUpperCase()}</Tag>;
      }
    },
    { 
      title: '类型', 
      dataIndex: 'type', 
      key: 'type',
      render: type => {
        const typeMap = {
          'text': '文本',
          'image': '图像',
          'audio': '音频',
          'multimodal': '多模态'
        };
        return typeMap[type] || type;
      }
    },
    { title: '版本', dataIndex: 'version', key: 'version' },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: status => (
        <span style={{ color: status === 'active' ? 'green' : 'red' }}>
          {status === 'active' ? '活跃' : '禁用'}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => showModal(record)}
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
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>模型管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          添加模型
        </Button>
      </div>
      
      <Table dataSource={models} columns={columns} rowKey="id" />
      
      <Modal
        title={editingModel ? '编辑模型' : '添加模型'}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        destroyOnClose
        width={600}
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
            name="provider"
            label="提供商"
            rules={[{ required: true, message: '请选择提供商' }]}
          >
            <Select placeholder="请选择提供商">
              <Option value="openai">OpenAI</Option>
              <Option value="anthropic">Anthropic</Option>
              <Option value="google">Google</Option>
              <Option value="meta">Meta</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择模型类型' }]}
          >
            <Select placeholder="请选择模型类型">
              <Option value="text">文本</Option>
              <Option value="image">图像</Option>
              <Option value="audio">音频</Option>
              <Option value="multimodal">多模态</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="version"
            label="版本"
            rules={[{ required: true, message: '请输入版本' }]}
          >
            <Input placeholder="请输入版本" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入模型描述' }]}
          >
            <TextArea rows={4} placeholder="请输入模型描述" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="active">活跃</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>
          
          {/* 根据模型类型显示不同的参数设置 */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) => {
              const modelType = getFieldValue('type');
              
              if (modelType === 'text') {
                return (
                  <>
                    <Form.Item
                      name="temperature"
                      label="温度"
                      tooltip="控制输出的随机性，值越高输出越随机"
                    >
                      <InputNumber min={0} max={1} step={0.1} placeholder="0.0-1.0" />
                    </Form.Item>
                    <Form.Item
                      name="max_tokens"
                      label="最大Token数"
                      tooltip="模型一次生成的最大token数量"
                    >
                      <InputNumber min={1} step={1} placeholder="例如：2048" />
                    </Form.Item>
                  </>
                );
              }
              
              if (modelType === 'image') {
                return (
                  <>
                    <Form.Item
                      name="quality"
                      label="图像质量"
                    >
                      <Select placeholder="请选择图像质量">
                        <Option value="standard">标准</Option>
                        <Option value="high">高质量</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="style"
                      label="图像风格"
                    >
                      <Select placeholder="请选择图像风格">
                        <Option value="vivid">生动</Option>
                        <Option value="natural">自然</Option>
                      </Select>
                    </Form.Item>
                  </>
                );
              }
              
              return null;
            }}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Models;