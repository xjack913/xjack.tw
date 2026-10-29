// 產生文章封面：node scripts/og/cover.mjs <輸出.jpg> <標題> <分類> <日期>（需要本機裝 Chrome；標題用「|」手動斷行）
// 給沒有可用照片的文章用（例如原圖有桐桐真實的臉），版型在 cover.html
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const [out, title, tag, date] = process.argv.slice(2);
if (!out || !title) throw new Error('用法：node scripts/og/cover.mjs <輸出.jpg> <標題> <分類> <日期>');

const here = path.dirname(fileURLToPath(import.meta.url));
const chrome = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const tmp = mkdtempSync(path.join(tmpdir(), 'cover-'));
const png = path.join(tmp, 'cover.png');

const url = pathToFileURL(path.join(here, 'cover.html'));
url.search = new URLSearchParams({ title, tag: tag ?? '', date: date ?? '' }).toString();

execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--window-size=1200,750',
  '--virtual-time-budget=10000',
  `--user-data-dir=${tmp}`,
  `--screenshot=${png}`,
  url.href,
]);

const info = await sharp(png).jpeg({ quality: 88, mozjpeg: true }).toFile(out);
rmSync(tmp, { recursive: true, force: true });
console.log(out, info.width, info.height, info.size);
