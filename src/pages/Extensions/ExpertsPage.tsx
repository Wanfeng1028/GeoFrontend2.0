import { Alert, Card, List, Space, Typography } from 'antd'
import styles from './ExpertsPage.module.css'

const { Title, Text } = Typography

const experts = [
  { title: 'GIS 空间分析专家', desc: '缓冲区、叠加、网络分析等空间操作' },
  { title: '遥感影像专家', desc: '影像分类、变化检测、NDVI 计算' },
  { title: '制图专家', desc: '专题地图、符号化、标注策略' },
  { title: '论文写作专家', desc: '地理学论文结构、数据可视化建议' },
]

export function ExpertsPage() {
  return (
    <div className={styles.root}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>专家</Title>
        <Text type="secondary">预置的领域专家，辅助空间分析工作流</Text>

        <Alert
          type="info"
          showIcon
          message="前端占位 — 专家能力后续接入"
        />

        <Card title="可用专家">
          <List
            dataSource={experts}
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
