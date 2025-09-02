# 待办清单 Todo List

一个功能强大、界面美观的现代化待办事项管理应用，支持拖拽排序、主题切换、本地存储等特性。

![Todo List Preview](https://via.placeholder.com/800x400/0ea5e9/ffffff?text=Todo+List+Preview)

## ✨ 功能特性

### 📋 核心功能

- **任务管理**：添加、编辑、删除、完成任务
- **智能分类**：待完成、已完成、全部任务三个视图
- **搜索功能**：快速查找特定任务
- **统计信息**：实时显示任务统计和逾期提醒

### 🎯 拖拽功能

- **列内排序**：在同一列内拖拽调整任务顺序
- **跨列移动**：在不同状态间拖拽移动任务
- **双引擎支持**：结合 `react-dnd` 和 `@dnd-kit` 实现完美拖拽体验

### 🌓 主题系统

- **日夜切换**：支持浅色和深色两种主题模式
- **智能检测**：自动识别系统主题偏好
- **主题记忆**：本地保存用户主题选择
- **统一配色**：封装的主题颜色系统，易于维护和扩展

### 💾 数据持久化

- **本地存储**：无需服务器，数据保存在浏览器本地
- **即时同步**：操作后立即保存，确保数据安全

### 📱 响应式设计

- **移动优先**：完美适配手机、平板、桌面设备
- **弹性布局**：智能调整界面以适应不同屏幕尺寸
- **触屏友好**：优化触摸操作体验

## 🛠️ 技术栈

### 核心框架

- **[Next.js 14](https://nextjs.org/)**：React 全栈框架，支持 SSR 和 SSG
- **[React 18](https://react.dev/)**：现代化前端框架
- **[TypeScript](https://www.typescriptlang.org/)**：类型安全的 JavaScript 超集

### 样式设计

- **[Tailwind CSS](https://tailwindcss.com/)**：原子化 CSS 框架
- **[Ant Design](https://ant.design/)**：企业级 UI 组件库
- **自定义主题系统**：统一的颜色配置和主题切换

### 拖拽系统

- **[React DnD](https://react-dnd.github.io/react-dnd/)**：跨列拖拽功能
- **[dnd kit](https://dndkit.com/)**：列内排序功能
- **混合架构**：双引擎协作实现完整拖拽体验

### 图标组件

- **[Lucide React](https://lucide.dev/)**：现代化图标库

### 状态管理

- **React Hooks**：useState、useEffect、useContext
- **自定义 Hooks**：useTodos、useTheme、useThemeClasses
- **Context API**：全局主题状态管理

### 工具库

- **[Day.js](https://day.js.org/)**：轻量级日期处理库
- **[UUID](https://github.com/uuidjs/uuid)**：唯一标识符生成

## 🏗️ 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式和主题
│   ├── layout.tsx         # 根布局组件
│   └── page.tsx           # 主页面组件
├── components/            # React 组件
│   ├── AddTodoModal.tsx   # 添加/编辑任务弹窗
│   ├── AntdConfigProvider.tsx  # Antd 主题配置
│   ├── DraggableTodoCard.tsx   # 可拖拽任务卡片
│   ├── SortableTodoCard.tsx    # 可排序任务卡片
│   ├── ThemeToggle.tsx    # 主题切换开关
│   ├── TodoCard.tsx       # 任务卡片组件
│   └── TodoColumn.tsx     # 任务列组件
├── contexts/              # React Context
│   └── ThemeContext.tsx   # 主题上下文
├── hooks/                 # 自定义 Hooks
│   ├── useTheme.ts        # 主题 Hook
│   ├── useThemeClasses.ts # 主题样式 Hook
│   └── useTodos.ts        # 任务管理 Hook
├── lib/                   # 工具函数
│   └── localStorage.ts    # 本地存储服务
├── styles/                # 样式配置
│   └── themes.ts          # 主题颜色系统
└── types/                 # TypeScript 类型定义
    └── todo.ts            # 任务相关类型
```

## 🎨 主题颜色系统

项目采用了统一的主题颜色配置系统，便于维护和自定义：

### 颜色配置 (`styles/themes.ts`)

```typescript
export const themeColors = {
  primary: {
    500: "#0ea5e9", // 主色调
    600: "#0284c7", // 主色调深色
  },

  light: {
    background: { primary: "from-slate-50 to-slate-100", card: "#ffffff" },
    text: { primary: "#111827", secondary: "#374151", muted: "#6b7280" },
    border: { primary: "#e5e7eb", input: "#d1d5db" },
    status: { success: "#10b981", error: "#ef4444", info: "#3b82f6" },
  },

  dark: {
    background: { primary: "from-gray-900 to-gray-800", card: "#1f2937" },
    text: { primary: "#ffffff", secondary: "#f9fafb", muted: "#d1d5db" },
    border: { primary: "#374151", input: "#6b7280" },
    status: { success: "#34d399", error: "#f87171", info: "#60a5fa" },
  },
};
```

### 使用方式

```typescript
// 在组件中使用主题类
const themeClasses = useThemeClasses();
<div className={themeClasses.text.primary}>主要文字</div>
<div className={themeClasses.background.card}>卡片背景</div>
```

### 自定义颜色

要修改主题颜色，只需在 `styles/themes.ts` 中更新对应的颜色值即可：

```typescript
// 修改主色调
primary: {
  500: '#your-color',  // 替换为您想要的颜色
}

// 修改文字颜色
dark: {
  text: {
    primary: '#your-text-color',  // 深色主题主要文字颜色
  }
}
```

## 🚀 快速开始

### 环境要求

- Node.js 16.8 或更高版本
- npm、yarn、pnpm 或 bun

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 📦 主要依赖

| 依赖          | 版本     | 用途       |
| ------------- | -------- | ---------- |
| next          | ^14.0.0  | React 框架 |
| react         | ^18.0.0  | 前端库     |
| typescript    | ^5.0.0   | 类型检查   |
| tailwindcss   | ^3.3.0   | CSS 框架   |
| antd          | ^5.0.0   | UI 组件库  |
| react-dnd     | ^16.0.0  | 拖拽功能   |
| @dnd-kit/core | ^6.0.0   | 拖拽排序   |
| lucide-react  | ^0.290.0 | 图标库     |
| dayjs         | ^1.11.0  | 日期处理   |

## 🎯 核心特性详解

### 1. 拖拽系统架构

项目使用双拖拽引擎架构：

- **React DnD**：处理跨列拖拽（待完成 ↔ 已完成）
- **DnD Kit**：处理列内排序（同列内调整顺序）

### 2. 主题切换实现

- **Context 管理**：全局主题状态
- **LocalStorage 持久化**：保存用户偏好
- **CSS 类动态切换**：实时应用主题样式
- **Ant Design 集成**：组件库主题同步

### 3. 响应式设计策略

- **移动优先**：从小屏幕开始设计
- **断点系统**：sm (640px)、md (768px)、lg (1024px)、xl (1280px)
- **弹性网格**：自适应列数 (1 列 → 2 列 → 3 列)

### 4. 性能优化

- **懒加载**：按需导入组件
- **内存优化**：及时清理事件监听器
- **渲染优化**：减少不必要的重渲染

## 🔧 开发指南

### 添加新功能

1. 在 `components/` 中创建新组件
2. 在 `hooks/` 中添加相关逻辑
3. 在 `types/` 中定义 TypeScript 类型
4. 更新主题系统（如需要）

### 自定义主题

1. 修改 `styles/themes.ts` 中的颜色配置
2. 使用 `useThemeClasses` Hook 获取主题类
3. 应用新的样式类到组件

### 扩展拖拽功能

1. 在相应组件中添加拖拽 Hook
2. 更新拖拽事件处理逻辑
3. 确保与现有拖拽系统兼容

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交变更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - 优秀的 React 框架
- [Ant Design](https://ant.design/) - 精美的组件库
- [Tailwind CSS](https://tailwindcss.com/) - 强大的 CSS 框架
- [React DnD](https://react-dnd.github.io/react-dnd/) - 拖拽功能支持
- [DnD Kit](https://dndkit.com/) - 现代拖拽库

---

如有问题或建议，请随时提出 Issue 或联系开发者。
