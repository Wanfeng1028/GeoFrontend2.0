import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import {
  App,
  BorderBeam,
  Button,
  ConfigProvider,
  Divider,
  Dropdown,
  Empty,
  Menu,
  Segmented,
  Space,
  Tooltip,
  theme,
} from 'antd'
import {
  PlusOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  UnorderedListOutlined,
  MobileOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LayoutOutlined,
  SunOutlined,
  MoonOutlined,
  DesktopOutlined,
  SettingOutlined,
  CheckOutlined,
  BarChartOutlined,
  MacCommandOutlined,
  MessageOutlined,
  DownOutlined,
  RightOutlined,
  UserSwitchOutlined,
  ToolOutlined,
  ApiOutlined,
  LinkOutlined,
} from '@ant-design/icons'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { useAppearanceStore } from '../shared/stores/appearanceStore'
import { ShortcutsModal } from './ShortcutsModal'
import { FeedbackModal } from './FeedbackModal'
import { UsageModal } from './UsageModal'
import { UserMenu } from './UserMenu'
import { GlobalSearchModal } from './GlobalSearchModal'
import styles from './AppShell.module.css'

type SidebarSegment = 'tasks' | 'channels'

/* ── 主功能入口数据 ── */
const navItems = [
  { key: '/new-task', icon: <PlusOutlined />, label: '新任务' },
  { key: '/tasks', icon: <ClockCircleOutlined />, label: '定时任务' },
  { key: '/mobile-control', icon: <MobileOutlined />, label: '移动端控制' },
]

/* 路由 → 已在当前页时的提示文案 */
const alreadyHereMap: Record<string, string> = {
  '/new-task': '当前已在新任务页面',
  '/tasks': '当前已在任务页面',
  '/agent-studio': '当前已在 Agent Studio',
  '/mobile-control': '当前已在移动端控制页面',
  '/data-center': '当前已在数据中心',
  '/settings': '当前已在设置页面',
}

/* 扩展子项数据 */
const extChildren = [
  { key: 'experts', label: '专家', icon: <UserSwitchOutlined />, route: '/extensions/experts' },
  { key: 'skills', label: '技能', icon: <ToolOutlined />, route: '/extensions/skills' },
  { key: 'mcp', label: 'MCP', icon: <ApiOutlined />, route: '/extensions/mcp' },
  { key: 'connectors', label: '连接器', icon: <LinkOutlined />, route: '/extensions/connectors' },
]

