import { useMemo, type ReactNode } from 'react'
import { App as AntdApp, ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { bootstrapTheme, darkTheme } from './antdThemes'
import { useAppearanceStore } from '../shared/stores/appearanceStore'
import { useSystemAppearance } from '../shared/hooks/useSystemAppearance'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  useSystemAppearance()

  const resolvedAppearance = useAppearanceStore((s) => s.resolvedAppearance)

  const antdTheme = useMemo(
    () => (resolvedAppearance === 'dark' ? darkTheme : bootstrapTheme),
    [resolvedAppearance],
  )

  return (
    <ConfigProvider locale={zhCN} theme={antdTheme}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  )
}
