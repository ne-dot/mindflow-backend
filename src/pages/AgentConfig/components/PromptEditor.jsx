import { Card, Form, Input, Tabs, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { fetchAgentPrompts } from '../../../store/slices/promptsSlice';

const { TextArea } = Input;

const PromptEditor = ({ form }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeKey, setActiveKey] = useState('zh');

  // 获取Agent的prompts数据
  useEffect(() => {
    if (id) {
      dispatch(fetchAgentPrompts(id))
        .unwrap()
        .then(prompts => {
          if (prompts && prompts.length > 0) {
            const prompt = prompts[0]; // 获取第一个prompt
            
            // 更新表单中的prompt字段
            form.setFieldsValue({
              prompt_zh: prompt.content_zh,
              prompt_en: prompt.content_en
            });
          }
        });
    }
  }, [id, form, dispatch]);

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  return (
    <Card title="Prompts编辑">
      <Tabs activeKey={activeKey} onChange={handleTabChange}>
        <Tabs.TabPane tab="中文Prompt" key="zh">
          <Form form={form} layout="vertical">
            <Form.Item
              name="prompt_zh"
              rules={[{ required: true, message: '请输入中文Prompt' }]}
            >
              <TextArea rows={20} placeholder="请输入Agent的中文Prompt" />
            </Form.Item>
          </Form>
        </Tabs.TabPane>
        <Tabs.TabPane tab="英文Prompt" key="en">
          <Form form={form} layout="vertical">
            <Form.Item
              name="prompt_en"
              rules={[{ required: true, message: '请输入英文Prompt' }]}
            >
              <TextArea rows={20} placeholder="请输入Agent的英文Prompt" />
            </Form.Item>
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default PromptEditor;