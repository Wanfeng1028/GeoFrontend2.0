import type { ConfigProviderProps } from 'antd'
import { useBootstrapTheme } from './bootstrapTheme'
import { darkTheme } from './darkTheme'

export { useBootstrapTheme, darkTheme }

export function useAntdTheme(resolvedAppearance: 'light' | 'dark'): ConfigProviderProps {
  const bootstrapProps = useBootstrapTheme()
  if (resolvedAppearance === 'dark') {
    return { theme: darkTheme }
  }
  return bootstrapProps
}
