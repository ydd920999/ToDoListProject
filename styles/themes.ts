// 主题颜色配置系统
export const themeColors = {
  // 主色调
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    500: "#0ea5e9", // 主色
    600: "#0284c7",
    700: "#0369a1",
  },

  // 浅色主题
  light: {
    // 背景色
    background: {
      primary: "from-slate-50 to-slate-100",
      card: "#ffffff",
      glass: "bg-white/70",
      input: "#ffffff",
    },

    // 文字颜色
    text: {
      primary: "#111827", // 主要文字 - 深色
      secondary: "#374151", // 次要文字
      muted: "#6b7280", // 辅助文字
      disabled: "#9ca3af", // 禁用文字
    },

    // 边框颜色
    border: {
      primary: "#e5e7eb", // 主要边框
      secondary: "#f3f4f6", // 次要边框
      input: "#d1d5db", // 输入框边框
    },

    // 状态颜色
    status: {
      success: "#10b981", // 成功/完成
      warning: "#f59e0b", // 警告
      error: "#ef4444", // 错误/逾期
      info: "#3b82f6", // 信息
    },
  },

  // 深色主题
  dark: {
    // 背景色
    background: {
      primary: "from-gray-900 to-gray-800", // 主背景 - 深色
      card: "#1f2937", // 卡片背景 - 深色
      glass: "bg-gray-800/70", // 玻璃效果 - 深色
      input: "#374151", // 输入框背景 - 深色
    },

    // 文字颜色
    text: {
      primary: "#fff", // 主要文字 - 白色
      secondary: "#f9fafb", // 次要文字 - 近白色
      muted: "#d1d5db", // 辅助文字 - 浅灰
      disabled: "#9ca3af", // 禁用文字 - 灰色
    },

    // 边框颜色
    border: {
      primary: "#374151", // 主要边框
      secondary: "#4b5563", // 次要边框
      input: "#6b7280", // 输入框边框
    },

    // 状态颜色（深色主题下稍微调亮）
    status: {
      success: "#34d399", // 成功/完成
      warning: "#fbbf24", // 警告
      error: "#f87171", // 错误/逾期
      info: "#60a5fa", // 信息
    },
  },
} as const;

// 主题工具函数
export const getThemeColor = (
  theme: "light" | "dark",
  category: keyof typeof themeColors.light,
  subcategory: string
) => {
  const themeConfig = themeColors[theme];
  // @ts-ignore
  return themeConfig[category]?.[subcategory] || "";
};

// Tailwind CSS 类名生成器
export const getThemeClasses = (theme: "light" | "dark") => ({
  // 背景类
  background: {
    primary:
      theme === "light"
        ? "bg-gradient-to-br from-slate-50 to-slate-100"
        : "bg-gradient-to-br from-gray-900 to-gray-800",
    card: theme === "light" ? "bg-white" : "bg-gray-800",
    input: theme === "light" ? "bg-white" : "bg-gray-700",
  },

  // 文字类
  text: {
    primary: theme === "light" ? "text-gray-900" : "text-white",
    secondary: theme === "light" ? "text-gray-700" : "text-gray-100",
    muted: theme === "light" ? "text-gray-600" : "text-gray-300",
    disabled: theme === "light" ? "text-gray-400" : "text-gray-500",
  },

  // 边框类
  border: {
    primary: theme === "light" ? "border-gray-200" : "border-gray-600",
    secondary: theme === "light" ? "border-gray-100" : "border-gray-700",
    input: theme === "light" ? "border-gray-300" : "border-gray-600",
  },

  // 状态类
  status: {
    success: theme === "light" ? "text-green-600" : "text-green-400",
    warning: theme === "light" ? "text-yellow-600" : "text-yellow-400",
    error: theme === "light" ? "text-red-600" : "text-red-400",
    info: theme === "light" ? "text-blue-600" : "text-blue-400",
  },
});

// 获取内联样式用的颜色值
export const getThemeStyles = (theme: "light" | "dark") => {
  const colors = themeColors[theme];

  return {
    // 背景样式
    background: {
      primary: colors.background.primary,
      card: { backgroundColor: colors.background.card },
      input: { backgroundColor: colors.background.input },
    },

    // 文字样式 - 使用动态颜色值
    text: {
      primary: { color: colors.text.primary },
      secondary: { color: colors.text.secondary },
      muted: { color: colors.text.muted },
      disabled: { color: colors.text.disabled },
    },

    // 边框样式
    border: {
      primary: { borderColor: colors.border.primary },
      secondary: { borderColor: colors.border.secondary },
      input: { borderColor: colors.border.input },
    },

    // 状态样式
    status: {
      success: { color: colors.status.success },
      error: { color: colors.status.error },
      warning: { color: colors.status.warning },
      info: { color: colors.status.info },
    },
  };
};

// Antd 主题配置
export const getAntdThemeConfig = (theme: "light" | "dark") => ({
  token: {
    colorPrimary: themeColors.primary[500],
    colorBgBase:
      theme === "dark"
        ? themeColors.dark.background.card
        : themeColors.light.background.card,
    colorTextBase:
      theme === "dark"
        ? themeColors.dark.text.primary
        : themeColors.light.text.primary,
    colorBorder:
      theme === "dark"
        ? themeColors.dark.border.primary
        : themeColors.light.border.primary,
    colorBgContainer:
      theme === "dark"
        ? themeColors.dark.background.card
        : themeColors.light.background.card,
  },
});
