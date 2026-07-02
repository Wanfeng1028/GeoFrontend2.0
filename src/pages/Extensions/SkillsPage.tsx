import { Alert, Card, List, Space, Typography } from 'antd'
import styles from './SkillsPage.module.css'

const { Title, Text } = Typography

const skills = [
  { title: '缓冲区分析', desc: '基于点线面生成指定距离的缓冲区' },
  { title: '叠加分析', desc: '多图层叠加求交、求并、裁剪' },
  { title: 'NDVI 计算', desc: '基于多光谱遥感影像计算植被指数' },
  { title: '坐标转换', desc: 'WGS84 / CGCS2000 / 投影坐标系互转' },
]

export function SkillsPage() {
  return (
    <div className={styles.root}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>技能</Title>
        <Text type="secondary">可调用的空间分析技能</Text>

        <Alert
          type="info"
          showIcon
          message="前端占位 — 技能市场后续接入"
        />

        <Card title="可用技能">
          <List
            dataSource={skills}
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
