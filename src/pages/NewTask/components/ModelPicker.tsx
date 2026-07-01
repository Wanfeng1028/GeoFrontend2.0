import { useState } from 'react'
import {
  Alert,
  App,
  Button,
  Dropdown,
  Modal,
  Slider,
  Space,
  Switch,
  Tag,
  Typography,
  theme,
} from 'antd'
import {
  CheckOutlined,
  ThunderboltOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import styles from './ModelPicker.module.css'

const { Text } = Typography

interface ModelOption {
  key: string
  name: string
  icon: React.ReactNode
  tag?: string
  tagColor?: string
  rate?: string
}

const MODELS: ModelOption[] = [
  { key: 'auto', name: 'Auto', icon: <ThunderboltOutlined />, tag: '推荐', tagColor: 'blue', rate: '0.5x' },
  { key: 'qwen37-max', name: 'Qwen3.7-Max', icon: <ThunderboltOutlined />, rate: '0.25x' },
  { key: 'qwen37-plus', name: 'Qwen3.7-Plus', icon: <ThunderboltOutlined />, rate: '0.1x' },
  { key: 'qwen36-flash', name: 'Qwen3.6-Flash', icon: <ThunderboltOutlined />, rate: '0.1x' },
  { key: 'deepseek-v4-pro', name: 'DeepSeek-V4-Pro', icon: <ThunderboltOutlined />, rate: '0.5x' },
  { key: 'deepseek-v4-flash', name: 'DeepSeek-V4-Flash', icon: <ThunderboltOutlined />, rate: '0.1x' },
  { key: 'glm-52', name: 'GLM-5.2', icon: <ThunderboltOutlined />, rate: '0.6x' },
]

interface ModelPickerProps {
  model: string
  onModelChange: (model: string) => void
}

export function ModelPicker({ model, onModelChange }: ModelPickerProps) {
  const { message } = App.useApp()
  const { token } = theme.useToken()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  /* 模型设置状态 */
  const [modelSettings, setModelSettings] = useState<Record<string, { enabled: boolean; contextLen: number }>>({
    'qwen37-max': { enabled: true, contextLen: 32000 },
    'qwen37-plus': { enabled: true, contextLen: 128000 },
    'qwen36-flash': { enabled: true, contextLen: 128000 },
    'deepseek-v4-pro': { enabled: true, contextLen: 64000 },
    'deepseek-v4-flash': { enabled: true, contextLen: 64000 },
    'glm-52': { enabled: true, contextLen: 128000 },
  })

  const handleSettingsSave = () => {
    message.success('模型设置已保存到前端状态，后续将接入持久化')
    setSettingsOpen(false)
  }

  const handleOpenSettings = () => {
    setDropdownOpen(false)
    setSettingsOpen(true)
  }

  const dropdownContent = (
    <div
      className={styles.pickerContent}
      style={{ background: token.colorBgElevated, boxShadow: token.boxShadowSecondary }}
    >
      <div className={styles.pickerAlert}>
        <Alert
          type="info"
          showIcon
          message="当前为前端模型选择占位，后续接入真实模型网关"
          style={{ fontSize: 12 }}
        />
      </div>

      <div className={styles.modelList}>
        {MODELS.map((m) => {
          const isSelected = model === m.name
          return (
            <div
              key={m.key}
              className={styles.modelItem}
              style={{
                background: isSelected ? token.colorFillSecondary : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.background = token.colorFillTertiary
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.background = 'transparent'
              }}
              onClick={() => {
                onModelChange(m.name)
                setDropdownOpen(false)
                message.info(`已切换到：${m.name}`)
              }}
            >
              <span className={styles.modelItemIcon} style={{ color: token.colorTextSecondary }}>
                {m.icon}
              </span>
              <span className={styles.modelItemName}>
                <Text style={{ color: token.colorText }}>{m.name}</Text>
              </span>
              <span className={styles.modelItemMeta}>
                <Space size={4}>
                  {m.tag && <Tag color={m.tagColor} style={{ margin: 0, fontSize: 11 }}>{m.tag}</Tag>}
                  {m.rate && <Text type="secondary" style={{ fontSize: 11 }}>{m.rate}</Text>}
                  {isSelected && <CheckOutlined style={{ color: token.colorPrimary }} />}
                </Space>
              </span>
            </div>
          )
        })}
      </div>

      <div
        style={{ borderTop: `1px solid ${token.colorBorderSecondary}` }}
        className={styles.pickerFooter}
      >
        <Button
          type="text"
          icon={<SettingOutlined />}
          block
          onClick={handleOpenSettings}
        >
          模型设置
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <Dropdown
        open={dropdownOpen}
        onOpenChange={setDropdownOpen}
        dropdownRender={() => dropdownContent}
        trigger={['click']}
        placement="topRight"
        getPopupContainer={() => document.body}
      >
        <Button color="purple" variant="filled" size="small" shape="round" className={styles.modelButton}>
          <Space size={4}>
            <ThunderboltOutlined />
            {model}
          </Space>
        </Button>
      </Dropdown>

      <Modal
        title="模型设置"
        open={settingsOpen}
        onCancel={() => setSettingsOpen(false)}
        footer={
          <Space>
            <Button onClick={() => setSettingsOpen(false)}>取消</Button>
            <Button type="primary" onClick={handleSettingsSave}>保存</Button>
          </Space>
        }
        width={560}
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          设置模型在选择器中的显示与隐藏，以及上下文长度
        </Text>

        {MODELS.filter((m) => m.key !== 'auto').map((m) => {
          const key = m.key
          const setting = modelSettings[key] ?? { enabled: true, contextLen: 64000 }
          return (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 0',
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <span style={{ width: 20, textAlign: 'center', color: token.colorTextSecondary }}>
                {m.icon}
              </span>
              <Text style={{ flex: '0 0 140px', fontSize: 13 }}>{m.name}</Text>
              <Switch
                size="small"
                checked={setting.enabled}
                onChange={(checked) => {
                  setModelSettings((prev) => ({
                    ...prev,
                    [key]: { ...prev[key], enabled: checked },
                  }))
                }}
              />
              <Slider
                style={{ flex: 1 }}
                min={8000}
                max={1000000}
                step={8000}
                value={setting.contextLen}
                onChange={(val) => {
                  setModelSettings((prev) => ({
                    ...prev,
                    [key]: { ...prev[key], contextLen: val },
                  }))
                }}
                tooltip={{ formatter: (v) => v ? `${Math.round(v / 1000)}K` : '' }}
              />
            </div>
          )
        })}
      </Modal>
    </>
  )
}
