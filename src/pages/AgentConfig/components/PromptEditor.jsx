import { Card, Form, Input, Tabs, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { fetchAgentPrompts } from '../../../store/slices/promptsSlice';

const { TextArea } = Input;

const PromptEditor = ({ form }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeKey, setActiveKey] = useState('zh');
  const [loading, setLoading] = useState(false);
  // 直接从Redux store获取prompts数据
  const { prompts } = useSelector(state => state.prompts);
  
  // 获取Agent的prompts数据
  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(fetchAgentPrompts(id))
        .unwrap()
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, dispatch]);

  // 当prompts数据更新时，更新表单
  useEffect(() => {
    if (prompts && prompts.length > 0) {
      const prompt = prompts[0]; // 获取第一个prompt
      
      // 更新表单中的prompt字段
      form.setFieldsValue({
        prompt_zh: prompt.content_zh,
        prompt_en: prompt.content_en
      });
    }
  }, [prompts, form]);

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  // 定义Tabs的items配置
  const tabItems = [
    {
      key: 'zh',
      label: '中文Prompt',
      children: (
        <Form.Item
          name="prompt_zh"
          rules={[{ required: true, message: '请输入中文Prompt' }]}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin tip="加载Prompt中..." />
            </div>
          ) : (
            <TextArea rows={20} placeholder="请输入Agent的中文Prompt" />
          )}
        </Form.Item>
      )
    },
    {
      key: 'en',
      label: '英文Prompt',
      children: (
        <Form.Item
          name="prompt_en"
          rules={[{ required: true, message: '请输入英文Prompt' }]}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin tip="加载Prompt中..." />
            </div>
          ) : (
            <TextArea rows={20} placeholder="请输入Agent的英文Prompt" />
          )}
        </Form.Item>
      )
    }
  ];

  return (
    <Card title="Prompts编辑">
      <Form form={form} layout="vertical">
        {/* 添加隐藏的表单项，确保prompt_en始终存在 */}
        <Form.Item name="prompt_en" hidden={true}>
          <Input />
        </Form.Item>
        
        <Tabs 
          activeKey={activeKey} 
          onChange={handleTabChange} 
          items={tabItems}
        />
      </Form>
    </Card>
  );
};

export default PromptEditor;