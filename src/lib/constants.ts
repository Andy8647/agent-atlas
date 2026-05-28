// Catppuccin Mocha cluster colors
export const CLUSTER_COLORS: Record<string, string> = {
  foundations: '#cba6f7',              // mauve
  'single-agent-reasoning': '#fab387', // peach
  'tools-and-memory': '#a6e3a1',       // green
  'context-engineering': '#89b4fa',    // blue
  'multi-agent-production': '#f5c2e7', // pink
}

// Catppuccin Mocha (dark)
export const MOCHA = {
  crust: '#11111b',
  mantle: '#181825',
  base: '#1e1e2e',
  surface0: '#313244',
  surface1: '#45475a',
  surface2: '#585b70',
  overlay0: '#6c7086',
  overlay1: '#7f849c',
  subtext0: '#a6adc8',
  subtext1: '#bac2de',
  text: '#cdd6f4',
  mauve: '#cba6f7',
  blue: '#89b4fa',
  green: '#a6e3a1',
  peach: '#fab387',
  yellow: '#f9e2af',
  pink: '#f5c2e7',
  red: '#f38ba8',
  lavender: '#b4befe',
} as const

// Catppuccin Latte (light)
export const LATTE = {
  crust: '#dce0e8',
  mantle: '#e6e9ef',
  base: '#eff1f5',
  surface0: '#ccd0da',
  surface1: '#bcc0cc',
  surface2: '#acb0be',
  overlay0: '#9ca0b0',
  overlay1: '#8c8fa1',
  subtext0: '#6c6f85',
  subtext1: '#5c5f77',
  text: '#4c4f69',
  mauve: '#8839ef',
  blue: '#1e66f5',
  green: '#40a02b',
  peach: '#fe640b',
  yellow: '#df8e1d',
  pink: '#ea76cb',
  red: '#d20f39',
  lavender: '#7287fd',
} as const

export type Palette = typeof MOCHA

export const SITE_TITLE = 'AI Agents 学习路线图'
export const SITE_DESCRIPTION = '交互式 AI Agent 应用层学习平台 — 从 ReAct 到 Harness Engineering'
export const GITHUB_URL = 'https://github.com/Andy8647/agent-atlas'
