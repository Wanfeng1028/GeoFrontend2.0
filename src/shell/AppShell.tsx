import { useState } from 'react'
import { Layout, Menu, Segmented, Typography, Button } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router'
import {
  DatabaseOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RobotOutlined,
  SettingOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { useAppearanceStore } from '../shared/stores/appearanceStore'
import styles from './AppShell.module.css'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: '工作台' },
  { key: '/workspace', icon: <EnvironmentOutlined />, label: '地图工作区' },
  { key: '/data-center', icon: <DatabaseOutlined />, label: '数据中心' },
  { key: '/tasks', icon: <UnorderedListOutlined />, label: '任务管理' },
  { key: '/agent-studio', icon: <RobotOutlined />, label: 'Agent Studio' },
  { key: '/settings', icon: <SettingOutlined />, label: '设置' },
]

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { appearance, setAppearance } = useAppearanceStore()

  return (
    <Layout className={styles.root}>
      <Header className={styles.header}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: '#fff' }}
        />
        <Typography.Text strong className={styles.logo}>
          GeoWork
        </Typography.Text>
        <div style={{ flex: 1 }} />
        <Segmented
          value={appearance}
          onChange={(v) => setAppearance(v as 'light' | 'dark' | 'system')}
          options={[
            { label: 'Bootstrap', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'System', value: 'system' },
          ]}
          size="small"
        />
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          width={220}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ borderInlineEnd: 0 }}
          />
        </Sider>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
