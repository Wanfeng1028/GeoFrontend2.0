import { Alert, Card, List, Space, Typography } from 'antd'
import styles from './McpPage.module.css'

const { Title, Text } = Typography

const mcpTools = [
  { title: '文件系统 MCP', desc: '读写本地 GeoJSON / Shapefile / TIFF 等文件' },
  { title: '数据库 MCP', desc: '连接 PostGIS / SpatiaLite 空间数据库' },
  { title: '地图服务 MCP', desc: '调用 WMS / WFS / WMTS 标准地图服务' },
  { title: '模型工具 MCP', desc: '对接空间分析模型与算法服务' },
]

export function McpPage() {
  return (
    <div className={styles.root}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>MCP</Title>
        <Text type="secondary">Model Context Protocol 工具连接</Text>

        <Alert
          type="info"
          showIcon
          message="前端占位 — MCP 工具连接后续接入"
        />

        <Card title="可用 MCP">
          <List
            dataSource={mcpTools}
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
