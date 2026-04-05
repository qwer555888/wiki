import { defineConfig } from 'vitepress'
import { generateSidebar } from './sidebar.mjs'

export default defineConfig({
  ignoreDeadLinks: true,
  
  ignoreDeadLinks: true,
  title: "Quimaz's Wiki",
  description: 'Personal Knowledge Base',
  base: '/wiki/',
  lang: 'zh-CN',

  themeConfig: {
    nav: [
      { text: '棣栭〉', link: '/' },
      { text: '绗旇', link: '/notes/2026/04-05/01-绗旇' }
    ],

    sidebar: generateSidebar(),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/qwer555888/wiki' }
    ],

    editLink: {
      pattern: 'https://github.com/qwer555888/wiki/edit/main/docs/:path'
    },

    lastUpdated: {
      text: '鏈€鍚庢洿鏂?,
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    }
  }
})

