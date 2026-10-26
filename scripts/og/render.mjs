// 重做分享預覽圖：node scripts/og/render.mjs（需要本機裝 Chrome）
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const chrome = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const png = path.join(here, 'og.png');

execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--window-size=1200,630',
  '--virtual-time-budget=10000',
  `--screenshot=${png}`,
  pathToFileURL(path.join(here, 'og.html')).href,
]);

const out = path.join(here, '..', '..', 'public', 'og.jpg');
const info = await sharp(png).jpeg({ quality: 88, mozjpeg: true }).toFile(out);
console.log('public/og.jpg', info.width, info.height, info.size);
