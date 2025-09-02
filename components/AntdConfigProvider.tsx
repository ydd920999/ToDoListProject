'use client';

import React from 'react';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useTheme } from '../contexts/ThemeContext';
import { getAntdThemeConfig } from '../styles/themes';

interface AntdConfigProviderProps {
  children: React.ReactNode;
}

const AntdConfigProvider: React.FC<AntdConfigProviderProps> = ({ children }) => {
  const { theme: currentTheme } = useTheme();

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        ...getAntdThemeConfig(currentTheme),
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdConfigProvider;
