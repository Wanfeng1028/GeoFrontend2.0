import { useState } from 'react'
import {
  App,
  Avatar,
  Button,
  Divider,
  Dropdown,
  Modal,
  Tag,
  Tooltip,
  Typography,
  theme,
} from 'antd'
import {
  UserOutlined,
  SettingOutlined,
  SkinOutlined,
  KeyOutlined,
  BookOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router'
import styles from './UserMenu.module.css'

interface UserMenuProps {
  collapsed: boolean
  onOpenShortcuts: () => void
}

export function UserMenu({ collapsed, onOpenShortcuts }: UserMenuProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { message } = App.useApp()
  const { token } = theme.useToken()

  const [aboutOpen, setAboutOpen] = useState(false)

  const handleSettings = () => {
    if (location.pathname === '/settings') {
      message.info('当前已在设置页面')
    } else {
      navigate('/settings')
    }
  }

  const menuItems = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: handleSettings,
    },
    {
      key: 'preferences',
      icon: <SkinOutlined />,
      label: '偏好设置',
      onClick: () => message.info('偏好设置后续接入'),
    },
    {
      key: 'shortcuts',
      icon: <KeyOutlined />,
      label: '快捷键指引',
      onClick: onOpenShortcuts,
    },
    { type: 'divider' as const },
    {
      key: 'help',
      icon: <BookOutlined />,
      label: '帮助文档',
      onClick: () => message.info('帮助文档后续接入'),
    },
    {
      key: 'changelog',
      icon: <FileTextOutlined />,
      label: '更新日志',
      onClick: () => message.info('更新日志后续接入'),
    },
    {
      key: 'about',
      icon: <InfoCircleOutlined />,
      label: '关于 GeoFrontend2.0',
      onClick: () => setAboutOpen(true),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: () => message.info('当前为本地开发模式，暂未接入登录系统'),
    },
  ]

  const accountHeader = (
    <div className={styles.accountHeader}>
      <Typography.Text
        type="secondary"
        style={{ display: 'block', fontSize: 12 }}
      >
        当前账号
      </Typography.Text>
      <Typography.Text strong style={{ display: 'block', fontSize: 14 }}>
        用户
      </Typography.Text>
      <Tag color="processing" style={{ marginTop: 4 }}>
        本地开发模式
      </Tag>
    </div>
  )

  const trigger = (
    <div
      className={`${styles.userTrigger} ${collapsed ? styles.userTriggerCollapsed : ''}`}
    >
      <Avatar size="small" icon={<UserOutlined />} />
      {!collapsed && (
        <Typography.Text ellipsis style={{ flex: 1, color: token.colorText }}>
          用户
        </Typography.Text>
      )}
    </div>
  )

  return (
    <>
      <Dropdown
        menu={{ items: menuItems }}
        trigger={['click']}
        placement={collapsed ? 'topRight' : 'topLeft'}
        popupRender={(menu) => (
          <div
            style={{
              background: token.colorBgElevated,
              borderRadius: token.borderRadiusLG,
              boxShadow: token.boxShadowSecondary,
            }}
          >
            {accountHeader}
            <Divider style={{ margin: 0 }} />
            {menu}
          </div>
        )}
      >
        {collapsed ? (
          <Tooltip title="账号菜单" placement="right">
            {trigger}
          </Tooltip>
        ) : (
          trigger
        )}
      </Dropdown>

      <Modal
        title="关于 GeoFrontend2.0"
        open={aboutOpen}
        onCancel={() => setAboutOpen(false)}
        footer={
          <Button onClick={() => setAboutOpen(false)}>关闭</Button>
        }
      >
        <Typography.Paragraph>
          <strong>项目名称：</strong>GeoFrontend2.0 (GeoWork 2.0)
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>当前阶段：</strong>前端 Shell 搭建中
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>技术栈：</strong>Vite 8 + React 19 + Ant Design 6 + React Router 8 + Zustand
        </Typography.Paragraph>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          本项目使用 Ant Design 官网 Bootstrap 拟物化主题作为亮色主题，darkAlgorithm 作为暗色主题。
        </Typography.Paragraph>
      </Modal>
    </>
  )
}
