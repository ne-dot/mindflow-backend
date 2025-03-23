import React, { useState } from 'react';
import { Card, Form, Button, Modal, List, Avatar, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

// 模拟工具列表数据
const availableTools = [
  { id: 'web_search', name: '网页搜索', icon: '🔍', description: '搜索互联网获取信息' },
  { id: 'calculator', name: '计算器', icon: '🧮', description: '执行数学计算' },
  { id: 'weather', name: '天气查询', icon: '🌤️', description: '获取天气预报信息' },
  { id: 'code_interpreter', name: '代码解释器', icon: '💻', description: '执行和解释代码' },
  { id: 'image_generator', name: '图像生成', icon: '🖼️', description: '生成图像' },
  { id: 'file_reader', name: '文件读取', icon: '📄', description: '读取和分析文件内容' },
  { id: 'database', name: '数据库查询', icon: '🗃️', description: '执行数据库查询操作' },
  { id: 'translator', name: '翻译工具', icon: '🌐', description: '翻译不同语言的文本' },
];

const ToolSelector = ({ form, selectedTools, setSelectedTools }) => {
  const [isToolModalVisible, setIsToolModalVisible] = useState(false);

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
                      avatar={<Avatar>{tool.icon}</Avatar>}
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
        bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
      >
        <List
          itemLayout="horizontal"
          dataSource={availableTools}
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
                  avatar={<Avatar size="large">{tool.icon}</Avatar>}
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