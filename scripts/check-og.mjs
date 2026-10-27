// 建置後檢查：每一頁的 og:image 如果指向本站，檔案一定要真的在 dist 裡。
// 少一張就讓建置失敗，免得 FB／LINE 分享時悄悄變成沒有圖（2026-10-28 曾有 5 篇文章這樣）。

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve(import.meta.dirname, '..', 'dist');
const hosts = new Set(['xjack.tw', 'www.xjack.tw', 'new.xjack.tw']);
if (process.env.SITE_URL) hosts.add(new URL(process.env.SITE_URL).hostname);

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

const exists = (file) => stat(file).then(() => true, () => false);

let pages = 0;
const missing = [];
for await (const file of htmlFiles(dist)) {
  const html = await readFile(file, 'utf8');
  const content = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  if (!content) continue;
  pages++;
  const url = new URL(content.replaceAll('&amp;', '&'), 'https://xjack.tw');
  if (!hosts.has(url.hostname)) continue;
  if (!(await exists(path.join(dist, decodeURIComponent(url.pathname))))) {
    missing.push(`${path.relative(dist, file)} → ${url.pathname}`);
  }
}

if (missing.length) {
  console.error(`[check-og] ${missing.length} 頁的分享圖不存在：\n${missing.join('\n')}`);
  process.exit(1);
}
console.log(`[check-og] ${pages} 頁的分享圖都在`);
