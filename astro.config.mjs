// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL 由部署流程帶入：先在子網域驗收，正式換成 https://xjack.tw
const site = process.env.SITE_URL || 'https://new.xjack.tw';

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [sitemap()],
  // 舊站（RQ 官網系統）的固定頁面網址，換網域後仍要能點得到
  redirects: {
    '/web/xjack/home': '/',
    '/web/xjack/member': '/about/',
    '/web/xjack/contact': '/about/#contact',
  },
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
