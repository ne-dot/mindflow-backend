import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Typography, message, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CodeOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Tools = () => {
  const [tools, setTools] = useState([
    { id: 1, name: '天气查询', type: 'api', endpoint: 'https://api.weather.com', description: '查询全球天气信息', enabled: true },
    { id: 2, name: '文档摘要', type: 'function', endpoint: 'summarizeDocument', description: '自动生成文档摘要', enabled: true },
    { id: 3, name: '图像识别', type: 'api', endpoint: 'https://api.vision.com', description: '识别图像中的对象和场景', enabled: false },
  ]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingTool, setEditingTool] = useState(null);

  const showModal = (tool = null) => {
    setEditingTool(tool);
    if (tool) {
      form.setFieldsValue(tool);
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
      if (editingTool) {
        // 更新工具
        setTools(tools.map(tool => 
          tool.id === editingTool.id ? { ...tool, ...values } : tool
        ));
        message.success('工具已更新');
      } else {
        // 添加新工具
        const newTool = {
          id: tools.length + 1,
          ...values,
        };
        setTools([...tools, newTool]);
        message.success('工具已添加');
      }
      setIsModalVisible(false);
    });
  };

  const handleDelete = toolId => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个工具吗？',
      onOk: () => {
        setTools(tools.filter(tool => tool.id !== toolId));
        message.success('工具已删除');
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { 
      title: '类型', 
      dataIndex: 'type', 
      key: 'type',
      render: type => {
        const typeMap = {
          'api': 'API接口',
          'function': '函数',
          'plugin': '插件'
        };
        return typeMap[type] || type;
      }
    },
    { title: '端点', dataIndex: 'endpoint', key: 'endpoint', ellipsis: true },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { 
      title: '状态', 
      dataIndex: 'enabled', 
      key: 'enabled',
      render: enabled => (
        <span style={{ color: enabled ? 'green' : 'red' }}>
          {enabled ? '启用' : '禁用'}
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
        <Title level={2}>工具管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          添加工具
        </Button>
      </div>
      <Table dataSource={tools} columns={columns} rowKey="id" />
      <Modal
        title={editingTool ? '编辑工具' : '添加工具'}
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
            rules={[{ required: true, message: '请输入工具名称' }]}
          >
            <Input placeholder="请输入工具名称" />
          </Form.Item>
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择工具类型' }]}
          >
            <Select placeholder="请选择工具类型">
              <Option value="api">API接口</Option>
              <Option value="function">函数</Option>
              <Option value="plugin">插件</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="endpoint"
            label="端点"
            rules={[{ required: true, message: '请输入端点' }]}
          >
            <Input placeholder="请输入端点URL或函数名" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入工具描述' }]}
          >
            <TextArea rows={4} placeholder="请输入工具描述" />
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
    </div>
  );
};

export default Tools;