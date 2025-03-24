import { SearchOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { Table, Card, Typography, Tag, Space, Button, DatePicker, Input, Select, Modal, message } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAgentTriggersAction } from '../store/slices/agentTriggersSlice';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AgentTriggers = () => {
  const dispatch = useDispatch();
  const { triggerRecords, agents, loading, error } = useSelector(state => state.agentTriggers);
  const [searchParams, setSearchParams] = useState({
    agentId: undefined,
    dateRange: null,
    query: '',
    page: 1,
    pageSize: 10,
    status: undefined
  });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // 获取触发记录和Agent列表
  useEffect(() => {
    dispatch(fetchAgentTriggersAction(searchParams));
  }, [dispatch, searchParams]);

  // 监听错误信息
  useEffect(() => {
    if (error) {
      message.error(`操作失败: ${error}`);
    }
  }, [error]);

  // 处理搜索
  const handleSearch = () => {
    setSearchParams({
      ...searchParams,
      page: 1 // 重置到第一页
    });
  };

  // 处理重置
  const handleReset = () => {
    setSearchParams({
      agentId: undefined,
      dateRange: null,
      query: '',
      page: 1,
      pageSize: 10,
      status: undefined
    });
  };

  // 处理分页变化
  const handleTableChange = (pagination) => {
    setSearchParams({
      ...searchParams,
      page: pagination.current,
      pageSize: pagination.pageSize
    });
  };

  // 查看详情
  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: 'Agent',
      dataIndex: 'agent_name',
      key: 'agent_name',
      width: 150,
    },
    {
      title: '查询',
      dataIndex: 'query',
      key: 'query',
      ellipsis: true,
      width: 150,
    },
    {
      title: '响应',
      dataIndex: 'response',
      key: 'response',
      ellipsis: true,
      width: 300,
      render: text => (
        <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
          <Paragraph style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
            {text}
          </Paragraph>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: status => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status === 'success' ? '成功' : '失败'}
        </Tag>
      )
    },
    {
      title: '耗时',
      dataIndex: 'cost_time',
      key: 'cost_time',
      width: 100,
      render: time => `${(time / 1000).toFixed(2)}s`
    },
    {
      title: '触发时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: date => moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>Agent触发记录</Title>
      </div>
      
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Text strong style={{ marginRight: 8 }}>Agent:</Text>
            <Select 
              style={{ width: 200 }} 
              placeholder="选择Agent"
              allowClear
              value={searchParams.agentId}
              onChange={value => setSearchParams({ ...searchParams, agentId: value })}
            >
              {agents && agents.map(agent => (
                <Option key={agent.id} value={agent.id}>{agent.name}</Option>
              ))}
            </Select>
          </div>
          
          <div>
            <Text strong style={{ marginRight: 8 }}>状态:</Text>
            <Select 
              style={{ width: 120 }} 
              placeholder="选择状态"
              allowClear
              value={searchParams.status}
              onChange={value => setSearchParams({ ...searchParams, status: value })}
            >
              <Option value="success">成功</Option>
              <Option value="failed">失败</Option>
            </Select>
          </div>
          
          <div>
            <Text strong style={{ marginRight: 8 }}>时间范围:</Text>
            <RangePicker 
              value={searchParams.dateRange}
              onChange={dates => setSearchParams({ ...searchParams, dateRange: dates })}
            />
          </div>
          
          <div>
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              onClick={handleSearch}
              style={{ marginRight: 8 }}
            >
              搜索
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleReset}
            >
              重置
            </Button>
          </div>
        </div>
      </Card>
      
      <Table 
        columns={columns} 
        dataSource={triggerRecords?.items || []} 
        rowKey="id"
        loading={loading}
        pagination={{
          current: searchParams.page,
          pageSize: searchParams.pageSize,
          total: triggerRecords?.total || 0,
          showSizeChanger: true,
          showTotal: total => `共 ${total} 条记录`
        }}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
      />
      
      {/* 详情弹窗 */}
      {selectedRecord && (
        <Modal
          title="触发记录详情"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              关闭
            </Button>
          ]}
          width={800}
        >
          <div style={{ marginBottom: 16 }}>
            <Text strong>Agent: </Text>
            <Text>{selectedRecord.agent_name}</Text>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <Text strong>查询: </Text>
            <Text>{selectedRecord.query}</Text>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <Text strong>响应: </Text>
            <div style={{ 
              whiteSpace: 'pre-wrap', 
              background: '#f5f5f5', 
              padding: 16, 
              borderRadius: 4 
            }}>
              {selectedRecord.response}
            </div>
          </div>
          
          {selectedRecord.used_tools && selectedRecord.used_tools.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Text strong>使用工具: </Text>
              <div>
                {selectedRecord.used_tools.map(tool => (
                  <Tag color="blue" key={tool}>
                    {tool}
                  </Tag>
                ))}
              </div>
            </div>
          )}
          
          {selectedRecord.tool_results && (
            <div style={{ marginBottom: 16 }}>
              <Text strong>工具结果: </Text>
              <div style={{ 
                whiteSpace: 'pre-wrap', 
                background: '#f5f5f5', 
                padding: 16, 
                borderRadius: 4 
              }}>
                <pre>{JSON.stringify(selectedRecord.tool_results, null, 2)}</pre>
              </div>
            </div>
          )}
          
          <div>
            <Text strong>触发时间: </Text>
            <Text>{moment(selectedRecord.created_at).format('YYYY-MM-DD HH:mm:ss')}</Text>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AgentTriggers;