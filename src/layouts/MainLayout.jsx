import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  ToolOutlined,
  RobotOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { logout } from '../store/slices/authSlice';
import './MainLayout.css';

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const items = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">仪表盘</Link>,
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: <Link to="/users">用户管理</Link>,
    },
    {
      key: 'agents',
      icon: <RobotOutlined />,
      label: <Link to="/agents">Agent 管理</Link>,
    },
    {
      key: 'tools',
      icon: <ToolOutlined />,
      label: <Link to="/tools">工具管理</Link>,
    },
    {
      key: 'models',
      icon: <FileTextOutlined />,
      label: <Link to="/models">模型管理</Link>,
    },
    {
      key: 'prompts',
      icon: <FileTextOutlined />,
      label: <Link to="/prompts">Prompt 管理</Link>,
    },
  ];

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        个人资料
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="layout-container">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">{collapsed ? 'Admin' : '后台管理系统'}</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname.split('/')[1] || 'dashboard']}
          items={items}
        />
      </Sider>
      <Layout>
        <Header className="header">
          <div className="header-content">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <Dropdown menu={userMenu} placement="bottomRight">
              <div className="user-dropdown">
                <Avatar icon={<UserOutlined />} />
                <span className="user-name">管理员</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
