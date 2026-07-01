import { useState } from 'react'
import {
  App,
  Button,
  Card,
  Dropdown,
  Input,
  Space,
  Steps,
  Tooltip,
  Typography,
  theme,
} from 'antd'
import {
  PlusOutlined,
  SendOutlined,
  AudioOutlined,
  ThunderboltOutlined,
  FolderOpenOutlined,
  CheckOutlined,
  GlobalOutlined,
  RobotOutlined,
  CloudUploadOutlined,
  FileImageOutlined,
  FolderOutlined,
  RocketOutlined,
  DatabaseOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { ModelPicker } from './components/ModelPicker'
import styles from './NewTaskPage.module.css'

const { Title, Text } = Typography

const MODE_OPTIONS = [
  { key: 'general', label: '通用 GIS' },
  { key: 'spatial', label: '空间分析' },
  { key: 'cartography', label: '专题制图' },
  { key: 'paper', label: '论文辅助' },
  { key: 'query', label: '数据查询' },
  { key: 'remote-sensing', label: '遥感解译' },
]

const ATTACH_ITEMS = [
  { key: 'skill', icon: <ThunderboltOutlined />, label: '选择技能', msg: '技能选择面板后续接入' },
  { key: 'expert', icon: <RobotOutlined />, label: '选择专家', msg: '专家模式后续接入' },
  { key: 'mcp', icon: <GlobalOutlined />, label: '连接 MCP', msg: 'MCP 工具连接后续接入' },
  { key: 'file', icon: <CloudUploadOutlined />, label: '选择文件', msg: '文件选择后续接入' },
  { key: 'folder', icon: <FolderOutlined />, label: '选择文件夹', msg: '文件夹选择后续接入' },
  { key: 'image', icon: <FileImageOutlined />, label: '上传图片', msg: '图片上传后续接入' },
]

const WORK_DIR_ITEMS = [
  {
    type: 'group' as const,
    label: '操作',
    children: [
      { key: 'choose', label: '选择目录…', action: 'msg' as const, msg: '文件夹选择后续接入' },
    ],
  },
  {
    type: 'group' as const,
    label: '最近使用的目录',
    children: [
      { key: 'geo-frontend', label: 'GeoFrontend2.0', action: 'select' as const, msg: '' },
      { key: 'geowork', label: 'GeoWork', action: 'select' as const, msg: '' },
    ],
  },
  {
    type: 'group' as const,
    label: '示例工作空间',
    children: [
      { key: 'road-network', label: '城市路网分析', action: 'select' as const, msg: '' },
      { key: 'remote-sensing', label: '遥感影像处理', action: 'select' as const, msg: '' },
      { key: 'land-use', label: '土地利用制图', action: 'select' as const, msg: '' },
    ],
  },
]

export function NewTaskPage() {
  const { message } = App.useApp()
  const { token } = theme.useToken()

  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('通用 GIS')
  const [model, setModel] = useState('Auto')
  const [workDir, setWorkDir] = useState<string | null>(null)
  const [focused, setFocused] = useState(false)

  const handleSend = () => {
    if (!prompt.trim()) {
      message.warning('请先描述你的 GIS 任务')
      return
    }
    message.success('任务已进入前端队列，后续将接入真实执行流程')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  /* 加号菜单 */
  const attachMenu = {
    items: ATTACH_ITEMS.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      onClick: () => message.info(item.msg),
    })),
  }

  /* 模式菜单 */
  const modeMenu = {
    items: MODE_OPTIONS.map((opt) => ({
      key: opt.key,
      label: (
        <Space>
          {opt.label}
          {mode === opt.label && <CheckOutlined />}
        </Space>
      ),
      onClick: () => {
        setMode(opt.label)
        message.info(`已切换到：${opt.label}`)
      },
    })),
  }

  /* 工作目录菜单 */
  const workDirMenu = {
    items: WORK_DIR_ITEMS.map((group) => ({
      type: 'group' as const,
      label: group.label,
      children: group.children.map((child) => ({
        key: child.key,
        label: child.label,
        onClick: () => {
          if (child.action === 'msg') {
            message.info(child.msg)
          } else {
            setWorkDir(child.label)
          }
        },
      })),
    })),
  }

  return (
    <div className={styles.root}>
      {/* ── Hero ── */}
      <div className={styles.hero}>
        <svg
          className={styles.heroLogo}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="4" y="4" width="56" height="56" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          <line x1="4" y1="24" x2="60" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
          <line x1="4" y1="44" x2="60" y2="44" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
          <line x1="24" y1="4" x2="24" y2="60" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
          <line x1="44" y1="4" x2="44" y2="60" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
          <circle cx="32" cy="28" r="5" fill={token.colorPrimary} opacity="0.85" />
          <path d="M32 33 L28 28 A4 4 0 1 1 36 28 Z" fill={token.colorPrimary} />
          <path d="M12 50 L32 40 L52 50 L32 60 Z" stroke="currentColor" strokeWidth="1.5" fill={token.colorPrimary} opacity="0.12" />
          <path d="M12 46 L32 36 L52 46" stroke="currentColor" strokeWidth="1.5" opacity="0.3" fill="none" />
        </svg>

        <Title level={2} className={styles.heroTitle} style={{ color: token.colorText }}>
          不止聊天，搞定空间智能工作流
        </Title>
        <Text type="secondary" className={styles.heroSubtitle}>
          用自然语言连接数据、地图、模型与工具，完成可追溯的 GIS 分析。
        </Text>
      </div>

      {/* ── Composer ── */}
      <div
        className={styles.composer}
        style={{
          background: token.colorBgContainer,
          border: `1px solid ${focused ? token.colorPrimary : token.colorBorderSecondary}`,
          boxShadow: focused
            ? `0 0 0 2px ${token.colorPrimaryBg}`
            : token.boxShadow,
        }}
      >
        <Input.TextArea
          className={styles.composerTextarea}
          placeholder="描述你的 GIS 任务，例如：分析地块缓冲区、生成专题图、查询遥感数据……"
          autoSize={{ minRows: 2, maxRows: 5 }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          variant="borderless"
          style={{ fontSize: 14, padding: '10px 14px' }}
        />

        {/* 工具栏 */}
        <div
          className={styles.toolbar}
          style={{ borderTop: `1px solid ${token.colorBorderSecondary}` }}
        >
          <div className={styles.toolbarLeft}>
            <Dropdown menu={attachMenu} trigger={['click']} placement="topLeft">
              <Tooltip title="添加附件">
                <Button type="text" icon={<PlusOutlined />} size="middle" />
              </Tooltip>
            </Dropdown>

            <Dropdown menu={modeMenu} trigger={['click']} placement="topLeft">
              <Button type="primary" ghost size="small">
                <Space size={4}>
                  <ThunderboltOutlined />
                  {mode}
                </Space>
              </Button>
            </Dropdown>
          </div>

          <div className={styles.toolbarRight}>
            <ModelPicker model={model} onModelChange={setModel} />

            <Tooltip title="语音输入">
              <Button
                type="text"
                icon={<AudioOutlined />}
                size="middle"
                onClick={() => message.info('语音输入后续接入')}
              />
            </Tooltip>

            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined />}
              size="middle"
              onClick={handleSend}
            />
          </div>
        </div>
      </div>

      {/* ── 工作目录 ── */}
      <div className={styles.workDirRow}>
        <Dropdown menu={workDirMenu} trigger={['click']} placement="bottomLeft" getPopupContainer={() => document.body}>
          <Button type="text" size="small" icon={<FolderOpenOutlined />}>
            选择工作目录
          </Button>
        </Dropdown>
        <Text type="secondary" style={{ fontSize: 12 }}>
          当前工作目录：{workDir ?? '未选择'}
        </Text>
      </div>

      {/* ── 引导模块 ── */}
      <Card
        className={styles.guidePanel}
        style={{
          background: token.colorBgContainer,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
        styles={{ body: { padding: '20px 24px' } }}
      >
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Space align="center">
            <RocketOutlined style={{ color: token.colorPrimary, fontSize: 18 }} />
            <Text strong style={{ fontSize: 15 }}>从一个空间问题开始</Text>
          </Space>
          <Text type="secondary" style={{ fontSize: 13 }}>
            导入数据、选择工具、运行分析并导出报告。GeoWork 会把每一步记录为可追溯的工作流。
          </Text>

          <Steps
            size="small"
            items={[
              { title: '导入空间数据', icon: <DatabaseOutlined /> },
              { title: '预览地图图层', icon: <EnvironmentOutlined /> },
              { title: '运行空间分析', icon: <BarChartOutlined /> },
              { title: '生成报告', icon: <FileTextOutlined /> },
            ]}
          />

          <Button
            type="primary"
            size="small"
            onClick={() => message.info('工作流示例后续接入')}
          >
            查看工作流示例
          </Button>
        </Space>
      </Card>
    </div>
  )
}
