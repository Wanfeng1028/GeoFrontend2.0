import { Alert, Button, Card, Space, Typography } from 'antd'
import { RocketOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

function App() {
  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={1}>GeoWork2.0</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Ant Design v6 基础接入完成
        </Text>

        <Button type="primary" icon={<RocketOutlined />} size="large">
          开始构建 GeoWork
        </Button>

        <Card title="当前阶段">
          <Text>AntD 基础接入 — 验证组件库可用</Text>
        </Card>

        <Alert
          type="info"
          showIcon
          message="下一步：接入主题系统（Bootstrap / Dark / System）"
        />
      </Space>
    </div>
  )
}

export default App
