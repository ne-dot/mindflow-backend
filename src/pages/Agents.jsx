import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, Typography, message, Upload, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAgents, createAgentConfig, updateAgentConfig, deleteAgentConfig } from '../store/slices/agentsSlice';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Agents = () => {
  const dispatch = useDispatch();
  // In your component
  const { agents, loading, pagination, error } = useSelector(state => state.agents || {
    agents: [],
    loading: false,
    pagination: {
      page: 1,
      page_size: 10,
      total: 0,
      total_pages: 1
    },
    error: null
  });
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingAgent, setEditingAgent] = useState(null);

  // 组件挂载时获取数据
  useEffect(() => {
    dispatch(fetchAgents())
      .unwrap()
      .catch(err => {
        console.error('获取Agent列表出错:', err);
        message.error(`获取Agent列表失败: ${err}`);
      });
  }, [dispatch]);

  // 显示错误信息
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const showModal = (agent = null) => {
    setEditingAgent(agent);
    if (agent) {
      // 设置表单值，匹配后端字段
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
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      // 构建API请求数据
      const { price, ...otherValues } = values;
      const agentData = {
        ...otherValues,
        pricing: price
      };
      
      if (editingAgent) {
        // 更新Agent
        dispatch(updateAgentConfig({ id: editingAgent.key_id, data: agentData }))
          .unwrap()
          .then(() => {
            message.success('Agent已更新');
            setIsModalVisible(false);
            // 刷新列表
            dispatch(fetchAgents({
              page: pagination.page,
              page_size: pagination.page_size
            }));
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
            setIsModalVisible(false);
            // 刷新列表
            dispatch(fetchAgents({
              page: pagination.page,
              page_size: pagination.page_size
            }));
          })
          .catch(err => {
            console.error('添加Agent出错:', err);
          });
      }
    });
  };

  const handleDelete = (agentId) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个Agent吗？',
      onOk: () => {
        dispatch(deleteAgentConfig(agentId))
          .unwrap()
          .then(() => {
            message.success('Agent已删除');
            // 刷新列表
            dispatch(fetchAgents({
              page: pagination.page,
              page_size: pagination.page_size
            }));
          })
          .catch(err => {
            console.error('删除Agent出错:', err);
          });
      },
    });
  };

  // 处理表格分页变化
  const handleTableChange = (pagination) => {
    dispatch(fetchAgents({
      page: pagination.current,
      page_size: pagination.pageSize
    }));
  };

  const columns = [
    { 
      title: '中文名/英文名', 
      key: 'names',
      render: (_, record) => (
        <>
          <div>{record.name_zh || record.name}</div>
          <div style={{ color: '#999' }}>{record.name_en}</div>
        </>
      )
    },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '价格', dataIndex: 'pricing', key: 'pricing', render: price => `¥${price}` },
    { title: '可见性', dataIndex: 'visibility', key: 'visibility' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: status => {
        let color;
        let text;
        
        switch(status) {
          case 'published':
            color = 'green';
            text = '已发布';
            break;
          case 'draft':
            color = 'orange';
            text = '草稿';
            break;
          case 'inactive':
            color = 'red';
            text = '禁用';
            break;
          default:
            color = 'gray';
            text = status;
        }
        
        return <span style={{ color }}>{text}</span>;
      }
    },
    { 
      title: '更新时间', 
      dataIndex: 'update_date', 
      key: 'update_date',
      render: timestamp => new Date(timestamp * 1000).toLocaleString('zh-CN'),
      sorter: (a, b) => a.update_date - b.update_date
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
            onClick={() => handleDelete(record.key_id)}
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
      
      <Spin spinning={loading}>
        <Table 
          dataSource={agents} 
          columns={columns} 
          rowKey="key_id"
          pagination={{
            current: pagination.page,
            pageSize: pagination.page_size,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`
          }}
          onChange={handleTableChange}
        />
      </Spin>
      
      <Modal
        title={editingAgent ? '编辑Agent' : '添加Agent'}
        open={isModalVisible}
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
              <Option value="public">公开</Option>
              <Option value="private">私有</Option>
              <Option value="restricted">受限</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            initialValue="published"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="published">已发布</Option>
              <Option value="draft">草稿</Option>
              <Option value="inactive">禁用</Option>
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