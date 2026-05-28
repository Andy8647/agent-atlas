# Agent Atlas

> 交互式 AI Agent 应用层学习平台 — 从 ReAct 到 Harness Engineering

把 12 节中文讲义拆成 25 篇可交互文章，配上 RPG 风格技能树、可视化算法 widget、代码语法高亮。部署到 GitHub Pages，零服务器成本。

## 看上去什么样

- **技能树主页** — 25 个节点按 5 个 cluster 分组，前置依赖以紫色边线相连。状态分三档：未学(灰) / 学习中(蓝光) / 已掌握(金光)。打开主页会智能聚焦到「下一个该学的节点」。
- **文章页** — Catppuccin Mocha 代码卡片 + 语法高亮，Obsidian 风 callout，KaTeX 公式，wikilink 跳转，上标 `<Cite>` + 文末自动 references。
- **Cmd+K 全局搜索** — 模糊搜索 25 篇文章的标题 / cluster / summary。
- **Dark / Light 一键切换** — Catppuccin Mocha ↔ Latte 双 palette，全站统一切换。

## 内容大纲

| Cluster | 节点数 | 涵盖内容 |
|---|---|---|
| Agent 基础概念 | 3 | 什么是 Agent、Workflow vs Agent、架构双视角 |
| 单 Agent 推理范式 | 5 | ReAct、Plan-and-Solve、Tree of Thoughts、Reflexion |
| 工具与记忆 | 5 | Function Calling、Toolformer、ACI、MemGPT |
| 上下文工程 | 5 | Context Engineering、设计原则、长程技术、四种崩法 |
| 多 Agent 与工程落地 | 7 | 多Agent大辩论、Harness、评估、Prompt Caching |

## 技术栈

| 层 | 选择 |
|---|---|
| 框架 | React 19 + TypeScript + Vite |
| 路由 | react-router-dom HashRouter |
| 样式 | Tailwind CSS 4 + CSS variables |
| 状态 | Zustand + persist (localStorage) |
| 画布 | @xyflow/react + dagre (compound layout) |
| 内容 | MDX 3 + remark/rehype 插件链 |
| 代码高亮 | shiki + Catppuccin Mocha (build-time) |
| 公式 | KaTeX |
| 字体 | Maple Mono NF CN |

## 本地开发

```bash
npm install
npm run dev          # → http://localhost:5173/agent-atlas/
npm run build        # → dist/
```

## 添加 / 编辑文章

1. 在 `content/articles/` 创建 `<slug>.mdx`
2. 写 YAML frontmatter
3. 正文用标准 markdown，需要时插入 widget 或 cite
4. 运行 `node scripts/generate-manifest.mjs` 重新生成 `src/content/tree.ts`

```yaml
---
title: "ReAct: 推理与行动交替"
slug: "react-core"
cluster: "single-agent-reasoning"
order: 4
prerequisites: ["agent-architecture"]
estimatedMinutes: 12
summary: "..."
widgets: ["ReActVisualizer"]
references:
  - id: yao2023react
    authors: "Yao, S., et al."
    year: 2023
    title: "ReAct: Synergizing Reasoning and Acting in Language Models"
    venue: "ICLR 2023"
    url: "https://arxiv.org/abs/2210.03629"
---
```

支持的 markdown 扩展：

- Obsidian callout: `> [!note]` / `> [!tip]` / `> [!warning]` / `> [!important]` / `> [!example]` / `> [!question]`
- Wikilink: `[[other-slug]]` → 自动转跳转链接
- 引用: `<Cite id="yao2023react" />` → 上标编号，点击平滑滚到底部 References
- KaTeX: 行内 `$...$`，块级 `$$...$$`
- 代码块带标题: ` ```python title="agent.py" `

## 部署

`main` 分支 push 即触发 `.github/workflows/deploy.yml`，构建后部署到 GitHub Pages。

## License

MIT
