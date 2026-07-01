import { useCallback, useEffect, useRef, useState } from 'react'
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
  FolderOutlined,
  RocketOutlined,
  DatabaseOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  FileTextOutlined,
  AimOutlined,
  PieChartOutlined,
  SearchOutlined,
  RadarChartOutlined,
} from '@ant-design/icons'
import { ModelPicker } from './components/ModelPicker'
import styles from './NewTaskPage.module.css'

const { Title, Text } = Typography

/* File System Access API 局部类型声明
 * Web 版通过此 API 请求用户授权选择目录；
 * 绝对路径和更完整的文件系统权限将在 Electron 阶段接入。
 */
type GeoWorkDirectoryHandle = {
  kind: 'directory'
  name: string
}

type DirectoryPickerWindow = Window & {
  showDirectoryPicker?: (options?: {
    mode?: 'read' | 'readwrite'
  }) => Promise<GeoWorkDirectoryHandle>
}

const MODE_OPTIONS = [
  { key: 'general', label: '通用 GIS', icon: <GlobalOutlined />, desc: '通用地理信息系统任务' },
  { key: 'spatial', label: '空间分析', icon: <AimOutlined />, desc: '缓冲区、叠加、空间查询' },
  { key: 'cartography', label: '专题制图', icon: <PieChartOutlined />, desc: '生成专题地图和可视化' },
  { key: 'paper', label: '论文辅助', icon: <FileTextOutlined />, desc: '学术论文写作辅助' },
  { key: 'query', label: '数据查询', icon: <SearchOutlined />, desc: '属性与空间数据检索' },
  { key: 'remote-sensing', label: '遥感解译', icon: <RadarChartOutlined />, desc: '遥感影像处理与解译' },
]

const ATTACH_ITEMS = [
  { key: 'skill', icon: <ThunderboltOutlined />, label: '选择技能', msg: '技能选择面板后续接入' },
  { key: 'expert', icon: <RobotOutlined />, label: '选择专家', msg: '专家模式后续接入' },
  { key: 'mcp', icon: <GlobalOutlined />, label: '连接 MCP', msg: 'MCP 工具连接后续接入' },
  { key: 'file', icon: <CloudUploadOutlined />, label: '选择文件', msg: '文件选择后续接入' },
  { key: 'folder', icon: <FolderOutlined />, label: '选择文件夹', msg: '文件夹选择后续接入' },
  { key: 'image', icon: <FolderOpenOutlined />, label: '上传图片', msg: '图片上传后续接入' },
]

const WORKFLOW_STEPS = [
  {
    title: '导入空间数据',
    icon: <DatabaseOutlined />,
    desc: '选择 GeoJSON、Shapefile、栅格影像或示例数据作为分析输入。',
  },
  {
    title: '预览地图图层',
    icon: <EnvironmentOutlined />,
    desc: '在地图工作区查看图层范围、属性字段和坐标系统。',
  },
  {
    title: '运行空间分析',
    icon: <BarChartOutlined />,
    desc: '执行缓冲区、叠加分析、遥感指数或空间查询任务。',
  },
  {
    title: '生成报告',
    icon: <FileTextOutlined />,
    desc: '导出分析结果、地图截图、过程记录和可追溯报告。',
  },
]

/* 检测 prefers-reduced-motion */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

