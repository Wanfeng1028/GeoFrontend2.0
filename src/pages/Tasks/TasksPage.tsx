import { Alert, Card, Space, Typography } from 'antd'

const { Title, Text } = Typography

export function TasksPage() {
  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>Tasks</Title>
        <Text type="secondary">任务队列、运行日志、状态流转</Text>

        <Card title="当前阶段">
          <Text>路由占位 — 等待任务管理功能接入</Text>
        </Card>

        <Alert type="info" showIcon message="此页面为路由占位，尚未接入任务系统。" />
      </Space>
    </div>
  )
}
