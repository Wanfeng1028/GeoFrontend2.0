import { useState } from 'react'
import {
  App,
  Avatar,
  Button,
  Divider,
  Dropdown,
  Empty,
  Menu,
  Modal,
  Segmented,
  Space,
  Tooltip,
  Typography,
  theme,
} from 'antd'
import {
  PlusOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  MobileOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LayoutOutlined,
  SunOutlined,
  MoonOutlined,
  DesktopOutlined,
  UserOutlined,
  SettingOutlined,
  CheckOutlined,
  BarChartOutlined,
  KeyOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { useAppearanceStore } from '../shared/stores/appearanceStore'
import { ShortcutsModal } from './ShortcutsModal'
import styles from './AppShell.module.css'

type SidebarSegment = 'tasks' | 'channels'

/* ── 主功能入口数据 ── */
const navItems = [
  { key: '/tasks', icon: <PlusOutlined />, label: '新任务' },
  { key: '/agent-studio', icon: <AppstoreOutlined />, label: '扩展' },
  { key: '/tasks', icon: <ClockCircleOutlined />, label: '定时任务' },
  { key: '/data-center', icon: <MobileOutlined />, label: '移动端控制' },
]

/* 路由 → 已在当前页时的提示文案 */
const alreadyHereMap: Record<string, string> = {
  '/tasks': '当前已在任务页面',
  '/agent-studio': '当前已在 Agent Studio',
  '/data-center': '当前已在数据中心',
  '/settings': '当前已在设置页面',
}

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

  /* 路由匹配 → nav 选中态 */
  const selectedKey =
    navItems.find((item) => item.key === location.pathname)?.key ?? ''

  /* 菜单项：折叠时隐藏文字，用 Tooltip 包裹 */
  const menuItems = navItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: sidebarCollapsed ? (
      <Tooltip title={item.label} placement="right">
        <span />
      </Tooltip>
    ) : (
      item.label
    ),
  }))

  /* 导航点击：已在当前页则提示，否则跳转 */
  const handleNavClick = (key: string) => {
    if (key === location.pathname) {
      message.info(alreadyHereMap[key] ?? '当前已在该页面')
    } else {
      navigate(key)
    }
  }

  /* 创建任务按钮 */
  const handleCreateTask = () => {
    if (location.pathname === '/tasks') {
      message.info('当前已在任务页面，后续会接入创建任务弹窗')
    } else {
      navigate('/tasks')
    }
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
        <div className={styles.sidebarToolbar}>
          <Tooltip title={sidebarCollapsed ? '展开侧栏' : '折叠侧栏'}>
            <Button
              type="text"
              icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              size="small"
              onClick={() => setSidebarCollapsed((v) => !v)}
            />
          </Tooltip>
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
              onClick={() => message.info('全局搜索功能后续接入')}
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
              icon={<KeyOutlined />}
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
        </div>

        {!sidebarCollapsed && <Divider style={{ margin: '4px 0' }} />}

        {/* 主功能入口 */}
        <div className={styles.sidebarBody}>
          <Menu
            mode="inline"
            selectedKeys={selectedKey ? [selectedKey] : []}
            items={menuItems}
            onClick={({ key }) => handleNavClick(key)}
            style={{ border: 'none', background: 'transparent' }}
          />

          {!sidebarCollapsed && (
            <>
              <Divider style={{ margin: '4px 0' }} />

              {/* 切换区 */}
              <div className={styles.sidebarSegmented}>
                <Segmented
                  block
                  value={segment}
                  onChange={(value) => setSegment(value as SidebarSegment)}
                  options={[
                    { label: '任务', value: 'tasks' },
                    { label: '频道', value: 'channels' },
                  ]}
                  size="small"
                />
              </div>

              {/* 内容区：空状态占位 */}
              <div className={styles.sidebarEmpty}>
                {segment === 'tasks' ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="暂无任务"
                  >
                    <Button size="small" onClick={handleCreateTask}>
                      创建任务
                    </Button>
                  </Empty>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="暂无频道"
                  />
                )}
              </div>
            </>
          )}
        </div>

        <Divider style={{ margin: 0 }} />

        {/* 底部 */}
        <div
          className={`${styles.sidebarFooter} ${sidebarCollapsed ? styles.sidebarFooterCollapsed : ''}`}
        >
          <Avatar size="small" icon={<UserOutlined />} />
          {!sidebarCollapsed && (
            <Typography.Text
              ellipsis
              style={{ flex: 1, color: token.colorText }}
            >
              用户
            </Typography.Text>
          )}
          <Tooltip title="设置">
            <Button
              type="text"
              icon={<SettingOutlined />}
              size="small"
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
            <Tooltip title="切换主题">
              <Button type="text" icon={<SunOutlined />} size="small" />
            </Tooltip>
          </Dropdown>
        </div>
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
      <Modal
        title="用量反馈"
        open={modalOpen === 'usage'}
        onCancel={() => setModalOpen(null)}
        footer={null}
      >
        <Typography.Paragraph>
          用量统计功能后续接入。
        </Typography.Paragraph>
      </Modal>

      <ShortcutsModal
        open={modalOpen === 'shortcuts'}
        onClose={() => setModalOpen(null)}
      />

      <Modal
        title="问题反馈"
        open={modalOpen === 'feedback'}
        onCancel={() => setModalOpen(null)}
        footer={null}
      >
        <Typography.Paragraph>
          反馈表单后续接入。
        </Typography.Paragraph>
      </Modal>
    </div>
  )
}
