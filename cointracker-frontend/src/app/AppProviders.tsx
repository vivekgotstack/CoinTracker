import { ConfigProvider, theme as antdTheme } from 'antd'
import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext'
import { queryClient } from '@/lib/query-client'

const AntThemeBridge = ({ children }: { children: ReactNode }) => {
  const { isDark } = useTheme()

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: isDark ? '#22c55e' : '#0d9488',
          borderRadius: 8,
          fontFamily: 'Outfit, sans-serif',
          colorBgLayout: isDark ? '#08100f' : '#f3fbf8',
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <UserPreferencesProvider>
        <AntThemeBridge>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </AntThemeBridge>
      </UserPreferencesProvider>
    </ThemeProvider>
  )
}

export default AppProviders
