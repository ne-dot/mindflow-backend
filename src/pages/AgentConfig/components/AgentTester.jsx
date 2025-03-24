import { SendOutlined } from '@ant-design/icons';
import { Card, Input, Button, List, Typography, message, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { triggerAgentAction } from '../../../store/slices/agentsSlice';

const { TextArea } = Input;
const { Text, Title, Paragraph } = Typography;

// 渲染新闻卡片组件
const NewsCard = ({ newsItem }) => (
  <Card 
    hoverable
    style={{ marginBottom: 16 }}
    cover={newsItem.image_url ? <img alt={newsItem.title} src={newsItem.image_url} /> : null}
  >
    <Card.Meta
      title={<a href={newsItem.link} target="_blank" rel="noopener noreferrer">{newsItem.title}</a>}
      description={
        <>
          <Paragraph ellipsis={{ rows: 2 }}>{newsItem.description}</Paragraph>
          <div style={{ marginTop: 8 }}>
            <Text type="secondary">
              {new Date(newsItem.published_date).toLocaleDateString()} · {newsItem.source}
            </Text>
          </div>
          <div style={{ marginTop: 8 }}>
            {newsItem.categories?.map(category => (
              <Tag key={category} color="blue">{category}</Tag>
            ))}
            {newsItem.keywords?.map(keyword => (
              <Tag key={keyword}>{keyword.trim()}</Tag>
            ))}
          </div>
        </>
      }
    />
  </Card>
);

// 渲染工具结果组件
const ToolResults = ({ toolResults }) => {
  if (!toolResults) return null;
  
  return (
    <div style={{ marginTop: 16, marginBottom: 16 }}>
      {Object.entries(toolResults).map(([toolName, result]) => (
        <div key={toolName}>
          <Title level={5} style={{ marginBottom: 16 }}>
            工具结果: {toolName}
          </Title>
          
          {/* 新闻工具结果 */}
          {result.news_items && (
            <div>
              {result.news_items.map((newsItem, index) => (
                <NewsCard key={index} newsItem={newsItem} />
              ))}
            </div>
          )}
          
          {/* 其他类型的工具结果可以在这里添加 */}
        </div>
      ))}
    </div>
  );
};

const AgentTester = ({ agent }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { triggeringAgent, agentResponse, error } = useSelector(state => state.agents);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // 监听 Redux 中的 agentResponse 变化
  useEffect(() => {
    if (agentResponse && agentResponse.ai_response) {
      // 添加 Agent 响应到消息列表
      const agentMessage = {
        id: Date.now(),
        role: 'assistant',
        content: agentResponse.ai_response,
        timestamp: new Date().toISOString(),
        toolResults: agentResponse.tool_results
      };
      
      setMessages(prev => [...prev.filter(msg => msg.role !== 'typing'), agentMessage]);
    }
  }, [agentResponse]);

  // 监听错误信息
  useEffect(() => {
    if (error) {
      message.error(`触发Agent失败: ${error}`);
    }
  }, [error]);

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
    
    // 添加一个临时的"正在输入"消息
    const typingMessage = {
      id: Date.now() + 1,
      role: 'typing',
      content: '正在思考...',
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, userMessage, typingMessage]);
    
    // 使用 Redux action 触发 Agent
    dispatch(triggerAgentAction({ 
      agentId: id || agent?.id, 
      query: inputMessage 
    }));
    
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
                  padding: '8px 0',
                  flexDirection: 'column',
                  alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
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
                  
                  {/* 渲染工具结果 */}
                  {message.toolResults && (
                    <div style={{ maxWidth: '80%', marginTop: 8 }}>
                      <ToolResults toolResults={message.toolResults} />
                    </div>
                  )}
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
            loading={triggeringAgent}
          >
            发送
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AgentTester;