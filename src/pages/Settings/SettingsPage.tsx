import { Alert, Card, Segmented, Space, Tag, Typography } from 'antd'
import { useAppearanceStore } from '../../shared/stores/appearanceStore'
import type { Appearance } from '../../shared/stores/appearanceStore'
import styles from './SettingsPage.module.css'

const { Title, Text } = Typography

export function SettingsPage() {
  const appearance = useAppearanceStore((s) => s.appearance)
  const resolvedAppearance = useAppearanceStore((s) => s.resolvedAppearance)
  const setAppearance = useAppearanceStore((s) => s.setAppearance)

  return (
    <div className={styles.root}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>Settings</Title>
        <Text type="secondary">主题、模型、运行时、插件配置</Text>

        <Card title="主题切换">
          <Space direction="vertical">
            <Segmented
              value={appearance}
              onChange={(value) => setAppearance(value as Appearance)}
              options={[
                { label: '默认亮色', value: 'light' },
                { label: '暗色', value: 'dark' },
                { label: '跟随系统', value: 'system' },
                { label: '插画风格', value: 'illustration' },
                { label: '玻璃风格', value: 'glass' },
              ]}
            />
            <Text>
              appearance: <Tag color="blue">{appearance}</Tag>
            </Text>
            <Text>
              resolvedAppearance: <Tag color="green">{resolvedAppearance}</Tag>
            </Text>
          </Space>
        </Card>

        <Alert type="info" showIcon message="此页面为路由占位，后续会扩展完整配置项。" />
      </Space>
    </div>
  )
}
