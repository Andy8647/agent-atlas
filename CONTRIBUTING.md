# 贡献指南

## 添加一篇新文章

1. 在 `content/articles/` 下创建 `your-slug.mdx`
2. 按模板写好 YAML frontmatter 和正文
3. 在 YAML frontmatter 声明前置依赖 `prerequisites`
4. 运行 `node scripts/generate-manifest.mjs` 更新技能树
5. `npm run dev` 预览

## 添加一个新的交互 Widget

1. 在 `src/components/widgets/` 下创建组件（`MyWidget.tsx`）
2. 在 `src/lib/mdxComponents.ts` 中注册
3. 在文章中直接使用：`<MyWidget />`

## 技术栈约定

- 状态管理：Zustand（所有 widget 是自包含的，不依赖文章上下文）
- 动画：Framer Motion（React 状态过渡）+ D3.js（数据可视化）
- 样式：Tailwind CSS + CSS 变量（支持 dark mode）
- 尊重 `prefers-reduced-motion`：所有动画组件都使用 `useReducedMotion()` hook
