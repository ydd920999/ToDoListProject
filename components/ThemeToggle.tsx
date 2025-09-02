'use client';

import React from 'react';
import { Switch } from 'antd';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Sun 
        size={16} 
        className={`transition-colors ${
          theme === 'light' ? 'text-yellow-500' : 'text-gray-400'
        }`} 
      />
      <Switch
        checked={theme === 'dark'}
        onChange={toggleTheme}
        size="small"
        className="bg-gray-300"
        checkedChildren={<Moon size={12} />}
        unCheckedChildren={<Sun size={12} />}
      />
      <Moon 
        size={16} 
        className={`transition-colors ${
          theme === 'dark' ? 'text-blue-400' : 'text-gray-400'
        }`} 
      />
    </div>
  );
};

export default ThemeToggle;
