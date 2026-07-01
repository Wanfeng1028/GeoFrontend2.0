import { useState } from 'react'
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Empty,
  Menu,
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
  MessageOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  LayoutOutlined,
  SunOutlined,
  MoonOutlined,
  DesktopOutlined,
  UserOutlined,
  SettingOutlined,
  CheckOutlined,
} from '@ant-design/icons'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { useAppearanceStore } from '../shared/stores/appearanceStore'
import styles from './AppShell.module.css'

/* ── 主功能入口（负责路由跳转） ── */
const navItems = [
  { key: '/tasks', icon: <PlusOutlined />, label: '新任务' },
  { key: '/agent-studio', icon: <AppstoreOutlined />, label: '扩展' },
  { key: '/tasks', icon: <ClockCircleOutlined />, label: '定时任务' },
  { key: '/data-center', icon: <MessageOutlined />, label: 'IM 频道' },
]

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const { appearance, setAppearance } = useAppearanceStore()
  const { token } = theme.useToken()

  const [segment, setSegment] = useState<'任务' | '频道'>('任务')

  /* 路由匹配 → nav 选中态 */
  const selectedKey =
    navItems.find((item) => item.key === location.pathname)?.key ?? ''

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
        className={styles.sidebar}
        style={{
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        {/* 顶部工具栏 */}
        <div className={styles.sidebarToolbar}>
          <Tooltip title="折叠侧栏">
            <Button type="text" icon={<MenuFoldOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="面板">
            <Button type="text" icon={<LayoutOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="搜索">
            <Button type="text" icon={<SearchOutlined />} size="small" />
          </Tooltip>
        </div>

        <Divider style={{ margin: '4px 0' }} />

        {/* 主功能入口 */}
        <div className={styles.sidebarBody}>
          <Menu
            mode="inline"
            selectedKeys={selectedKey ? [selectedKey] : []}
            items={navItems}
            onClick={({ key }) => navigate(key)}
            style={{ border: 'none', background: 'transparent' }}
          />

          <Divider style={{ margin: '4px 0' }} />

          {/* 切换区 */}
          <div className={styles.sidebarSegmented}>
            <Segmented
              block
              value={segment}
              onChange={(v) => setSegment(v as '任务' | '频道')}
              options={['任务', '频道']}
              size="small"
            />
          </div>

          {/* 内容区：空状态占位 */}
          <div className={styles.sidebarEmpty}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无任务"
            >
              <Button size="small" onClick={() => navigate('/tasks')}>
                创建任务
              </Button>
            </Empty>
          </div>
        </div>

        <Divider style={{ margin: 0 }} />

        {/* 底部 */}
        <div className={styles.sidebarFooter}>
          <Avatar size="small" icon={<UserOutlined />} />
          <Typography.Text
            ellipsis
            style={{ flex: 1, color: token.colorText }}
          >
            用户
          </Typography.Text>
          <Tooltip title="设置">
            <Button
              type="text"
              icon={<SettingOutlined />}
              size="small"
              onClick={() => navigate('/settings')}
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
    </div>
  )
}
