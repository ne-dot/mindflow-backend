import { Modal, Form, Input, Select, Switch, message } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createTool, updateTool } from '../../../store/slices/toolsSlice';

const { Option } = Select;
const { TextArea } = Input;

const ToolForm = ({ visible, editingTool }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.tools);
  
  React.useEffect(() => {
    if (editingTool) {
      form.setFieldsValue({
        name: editingTool.name,
        type: editingTool.tool_type,
        endpoint: editingTool.endpoint,
        description: editingTool.description,
        enabled: editingTool.is_enabled,
        config_params: JSON.stringify(editingTool.config_params || {})
      });
    } else {
      form.resetFields();
    }
  }, [editingTool, form]);

  const handleCancel = () => {
    window.toolFormState.setIsModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 处理配置参数，将JSON字符串转为对象
      let configParams = {};
      try {
        if (values.config_params) {
          configParams = JSON.parse(values.config_params);
        }
      } catch (e) {
        message.error('配置参数格式不正确，请输入有效的JSON');
        return;
      }
      
      // 构建API请求数据
      const toolData = {
        name: values.name,
        tool_type: values.type,
        endpoint: values.endpoint,
        description: values.description,
        is_enabled: values.enabled,
        config_params: configParams
      };
      
      if (editingTool) {
        // 更新工具
        await dispatch(updateTool({ id: editingTool.id, data: toolData }))
          .unwrap()
          .then(() => {
            message.success('工具已更新');
            handleCancel();
          })
          .catch(err => {
            console.error('更新工具出错:', err);
          });
      } else {
        // 添加新工具
        await dispatch(createTool(toolData))
          .unwrap()
          .then(() => {
            message.success('工具已添加');
            handleCancel();
          })
          .catch(err => {
            console.error('添加工具出错:', err);
          });
      }
    } catch (error) {
      console.error('提交表单出错:', error);
    }
  };

  return (
    <Modal
      title={editingTool ? '编辑工具' : '添加工具'}
      visible={visible}
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
          name="config_params"
          label="配置参数 (JSON格式)"
        >
          <TextArea rows={4} placeholder='{"key": "value"}' />
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

export default ToolForm;