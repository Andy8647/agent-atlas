import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkCallouts from '@portaljs/remark-callouts'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkWikilink from './scripts/remark-wikilink.mjs'

export default defineConfig({
  plugins: [
    mdx({
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: 'frontmatter' }],
        remarkGfm,
        remarkMath,
        remarkCallouts,
        remarkWikilink,
      ],
      rehypePlugins: [
        rehypeKatex,
        [
          rehypePrettyCode,
          {
            theme: 'catppuccin-mocha',
            keepBackground: true,
            defaultLang: 'plaintext',
          },
        ],
      ],
    }),
    tailwindcss(),
    react(),
  ],
  base: '/agent-atlas/',
})
