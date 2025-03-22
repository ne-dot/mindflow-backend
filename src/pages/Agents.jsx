import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Table, Button, Space, Modal, Form, Input, Select, Typography, message, Upload } from 'antd';
import React, { useState } from 'react';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Agents = () => {
  const [agents, setAgents] = useState([
    { id: 1, name: '客服助手', type: 'customer_service', description: '处理客户咨询和问题', status: 'active' },
    { id: 2, name: '数据分析师', type: 'data_analysis', description: '分析数据并生成报告', status: 'active' },
    { id: 3, name: '内容创作者', type: 'content_creation', description: '创建各种类型的内容', status: 'inactive' },
  ]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingAgent, setEditingAgent] = useState(null);

  const showModal = (agent = null) => {
    setEditingAgent(agent);
    if (agent) {
      form.setFieldsValue(agent);
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
      if (editingAgent) {
        // 更新Agent
        setAgents(agents.map(agent => 
          agent.id === editingAgent.id ? { ...agent, ...values } : agent
        ));
        message.success('Agent已更新');
      } else {
        // 添加新Agent
        const newAgent = {
          id: agents.length + 1,
          ...values,
        };
        setAgents([...agents, newAgent]);
        message.success('Agent已添加');
      }
      setIsModalVisible(false);
    });
  };

  const handleDelete = (agentId) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个Agent吗？',
      onOk: () => {
        setAgents(agents.filter(agent => agent.id !== agentId));
        message.success('Agent已删除');
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
          'customer_service': '客户服务',
          'data_analysis': '数据分析',
          'content_creation': '内容创作'
        };
        return typeMap[type] || type;
      }
    },
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
        <Title level={2}>Agent管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          添加Agent
        </Button>
      </div>
      
      <Table dataSource={agents} columns={columns} rowKey="id" />
      
      <Modal
        title={editingAgent ? '编辑Agent' : '添加Agent'}
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
            rules={[{ required: true, message: '请输入Agent名称' }]}
          >
            <Input placeholder="请输入Agent名称" />
          </Form.Item>
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择Agent类型' }]}
          >
            <Select placeholder="请选择Agent类型">
              <Option value="customer_service">客户服务</Option>
              <Option value="data_analysis">数据分析</Option>
              <Option value="content_creation">内容创作</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入Agent描述' }]}
          >
            <TextArea rows={4} placeholder="请输入Agent描述" />
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
          <Form.Item
            name="avatar"
            label="头像"
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
    </div>
  );
};

export default Agents;