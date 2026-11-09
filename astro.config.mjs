// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

// SITE_URL 由部署流程帶入：先在子網域驗收，正式換成 https://xjack.tw
const site = process.env.SITE_URL || 'https://new.xjack.tw';

// 網站地圖的 lastmod：文章、漫畫用發表日期；列表頁和首頁用最新一篇的日期。
// 其他頁（角色檔案、成就、裝備、主題頁）沒有可靠的更新日期，就不寫，免得假裝每天都有更新。
function contentDates() {
  const dates = new Map();
  const field = (text, key) => text.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, 'm'))?.[1]?.trim();
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(path.join(dir, d.name)) : d.name.endsWith('.md') ? [path.join(dir, d.name)] : []);
  for (const file of walk('./src/content/blog')) {
    const fm = fs.readFileSync(file, 'utf8').split(/^---\s*$/m)[1] ?? '';
    const slug = field(fm, 'slug') ?? field(fm, 'legacyId');
    const date = field(fm, 'date');
    if (slug && date) dates.set(`/blog/${slug}/`, date);
  }
  for (const file of walk('./src/content/tongdad')) {
    const fm = fs.readFileSync(file, 'utf8').split(/^---\s*$/m)[1] ?? '';
    const date = field(fm, 'date');
    if (date) dates.set(`/tongdad/${path.basename(file, '.md')}/`, date);
  }
  const latest = (prefix) => [...dates].filter(([p]) => p.startsWith(prefix)).map(([, d]) => d).sort().at(-1);
  const blog = latest('/blog/');
  const comics = latest('/tongdad/');
  dates.set('/blog/', blog);
  dates.set('/tongdad/', comics);
  dates.set('/tongdad/read/', comics);
  dates.set('/', [blog, comics].sort().at(-1));
  return dates;
}
const lastmods = contentDates();

// 文章裡的第一張圖多半就在手機第一屏，Astro 預設全部延後載入（lazy），會拖慢 Google 量的 LCP。
// 每篇只把第一張改成馬上載入、優先下載。外掛物件是所有文章共用的，用每篇各自的 ctx.data.astro 認「新的一篇」。
const seenDocs = new WeakSet();
const firstImageEager = {
  name: 'first-image-eager',
  element: {
    filter: ['img'],
    visit(node, ctx) {
      const doc = ctx.data?.astro;
      if (!doc || seenDocs.has(doc)) return;
      seenDocs.add(doc);
      ctx.setProperty(node, 'loading', 'eager');
      ctx.setProperty(node, 'fetchpriority', 'high');
    },
  },
};
// 掛在預設的 Markdown 處理器（Sätteri）上，要排在它自己的圖片處理之前，屬性才會帶進最後的 <img>
const markdownFirstImage = {
  name: 'markdown-first-image-eager',
  hooks: {
    'astro:config:setup': ({ config }) => {
      config.markdown.processor.options.hastPlugins.push(firstImageEager);
    },
  },
};

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // 舊網址轉址頁不放進網站地圖
  integrations: [
    markdownFirstImage,
    sitemap({
      filter: (page) => !/^\/(w|web)\//.test(new URL(page).pathname),
      serialize(item) {
        const date = lastmods.get(decodeURI(new URL(item.url).pathname));
        if (date) item.lastmod = new Date(`${date}T00:00:00+08:00`).toISOString();
        return item;
      },
    }),
  ],
  // 舊站（RQ 官網系統）的固定頁面網址，換網域後仍要能點得到；
  // 舊首頁 /web/xjack/index.html 是 public/web/xjack/index.html 的轉址頁
  redirects: {
    '/web/xjack/home': '/',
    '/web/xjack/member': '/about/',
    '/web/xjack/contact': '/about/#contact',
    // 〈從開團到開公司〉下集原本在漫畫區，2026-11-02 改放冒險日誌；Google 已收過舊網址（2026-11-09 Search Console 回報 404）
    '/tongdad/260508': '/blog/fb-1453616180112935/',
  },
  markdown: {
    shikiConfig: { theme: 'github-light' },
    // 文章是當年的原文，不要把「...」換成「…」、把 5'50'' 換成彎引號
    smartypants: false,
  },
});
