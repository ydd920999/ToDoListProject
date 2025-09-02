import React from 'react'
import { ThemeProvider } from '../contexts/ThemeContext'
import AntdConfigProvider from '../components/AntdConfigProvider'
import './globals.css'
import type { Metadata } from 'next'

// 抑制开发环境下由于浏览器扩展导致的警告
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Extra attributes from the server')) {
      return;
    }
    originalError.apply(console, args);
  };
}

export const metadata: Metadata = {
  title: '待办清单',
  description: '一个美观且功能强大的待办事项管理应用',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
  },
  themeColor: '#0ea5e9',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <ThemeProvider>
          <AntdConfigProvider>
            {children}
          </AntdConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
