import { useRef, useState } from 'react'
import {
  App,
  BorderBeam,
  Button,
  Dropdown,
  Input,
  Space,
  Tooltip,
  Tour,
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
  AimOutlined,
  PieChartOutlined,
  FileTextOutlined,
  SearchOutlined,
  RadarChartOutlined,
} from '@ant-design/icons'
import { ModelPicker } from './components/ModelPicker'
import { WorkflowGuideCard } from './components/WorkflowGuideCard'
import { useAppearanceStore } from '../../shared/stores/appearanceStore'
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

export function NewTaskPage() {
  const { message } = App.useApp()
  const { token } = theme.useToken()
  const { appearance } = useAppearanceStore()
  const isLight = appearance === 'light'

  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('通用 GIS')
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false)
  const [model, setModel] = useState('Auto')
  const [workDir, setWorkDir] = useState<string | null>(null)
  const [focused, setFocused] = useState(false)

  /* Tour */
  const [tourOpen, setTourOpen] = useState(false)
  const composerRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const modeBtnRef = useRef<HTMLButtonElement>(null)
  const modelPickerRef = useRef<HTMLDivElement>(null)
  const workDirRef = useRef<HTMLDivElement>(null)
  const guideCardRef = useRef<HTMLDivElement>(null)

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
      {(() => {
        const composerContent = (
          <div
            ref={composerRef}
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
              ref={toolbarRef}
              className={styles.toolbar}
              style={{ borderTop: `1px solid ${token.colorBorderSecondary}` }}
            >
              <div className={styles.toolbarLeft}>
                <Dropdown menu={attachMenu} trigger={['click']} placement="topLeft">
                  <Tooltip title="添加附件">
                    <Button color="primary" variant="dashed" icon={<PlusOutlined />} size="small" shape="round" className={styles.iconBtn} />
                  </Tooltip>
                </Dropdown>

                <Dropdown
                  dropdownRender={modeDropdownRender}
                  trigger={['click']}
                  placement="topLeft"
                  open={modeDropdownOpen}
                  onOpenChange={setModeDropdownOpen}
                >
                  <Button ref={modeBtnRef} color="primary" variant="outlined" size="small" shape="round" className={styles.modeBtn}>
                    <Space size={4}>
                      <ThunderboltOutlined />
                      {mode}
                    </Space>
                  </Button>
                </Dropdown>
              </div>

              <div className={styles.toolbarRight}>
                <div ref={modelPickerRef}>
                  <ModelPicker model={model} onModelChange={setModel} />
                </div>

                <Tooltip title="语音输入">
                  <Button
                    color="green"
                    variant="filled"
                    shape="round"
                    icon={<AudioOutlined />}
                    className={styles.iconBtn}
                    onClick={() => message.info('语音输入后续接入')}
                  />
                </Tooltip>

                <Button
                  color="primary"
                  variant="solid"
                  shape="circle"
                  icon={<SendOutlined />}
                  className={styles.iconBtn}
                  onClick={handleSend}
                />
              </div>
            </div>
          </div>
        )
        return isLight ? (
          <BorderBeam color={token.colorPrimary} outset={0}>
            {composerContent}
          </BorderBeam>
        ) : composerContent
      })()}

      {/* ── 工作目录 ── */}
      <div ref={workDirRef} className={styles.workDirRow}>
        <Dropdown menu={workDirMenu} trigger={['click']} placement="bottomLeft" getPopupContainer={() => document.body}>
          <Button color="default" variant="outlined" size="small" icon={<FolderOpenOutlined />}>
            选择工作目录
          </Button>
        </Dropdown>
        <Text type="secondary" style={{ fontSize: 12 }}>
          当前工作目录：{workDir ?? '未选择'}
        </Text>
      </div>

      {/* ── 引导卡片 ── */}
      {(() => {
        const guideContent = (
          <div ref={guideCardRef} style={{ marginTop: 48 }}>
            <WorkflowGuideCard onStartTour={() => setTourOpen(true)} />
          </div>
        )
        return isLight ? (
          <BorderBeam color={token.colorPrimary} outset={0}>
            {guideContent}
          </BorderBeam>
        ) : guideContent
      })()}

      {/* ── 漫游式引导 ── */}
      <Tour
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        steps={[
          {
            target: () => composerRef.current!,
            title: '输入任务描述',
            description: '在这里用自然语言描述您的 GIS 任务，例如缓冲区分析、专题制图等。',
            placement: 'bottom',
          },
          {
            target: () => toolbarRef.current!,
            title: '工具栏',
            description: '添加附件、切换模式、选择模型、语音输入和发送任务。',
            placement: 'bottom',
          },
          {
            target: () => modeBtnRef.current!,
            title: '任务模式',
            description: '选择不同的任务模式：通用 GIS、空间分析、专题制图等。',
            placement: 'bottom',
          },
          {
            target: () => modelPickerRef.current!,
            title: '模型选择',
            description: '选择 AI 模型来处理您的任务。',
            placement: 'top',
          },
          {
            target: () => workDirRef.current!,
            title: '工作目录',
            description: '选择本地工作目录，用于存放分析数据和输出文件。',
            placement: 'bottom',
          },
          {
            target: () => guideCardRef.current!,
            title: '工作流引导',
            description: '从这里开始您的空间分析工作流，随时可以点击"开始引导"重新查看。',
            placement: 'top',
          },
        ]}
      />
    </div>
  )
}
