import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Typography, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Prompts = () => {
  const [prompts, setPrompts] = useState([
    { 
      id: 1, 
      name: '客服回复模板', 
      category: 'customer_service', 
      content: '你是一名专业的客服代表。请以友好、专业的态度回答用户的问题。如果你不知道答案，请诚实地说明并提供可能的解决方案或联系方式。',
      tags: ['客服', '回复'],
      model: 'GPT-4',
      createdAt: '2023-05-15',
      updatedAt: '2023-05-15',
    },
    { 
      id: 2, 
      name: '内容摘要生成', 
      category: 'content_creation', 
      content: '请为以下文本生成一个简洁的摘要，不超过100字。保留关键信息和主要观点。\n\n{text}',
      tags: ['摘要', '内容'],
      model: 'GPT-4',
      createdAt: '2023-05-14',
      updatedAt: '2023-05-14',
    },
    { 
      id: 3, 
      name: '数据分析报告', 
      category: 'data_analysis', 
      content: '你是一名数据分析专家。请分析以下数据，找出关键趋势、异常和洞察。然后生成一份专业的分析报告，包括图表描述和建议。\n\n{data}',
      tags: ['数据', '分析', '报告'],
      model: 'Claude 2',
      createdAt: '2023-05-13',
      updatedAt: '2023-05-13',
    },
  ]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingPrompt, setEditingPrompt] = useState(null);

  const showModal = (prompt = null) => {
    setEditingPrompt(prompt);
    if (prompt) {
      form.setFieldsValue({
        ...prompt,
        tags: prompt.tags.join(',')
      });
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
      // 处理标签
      const tags = values.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const promptData = {
        ...values,
        tags,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      
      if (editingPrompt) {
        // 更新Prompt
        setPrompts(prompts.map(prompt => 
          prompt.id === editingPrompt.id ? { ...prompt, ...promptData } : prompt
        ));
        message.success('Prompt已更新');
      } else {
        // 添加新Prompt
        const newPrompt = {
          id: prompts.length + 1,
          ...promptData,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setPrompts([...prompts, newPrompt]);
        message.success('Prompt已添加');
      }
      setIsModalVisible(false);
    });
  };

  const handleDelete = (promptId) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个Prompt吗？',
      onOk: () => {
        setPrompts(prompts.filter(prompt => prompt.id !== promptId));
        message.success('Prompt已删除');
      },
    });
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      message.success('Prompt内容已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败，请手动复制');
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { 
      title: '分类', 
      dataIndex: 'category', 
      key: 'category',
      render: category => {
        const categoryMap = {
          'customer_service': '客户服务',
          'content_creation': '内容创作',
          'data_analysis': '数据分析',
          'coding': '编程',
          'other': '其他'
        };
        return categoryMap[category] || category;
      }
    },
    { 
      title: '标签', 
      dataIndex: 'tags', 
      key: 'tags',
      render: tags => (
        <>
          {tags.map(tag => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      )
    },
    { title: '模型', dataIndex: 'model', key: 'model' },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
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
            icon={<CopyOutlined />} 
            size="small"
            onClick={() => handleCopy(record.content)}
          >
            复制
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
        <Title level={2}>Prompt管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          添加Prompt
        </Button>
      </div>
      
      <Table 
        dataSource={prompts} 
        columns={columns} 
        rowKey="id"
        expandable={{
          expandedRowRender: record => (
            <div style={{ margin: 0 }}>
              <p style={{ fontWeight: 'bold', marginBottom: 8 }}>Prompt内容:</p>
              <pre style={{ 
                whiteSpace: 'pre-wrap', 
                wordWrap: 'break-word',
                background: '#f5f5f5',
                padding: 16,
                borderRadius: 4
              }}>
                {record.content}
              </pre>
            </div>
          ),
        }}
      />
      
      <Modal
        title={editingPrompt ? '编辑Prompt' : '添加Prompt'}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        destroyOnClose
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入Prompt名称' }]}
          >
            <Input placeholder="请输入Prompt名称" />
          </Form.Item>
          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              <Option value="customer_service">客户服务</Option>
              <Option value="content_creation">内容创作</Option>
              <Option value="data_analysis">数据分析</Option>
              <Option value="coding">编程</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入Prompt内容' }]}
          >
            <TextArea rows={8} placeholder="请输入Prompt内容" />
          </Form.Item>
          <Form.Item
            name="tags"
            label="标签"
            tooltip="多个标签请用逗号分隔"
            rules={[{ required: true, message: '请输入标签' }]}
          >
            <Input placeholder="例如：客服,回复,模板" />
          </Form.Item>
          <Form.Item
            name="model"
            label="推荐模型"
            rules={[{ required: true, message: '请选择推荐模型' }]}
          >
            <Select placeholder="请选择推荐模型">
              <Option value="GPT-4">GPT-4</Option>
              <Option value="GPT-3.5">GPT-3.5</Option>
              <Option value="Claude 2">Claude 2</Option>
              <Option value="DALL-E 3">DALL-E 3</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Prompts;