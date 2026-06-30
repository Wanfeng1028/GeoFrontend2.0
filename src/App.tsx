import { Alert, Button, Card, Segmented, Space, Tag, Typography } from 'antd'
import { RocketOutlined } from '@ant-design/icons'
import { useAppearanceStore } from './shared/stores/appearanceStore'
import type { Appearance } from './shared/stores/appearanceStore'

const { Title, Text } = Typography

function App() {
  const appearance = useAppearanceStore((s) => s.appearance)
  const resolvedAppearance = useAppearanceStore((s) => s.resolvedAppearance)
  const setAppearance = useAppearanceStore((s) => s.setAppearance)

  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={1}>GeoWork2.0</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Ant Design v6 主题系统接入完成
        </Text>

        <Segmented
          value={appearance}
          onChange={(value) => setAppearance(value as Appearance)}
          options={[
            { label: 'Bootstrap', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'System', value: 'system' },
          ]}
        />

        <Card title="主题状态">
          <Space direction="vertical">
            <Text>
              appearance: <Tag color="blue">{appearance}</Tag>
            </Text>
            <Text>
              resolvedAppearance: <Tag color="green">{resolvedAppearance}</Tag>
            </Text>
          </Space>
        </Card>

        <Alert
          type="info"
          showIcon
          message="下一步：接入 AppShell（Layout / Sider / Menu / Content）"
        />

        <Button type="primary" icon={<RocketOutlined />} size="large">
          开始构建 GeoWork
        </Button>
      </Space>
    </div>
  )
}

export default App
