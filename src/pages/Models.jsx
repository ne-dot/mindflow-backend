import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Table, Button, Space, Modal, Form, Input, Typography, message, InputNumber, Spin, Switch } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchModelConfigs, createModelConfig, updateModelConfig, deleteModelConfig } from '../store/slices/modelsSlice';

const { Title } = Typography;

const Models = () => {
  const dispatch = useDispatch();
  const { models, loading, pagination, error } = useSelector(state => state.models);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingModel, setEditingModel] = useState(null);
  const [localLoading, setLocalLoading] = useState(true);
  // 添加删除相关的状态
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modelToDelete, setModelToDelete] = useState(null);

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

  const showModal = (model = null) => {
    setEditingModel(model);
    if (model) {
      // 处理嵌套对象
      const formValues = {
        name: model.model_name,
        weight: model.weight,
        priority: model.priority,
        enabled: model.is_enabled,
        base_api_url: model.base_api_url,
        api_key: model.api_key,
        temperature: model.config?.temperature,
        max_tokens: model.config?.max_tokens,
        top_p: model.config?.top_p
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
            setIsModalVisible(false);
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
            setIsModalVisible(false);
          })
          .catch(err => {
            console.error('添加模型出错:', err);
          });
      }
    });
  };

  // 修改删除处理函数
  const showDeleteConfirm = (model) => {
    if (!model || !model.id) {
      console.error('模型ID为空，无法删除');
      return;
    }
    setModelToDelete(model);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!modelToDelete || !modelToDelete.id) return;
    
    setDeleteLoading(true);
    try {
      await dispatch(deleteModelConfig(modelToDelete.id))
        .unwrap()
        .then(() => {
          message.success('模型已删除');
          setDeleteModalVisible(false);
          // 刷新列表
          dispatch(fetchModelConfigs());
        });
    } catch (err) {
      console.error('删除模型出错:', err);
      message.error('删除模型失败');
    } finally {
      setDeleteLoading(false);
    }
  };

  // 修改列定义中的操作列
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', ellipsis: true },
    { title: '名称', dataIndex: 'model_name', key: 'model_name' },
    { title: '权重', dataIndex: 'weight', key: 'weight' },
    { title: '优先级', dataIndex: 'priority', key: 'priority' },
    { title: 'API地址', dataIndex: 'base_api_url', key: 'base_api_url', ellipsis: true },
    { 
      title: '状态', 
      dataIndex: 'is_enabled', 
      key: 'is_enabled',
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
            onClick={() => showDeleteConfirm(record)}
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
      
      <Modal
        title={editingModel ? '编辑模型' : '添加模型'}
        open={isModalVisible}
        onCancel={handleCancel}
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
      
      {/* 添加删除确认对话框 */}
      <Modal
        title={
          <div>
            <ExclamationCircleFilled style={{ color: '#faad14', marginRight: 8 }} />
            确认删除
          </div>
        }
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
        okText="确认"
        cancelText="取消"
        confirmLoading={deleteLoading}
      >
        <p>确定要删除模型 "{modelToDelete?.model_name}" 吗？</p>
      </Modal>
    </div>
  );
};

export default Models;