import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/vanillajs-smartwizard/',
  title: "VanillaJS SmartWizard",
  description: "The awesome step wizard plugin in pure VanillaJS",
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jmarquez84/vanillajs-smartwizard' }
    ]
  }
})
