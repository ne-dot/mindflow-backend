import { Card, Form, Input } from 'antd';
import React from 'react';

const { TextArea } = Input;

const PromptEditor = ({ form }) => {
  return (
    <Card title="Prompts编辑" bordered={false}>
      <Form form={form} layout="vertical">
        <Form.Item
          name="prompt"
          rules={[{ required: true, message: '请输入Prompt' }]}
        >
          <TextArea rows={20} placeholder="请输入Agent的Prompt" />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PromptEditor;