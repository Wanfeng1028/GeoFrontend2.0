import { theme, type ThemeConfig } from 'antd'

export const bootstrapTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#0d6efd',
    colorSuccess: '#198754',
    colorWarning: '#ffc107',
    colorError: '#dc3545',
    colorInfo: '#0dcaf0',
  },
}

export const darkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
}
