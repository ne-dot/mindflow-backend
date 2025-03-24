import { SendOutlined } from '@ant-design/icons';
import { Card, Input, Button, List, Typography } from 'antd';
import React, { useState } from 'react';

const { TextArea } = Input;
const { Text } = Typography;

const AgentTester = ({ agent }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 发送测试消息
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // 添加用户消息到列表
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, userMessage]);
    setLoading(true);
    
    // 模拟Agent响应
    setTimeout(() => {
      const agentMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `这是来自 ${agent?.name || 'Agent'} 的测试响应。实际开发中，这里应该调用后端API获取真实响应。`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      setLoading(false);
    }, 1000);
    
    setInputMessage('');
  };

  // 处理按键事件，按Enter发送消息
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card title="测试Agent" style={{ height: '100%' }}>
      <div style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
        <div 
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            border: '1px solid #d9d9d9', 
            borderRadius: '4px', 
            padding: '8px', 
            marginBottom: '16px' 
          }}
        >
          {messages.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={messages}
              renderItem={message => (
                <List.Item style={{ 
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  padding: '8px 0'
                }}>
                  <div style={{
                    maxWidth: '80%',
                    backgroundColor: message.role === 'user' ? '#e6f7ff' : '#f5f5f5',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    position: 'relative'
                  }}>
                    <div style={{ marginBottom: '4px' }}>
                      <Text strong>{message.role === 'user' ? '你' : agent?.name || 'Agent'}</Text>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {message.content}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px', textAlign: 'right' }}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div style={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#999'
            }}>
              发送消息开始测试对话
            </div>
          )}
        </div>
        <div style={{ display: 'flex' }}>
          <TextArea 
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入测试消息..." 
            autoSize={{ minRows: 2, maxRows: 6 }}
            style={{ marginRight: '8px', flex: 1 }}
          />
          <Button 
            type="primary" 
            icon={<SendOutlined />} 
            onClick={handleSendMessage}
            loading={loading}
          >
            发送
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AgentTester;