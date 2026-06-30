import { Alert, Card, Space, Typography } from 'antd'

const { Title, Text } = Typography

export function DashboardPage() {
  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>Dashboard</Title>
        <Text type="secondary">工作区概览、任务趋势、数据资产统计</Text>

        <Card title="当前阶段">
          <Text>路由占位 — 等待 AppShell 和业务内容接入</Text>
        </Card>

        <Alert type="info" showIcon message="此页面为路由占位，尚未接入真实业务数据。" />
      </Space>
    </div>
  )
}
