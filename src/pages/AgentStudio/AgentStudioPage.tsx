import { Alert, Card, Space, Typography } from 'antd'

const { Title, Text } = Typography

export function AgentStudioPage() {
  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>AgentStudio</Title>
        <Text type="secondary">模型配置、工具调用、插件管理</Text>

        <Card title="当前阶段">
          <Text>路由占位 — 等待 Agent 配置功能接入</Text>
        </Card>

        <Alert type="info" showIcon message="此页面为路由占位，尚未接入 Agent 能力。" />
      </Space>
    </div>
  )
}
