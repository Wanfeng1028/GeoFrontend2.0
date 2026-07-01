import { Alert, Card, List, Space, Typography } from 'antd'

const { Title, Text } = Typography

const connectors = [
  { title: 'PostGIS', desc: '连接 PostgreSQL + PostGIS 空间数据库' },
  { title: 'GeoServer', desc: '连接 GeoServer 发布和管理地图服务' },
  { title: 'ArcGIS Online', desc: '连接 ArcGIS Online 资源' },
  { title: '本地文件', desc: '导入本地 GeoJSON / Shapefile / CSV 等文件' },
]

export function ConnectorsPage() {
  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>连接器</Title>
        <Text type="secondary">管理外部数据源和服务连接</Text>

        <Alert
          type="info"
          showIcon
          message="前端占位 — 连接器管理后续接入"
        />

        <Card title="可用连接器">
          <List
            dataSource={connectors}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta title={item.title} description={item.desc} />
              </List.Item>
            )}
          />
        </Card>
      </Space>
    </div>
  )
}
