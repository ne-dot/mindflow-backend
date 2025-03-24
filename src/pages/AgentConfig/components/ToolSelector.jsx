import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card, Form, Button, Modal, List, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { fetchAgentTools } from '../../../store/slices/agentsSlice';
import { fetchTools } from '../../../store/slices/toolsSlice';

const ToolSelector = ({ form, selectedTools, setSelectedTools }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { tools, loading } = useSelector(state => state.tools);
  const [isToolModalVisible, setIsToolModalVisible] = useState(false);

  // 组件挂载时获取工具列表和Agent的工具列表
  useEffect(() => {
    dispatch(fetchTools());
    
    if (id) {
      dispatch(fetchAgentTools(id))
        .unwrap()
        .then(tools => {
          if (tools && tools.length > 0) {
            setSelectedTools(tools);
            // 更新表单中的工具字段
            form.setFieldsValue({
              tools: tools.map(tool => tool.id)
            });
          }
        });
    }
  }, [dispatch, id, form, setSelectedTools]);

  // 打开工具选择弹窗
  const showToolModal = () => {
    setIsToolModalVisible(true);
  };

  // 关闭工具选择弹窗
  const handleToolModalCancel = () => {
    setIsToolModalVisible(false);
  };

  // 选择或取消选择工具
  const toggleToolSelection = (tool) => {
    const isSelected = selectedTools.some(t => t.id === tool.id);
    
    if (isSelected) {
      setSelectedTools(selectedTools.filter(t => t.id !== tool.id));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  // 确认工具选择
  const handleToolModalOk = () => {
    setIsToolModalVisible(false);
    // 更新表单中的工具字段
    form.setFieldsValue({
      tools: selectedTools.map(tool => tool.id)
    });
  };

  // 移除已选工具
  const removeTool = (toolId) => {
    setSelectedTools(selectedTools.filter(tool => tool.id !== toolId));
    // 更新表单中的工具字段
    form.setFieldsValue({
      tools: selectedTools.filter(tool => tool.id !== toolId).map(tool => tool.id)
    });
  };

  return (
    <Card title="基本配置" style={{ marginBottom: 16 }}>
      <Form form={form} layout="vertical">
        <Form.Item
          name="tools"
          label="工具选择"
          rules={[{ required: false, message: '请选择工具' }]}
        >
          <div>
            <Button 
              type="dashed" 
              onClick={showToolModal} 
              style={{ marginBottom: 16 }}
              icon={<PlusOutlined />}
            >
              添加工具
            </Button>
            
            {selectedTools.length > 0 ? (
              <List
                bordered
                loading={loading}
                dataSource={selectedTools}
                renderItem={tool => (
                  <List.Item
                    actions={[
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => removeTool(tool.id)}
                      />
                    ]}
                  >
                    <List.Item.Meta
                      title={tool.name}
                      description={tool.description}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0', background: '#f9f9f9', border: '1px dashed #d9d9d9', borderRadius: '4px' }}>
                暂无选择的工具
              </div>
            )}
          </div>
        </Form.Item>
      </Form>

      {/* 工具选择弹窗 */}
      <Modal
        title="选择工具"
        open={isToolModalVisible}
        onOk={handleToolModalOk}
        onCancel={handleToolModalCancel}
        width={700}
        styles={{ body: { maxHeight: '60vh', overflowY: 'auto' } }}
      >
        <List
          itemLayout="horizontal"
          loading={loading}
          dataSource={tools}
          renderItem={tool => {
            const isSelected = selectedTools.some(t => t.id === tool.id);
            return (
              <List.Item
                onClick={() => toggleToolSelection(tool)}
                style={{ 
                  cursor: 'pointer', 
                  background: isSelected ? '#f0f7ff' : 'transparent',
                  border: isSelected ? '1px solid #1890ff' : '1px solid transparent',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  padding: '8px'
                }}
              >
                <List.Item.Meta
                  title={<span>{tool.name} {isSelected && <Tag color="blue">已选择</Tag>}</span>}
                  description={tool.description}
                />
              </List.Item>
            );
          }}
        />
      </Modal>
    </Card>
  );
};

export default ToolSelector;