import React from 'react';
import { Row, Col, Card, Statistic, Table, Typography } from 'antd';
import {
  UserOutlined,
  RobotOutlined,
  ToolOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const Dashboard = () => {
  // 模拟数据
  const recentUsers = [
    { id: 1, name: '张三', email: 'zhangsan@example.com', createdAt: '2023-05-15' },
    { id: 2, name: '李四', email: 'lisi@example.com', createdAt: '2023-05-14' },
    { id: 3, name: '王五', email: 'wangwu@example.com', createdAt: '2023-05-13' },
  ];

  const recentAgents = [
    { id: 1, name: '客服助手', type: 'Customer Service', createdAt: '2023-05-15' },
    { id: 2, name: '数据分析师', type: 'Data Analysis', createdAt: '2023-05-14' },
    { id: 3, name: '内容创作者', type: 'Content Creation', createdAt: '2023-05-13' },
  ];

  const columns = {
    users: [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: '姓名', dataIndex: 'name', key: 'name' },
      { title: '邮箱', dataIndex: 'email', key: 'email' },
      { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    ],
    agents: [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: '名称', dataIndex: 'name', key: 'name' },
      { title: '类型', dataIndex: 'type', key: 'type' },
      { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    ],
  };

  return (
    <div>
      <Title level={2}>仪表盘</Title>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={256}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Agent 总数"
              value={42}
              prefix={<RobotOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="工具总数"
              value={18}
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Prompt 总数"
              value={76}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="最近添加的用户">
            <Table
              dataSource={recentUsers}
              columns={columns.users}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="最近添加的 Agent">
            <Table
              dataSource={recentAgents}
              columns={columns.agents}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;