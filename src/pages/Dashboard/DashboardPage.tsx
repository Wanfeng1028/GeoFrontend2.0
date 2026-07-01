import { Card, Space, Typography, Empty } from 'antd'
import { MobileOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export function DashboardPage() {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2} style={{ margin: 0 }}>
          <MobileOutlined style={{ marginRight: 8 }} />
          移动端控制
        </Title>
        <Text type="secondary">管理已连接的移动设备，远程操控与任务下发</Text>
      </div>

      <Card>
        <Empty description="暂无已连接设备，接入设备后将在此显示" />
      </Card>
    </Space>
  )
}