const extRoutes = extChildren.map((c) => c.route)

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const { appearance, setAppearance } = useAppearanceStore()
  const { token } = theme.useToken()
  const { message } = App.useApp()

  const [segment, setSegment] = useState<SidebarSegment>('tasks')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [modalOpen, setModalOpen] = useState<
    'usage' | 'shortcuts' | 'feedback' | null
  >(null)
  const [extOpen, setExtOpen] = useState(false)
  const [extHeaderHover, setExtHeaderHover] = useState(false)
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false)

  const isOnExtension = extRoutes.includes(location.pathname)

  /* 路由在扩展子页面时自动展开 */
  useEffect(() => {
    if (isOnExtension) setExtOpen(true)
  }, [isOnExtension])

  const isLight = appearance === 'light'

  /* BorderBeam 条件包装：仅亮色模式启用流光 */
  const Beam = ({
    children,
    className,
    style,
  }: {
    children: ReactNode
    className?: string
    style?: React.CSSProperties
  }) => {
    if (!isLight) return <div className={className} style={style}>{children}</div>
    return (
      <BorderBeam color={token.colorPrimary} outset={0}>
        <div className={className} style={style}>
          {children}
        </div>
      </BorderBeam>
    )
  }

  /* 路由匹配 → nav 选中态 */
  const selectedKey =
    navItems.find((item) => item.key === location.pathname)?.key ?? ''

  /* 展开态菜单项 */
  const menuItems = navItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
  }))

  /* 导航点击：已在当前页则提示，否则跳转 */
  const handleNavClick = (key: string) => {
    if (key === location.pathname) {
      if (key === '/new-task') {
        /* 新任务页点击时重置会话状态 */
        navigate('/new-task', { state: { resetKey: Date.now() } })
      } else {
        message.info(alreadyHereMap[key] ?? '当前已在该页面')
      }
    } else {
      navigate(key)
    }
    if (key === '/mobile-control') {
      setSegment('channels')
    }
  }

  /* 创建任务按钮 */
  const handleCreateTask = () => {
    navigate('/new-task', { state: { resetKey: Date.now() } })
  }

  /* 设置按钮 */
  const handleSettingsClick = () => {
    if (location.pathname === '/settings') {
      message.info(alreadyHereMap['/settings'])
    } else {
      navigate('/settings')
    }
  }

  /* 主题 Dropdown */
  const themeMenuItems = [
    {
      key: 'light',
      icon: <SunOutlined />,
      label: (
        <Space>
          Bootstrap
          {appearance === 'light' && <CheckOutlined />}
        </Space>
      ),
    },
    {
      key: 'dark',
      icon: <MoonOutlined />,
      label: (
        <Space>
          Dark
          {appearance === 'dark' && <CheckOutlined />}
        </Space>
      ),
    },
    {
      key: 'system',
      icon: <DesktopOutlined />,
      label: (
        <Space>
          System
          {appearance === 'system' && <CheckOutlined />}
        </Space>
      ),
    },
  ]

  /* Divider 公共样式 */
  const dividerStyle = {
    margin: '4px 0',
    borderColor: token.colorBorderSecondary,
  }

  return (
    <div className={styles.root}>
      {/* ── Sidebar ── */}
      <aside
        className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}
        style={{
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        {/* 顶部工具栏 */}
        <Beam
          className={`${styles.sidebarToolbar} ${sidebarCollapsed ? styles.sidebarToolbarCollapsed : ''}`}
        >
          <Tooltip
            title={sidebarCollapsed ? '展开侧栏' : '折叠侧栏'}
            placement={sidebarCollapsed ? 'right' : undefined}
          >
            <Button
              type="text"
              icon={
                sidebarCollapsed ? (
                  <MenuUnfoldOutlined />
                ) : (
                  <MenuFoldOutlined />
                )
              }
              size={sidebarCollapsed ? 'middle' : 'small'}
              onClick={() => setSidebarCollapsed((v) => !v)}
            />
          </Tooltip>
          {!sidebarCollapsed && (
            <>
              <Tooltip title="面板">
                <Button
                  type="text"
                  icon={<LayoutOutlined />}
                  size="small"
                  onClick={() => message.info('面板切换功能后续接入')}
                />
              </Tooltip>
              <Tooltip title="搜索">
                <Button
                  type="text"
                  icon={<SearchOutlined />}
                  size="small"
                  onClick={() => setGlobalSearchOpen(true)}
                />
              </Tooltip>
              <div style={{ flex: 1 }} />
              <Tooltip title="用量反馈">
                <Button
                  type="text"
                  icon={<BarChartOutlined />}
                  size="small"
                  onClick={() => setModalOpen('usage')}
                />
              </Tooltip>
              <Tooltip title="快捷键指引">
                <Button
                  type="text"
                  icon={<MacCommandOutlined />}
                  size="small"
                  onClick={() => setModalOpen('shortcuts')}
                />
              </Tooltip>
              <Tooltip title="问题反馈">
                <Button
                  type="text"
                  icon={<MessageOutlined />}
                  size="small"
                  onClick={() => setModalOpen('feedback')}
                />
              </Tooltip>
            </>
          )}
        </Beam>

        {/* Divider 1: 工具区下 */}
        <Divider style={dividerStyle} />

        {/* 主功能入口 */}
        {sidebarCollapsed ? (
          <Beam className={styles.sidebarBodyCollapsed}>
            {navItems.map((item, idx) => {
              const isActive = location.pathname === item.key
              return (
                <Tooltip key={idx} title={item.label} placement="right">
                  <Button
                    type={isActive ? 'primary' : 'text'}
                    icon={item.icon}
                    style={{
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                    }}
                    onClick={() => handleNavClick(item.key)}
                  />
                </Tooltip>
              )
            })}

            {/* 扩展入口 - 折叠态 Dropdown */}
            <Dropdown
              trigger={['hover']}
              placement="bottomRight"
              getPopupContainer={() => document.body}
              menu={{
                items: extChildren.map((item) => ({
                  key: item.key,
                  icon: item.icon,
                  label: item.label,
                  onClick: () => navigate(item.route),
                })),
              }}
            >
              <Tooltip title="扩展" placement="right">
                <Button
                  type={isOnExtension ? 'primary' : 'text'}
                  icon={<AppstoreOutlined />}
                  style={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                  }}
                />
              </Tooltip>
            </Dropdown>
          </Beam>
        ) : (
          <Beam className={styles.sidebarBody}>
            <Menu
              mode="inline"
              selectedKeys={selectedKey ? [selectedKey] : []}
              items={menuItems}
              onClick={({ key }) => handleNavClick(key)}
              style={{ border: 'none', background: 'transparent' }}
            />

            {/* 扩展入口 - 展开态 click */}
            <div
              className={styles.extensionBlock}
              onMouseEnter={() => setExtHeaderHover(true)}
              onMouseLeave={() => setExtHeaderHover(false)}
            >
              <div
                className={styles.extensionHeader}
                style={{
                  background: extOpen || extHeaderHover ? token.colorFillSecondary : 'transparent',
                  paddingInline: 16,
                  marginInline: 12,
                }}
                onClick={() => setExtOpen((v) => !v)}
              >
                <AppstoreOutlined />
                <span style={{ flex: 1 }}>扩展</span>
                {(extOpen || extHeaderHover) && (
                  <span style={{ fontSize: 10, color: token.colorTextTertiary }}>
                    {extOpen ? <DownOutlined /> : <RightOutlined />}
                  </span>
                )}
              </div>
              {extOpen && (
                <div className={styles.extensionChildren}>
                  {extChildren.map((item) => {
                    const isActive = location.pathname === item.route
                    return (
                      <button
                        key={item.key}
                        type="button"
                        role="menuitem"
                        className={styles.extensionChildRow}
                        style={{
                          color: isActive ? token.colorPrimary : token.colorText,
                          fontWeight: isActive ? 500 : 400,
                        }}
                        onClick={() => navigate(item.route)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = token.colorFillSecondary
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <span style={{ marginRight: 8, fontSize: 14, display: 'inline-flex' }}>
                          {item.icon}
                        </span>
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Segmented 切换区 */}
            <div className={styles.sidebarSegmented}>
              <ConfigProvider
                theme={{
                  components: {
                    Segmented: {
                      itemSelectedColor: token.colorPrimary,
                      itemSelectedBg: token.colorPrimaryBg,
                    },
                  },
                }}
              >
                <Segmented
                  block
                  value={segment}
                  onChange={(value) => setSegment(value as SidebarSegment)}
                  options={[
                    { label: '任务', value: 'tasks', icon: <UnorderedListOutlined /> },
                    { label: '移动端控制', value: 'channels', icon: <MobileOutlined /> },
                  ]}
                  size="small"
                />
              </ConfigProvider>
            </div>

            {/* 内容区：空状态占位 */}
            <div className={styles.sidebarEmpty}>
              {segment === 'tasks' ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无任务"
                >
                  {isLight ? (
                    <BorderBeam color={token.colorPrimary} outset={0}>
                      <Button
                        type="primary"
                        size="small"
                        onClick={handleCreateTask}
                      >
                        创建任务
                      </Button>
                    </BorderBeam>
                  ) : (
                    <Button
                      type="primary"
                      size="small"
                      onClick={handleCreateTask}
                    >
                      创建任务
                    </Button>
                  )}
                </Empty>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无移动端控制会话"
                />
              )}
            </div>
          </Beam>
        )}

        {/* Divider 2: 主入口区下 */}
        <Divider style={dividerStyle} />

        {/* 底部 */}
        <Beam
          className={`${styles.sidebarFooter} ${sidebarCollapsed ? styles.sidebarFooterCollapsed : ''}`}
        >
          <UserMenu
            collapsed={sidebarCollapsed}
            onOpenShortcuts={() => setModalOpen('shortcuts')}
          />
          <Tooltip
            title="设置"
            placement={sidebarCollapsed ? 'right' : undefined}
          >
            <Button
              type="text"
              icon={<SettingOutlined />}
              size={sidebarCollapsed ? 'middle' : 'small'}
              onClick={handleSettingsClick}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: themeMenuItems,
              onClick: ({ key }) =>
                setAppearance(key as 'light' | 'dark' | 'system'),
            }}
            trigger={['click']}
            placement="topRight"
          >
            <Tooltip
              title="切换主题"
              placement={sidebarCollapsed ? 'right' : undefined}
            >
              <Button type="text" icon={<SunOutlined />} size={sidebarCollapsed ? 'middle' : 'small'} />
            </Tooltip>
          </Dropdown>
        </Beam>
      </aside>

      {/* ── MainWorkspace ── */}
      <main
        className={styles.workspace}
        style={{
          background: token.colorBgLayout,
          padding: token.paddingLG,
        }}
      >
        <Outlet />
      </main>

      {/* ── 工具弹窗 ── */}
      <UsageModal
        open={modalOpen === 'usage'}
        onClose={() => setModalOpen(null)}
      />

      <ShortcutsModal
        open={modalOpen === 'shortcuts'}
        onClose={() => setModalOpen(null)}
      />

      <FeedbackModal
        open={modalOpen === 'feedback'}
        onClose={() => setModalOpen(null)}
      />

      <GlobalSearchModal
        open={globalSearchOpen}
        onClose={() => setGlobalSearchOpen(false)}
      />
    </div>
  )
}
