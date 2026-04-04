import { defineConfig } from 'vitepress'
import { generateSidebar } from './sidebar.mjs'

export default defineConfig({
  title: "Quimaz's Wiki",
  description: 'Personal Knowledge Base',
  base: '/wiki/',
  lang: 'zh-CN',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/notes/2026/04-04' }
    ],

    sidebar: generateSidebar(),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/qwer555888/wiki' }
    ],

    editLink: {
      pattern: 'https://github.com/qwer555888/wiki/edit/main/docs/:path'
    },

    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    }
  }
})
