import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const LoginCard = styled(Card)`
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const LoginTitle = styled.h2`
  text-align: center;
  margin-bottom: 24px;
`;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    // 这里应该是实际的登录API调用
    console.log('登录信息:', values);
    
    // 模拟登录成功
    if (values.username === 'admin' && values.password === 'admin123') {
      localStorage.setItem('token', 'fake-jwt-token');
      message.success('登录成功');
      navigate('/dashboard');
    } else {
      message.error('用户名或密码错误');
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>后台管理系统</LoginTitle>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;