export function NewTaskPage() {
  const { message } = App.useApp()
  const { token } = theme.useToken()
  const reducedMotion = useReducedMotion()

  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('通用 GIS')
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false)
  const [model, setModel] = useState('Auto')
  const [workDir, setWorkDir] = useState<string | null>(null)
  const [focused, setFocused] = useState(false)

  /* GuidePanel Steps */
  const [activeStep, setActiveStep] = useState(0)
  const [guideHover, setGuideHover] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startAutoStep = useCallback(() => {
    if (reducedMotion) return
    intervalRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % WORKFLOW_STEPS.length)
    }, 1800)
  }, [reducedMotion])

  const stopAutoStep = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!guideHover) {
      startAutoStep()
    } else {
      stopAutoStep()
    }
    return stopAutoStep
  }, [guideHover, startAutoStep, stopAutoStep])

  const handleSend = () => {
    if (!prompt.trim()) {
      message.warning('请先描述你的任务')
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

  /* 模式下拉 - 卡片风格 */
  const modeDropdownRender = () => (
    <div
      className={styles.modeDropdown}
      style={{
        background: token.colorBgElevated,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      {MODE_OPTIONS.map((opt) => {
        const isActive = mode === opt.label
        return (
          <div
            key={opt.key}
            className={`${styles.modeItem} ${isActive ? styles.modeItemActive : ''}`}
            style={isActive ? { background: token.colorPrimaryBg } : undefined}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.background = token.colorFillSecondary
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = 'transparent'
            }}
            onClick={() => {
              setMode(opt.label)
              setModeDropdownOpen(false)
              message.info(`已切换到：${opt.label}`)
            }}
          >
            <span className={styles.modeItemIcon} style={{ color: isActive ? token.colorPrimary : token.colorTextSecondary }}>
              {opt.icon}
            </span>
            <div className={styles.modeItemContent}>
              <span className={styles.modeItemLabel}>{opt.label}</span>
              <span className={styles.modeItemDesc} style={{ color: token.colorTextTertiary }}>{opt.desc}</span>
            </div>
            {isActive && <CheckOutlined style={{ color: token.colorPrimary, fontSize: 12 }} />}
          </div>
        )
      })}
    </div>
  )

  /* 工作目录菜单 */
  const handlePickDirectory = async () => {
    const pickerWindow = window as DirectoryPickerWindow
    if (!pickerWindow.showDirectoryPicker) {
      message.warning('当前浏览器不支持直接选择文件夹，请使用 Chrome 或 Edge，或等待 Electron 版本接入原生目录选择')
      return
    }
    try {
      const handle = await pickerWindow.showDirectoryPicker({ mode: 'read' })
      setWorkDir(handle.name)
      message.success(`工作目录已设置为：${handle.name}`)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        message.info('已取消选择工作目录')
      } else {
        console.error(error)
        message.error('选择工作目录失败，请稍后重试')
      }
    }
  }

  const workDirMenu = {
    items: [
      {
        type: 'group' as const,
        label: '选择目录',
        children: [
          {
            key: 'choose-folder',
            icon: <FolderOpenOutlined />,
            label: '选择目录',
            onClick: handlePickDirectory,
          },
        ],
      },
      {
        type: 'group' as const,
        label: '最近的目录',
        children: [
          {
            key: 'geo-frontend',
            label: 'E:\\code\\javascript\\project\\GeoFrontend2.0',
            onClick: () => {
              setWorkDir('E:\\code\\javascript\\project\\GeoFrontend2.0')
              message.success('工作目录已设置为：E:\\code\\javascript\\project\\GeoFrontend2.0')
            },
          },
          {
            key: 'geowork',
            label: 'E:\\code\\javascript\\project\\GeoWork',
            onClick: () => {
              setWorkDir('E:\\code\\javascript\\project\\GeoWork')
              message.success('工作目录已设置为：E:\\code\\javascript\\project\\GeoWork')
            },
          },
        ],
      },
    ],
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
          用自然语言搞定空间智能工作流
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
                <Button type="dashed" icon={<PlusOutlined />} size="small" className={styles.iconBtn} />
              </Tooltip>
            </Dropdown>

            <Dropdown
              dropdownRender={modeDropdownRender}
              trigger={['click']}
              placement="topLeft"
              open={modeDropdownOpen}
              onOpenChange={setModeDropdownOpen}
            >
              <Button type="primary" ghost size="small" className={styles.modeBtn}>
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
                className={styles.iconBtn}
                onClick={() => message.info('语音输入后续接入')}
              />
            </Tooltip>

            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined />}
              className={styles.iconBtn}
              onClick={handleSend}
            />
          </div>
        </div>
      </div>

      {/* ── 工作目录 ── */}
      <div className={styles.workDirRow}>
        <Dropdown menu={workDirMenu} trigger={['click']} placement="bottomLeft" getPopupContainer={() => document.body}>
          <Button type="default" size="small" icon={<FolderOpenOutlined />}>
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
          background: `linear-gradient(135deg, ${token.colorWarningBg}, ${token.colorWarningBgHover})`,
          border: `1px solid ${token.colorWarningBorder}`,
        }}
        styles={{ body: { padding: '24px 28px' } }}
        onMouseEnter={() => setGuideHover(true)}
        onMouseLeave={() => setGuideHover(false)}
      >
        <div className={styles.guideContent}>
          <Space align="center">
            <RocketOutlined style={{ color: token.colorPrimary, fontSize: 18 }} />
            <Text strong style={{ fontSize: 16 }}>从一个空间问题开始</Text>
          </Space>
          <Text type="secondary" style={{ fontSize: 13, maxWidth: 480 }}>
            导入数据、选择工具、运行分析并导出报告。GeoWork 会把每一步记录为可追溯的工作流。
          </Text>

          <Steps
            current={activeStep}
            onChange={(idx) => setActiveStep(idx)}
            size="small"
            style={{ maxWidth: 600, width: '100%' }}
            items={WORKFLOW_STEPS.map((s) => ({
              title: s.title,
              icon: s.icon,
            }))}
          />

          <Text
            type="secondary"
            className={styles.guideStepDesc}
            style={{ opacity: 1 }}
          >
            {WORKFLOW_STEPS[activeStep].desc}
          </Text>

          <Button
            type="default"
            size="middle"
            onClick={() => message.info('工作流示例后续接入')}
          >
            查看工作流示例
          </Button>
        </div>
      </Card>
    </div>
  )
}
