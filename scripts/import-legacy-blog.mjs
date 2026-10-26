// 把舊站備份（scratchpad 的 research/blog）搬進 src/content/blog。
// 只動標記不動文字：標題層級往下一階（文章頁的 h1 是標題）、拿掉有桐桐正臉的照片。
// 用法：node scripts/import-legacy-blog.mjs <備份資料夾>
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const src = process.argv[2];
if (!src) throw new Error('請給舊站備份資料夾路徑');
const dest = path.resolve('src/content/blog');

// 有桐桐真實正臉的照片不放（隱私規則），之後若有去識別化版本再補回
const hidden = {
  1277: ['02.jpg', '03.jpg', '04.jpg', '05.jpg', '08.jpg', '09.jpg', '10.jpg', 'cover.jpg'],
};
// 封面被拿掉時改用的圖
const coverFallback = {
  1277: '01.jpg',
};

const removedNote =
  '<p class="photo-removed">（這裡原本有一張桐桐露臉的照片，為了保護她的隱私，搬家時先拿掉了。）</p>';

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

const files = readdirSync(src).filter((f) => /^\d{4}-\d{2}-\d{2}-\d+\.md$/.test(f));
for (const file of files) {
  let md = readFileSync(path.join(src, file), 'utf8').replace(/^﻿/, '');
  const id = Number(file.match(/-(\d+)\.md$/)[1]);
  const hide = new Set(hidden[id] ?? []);

  const [, front, body0] = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  let body = body0;

  // 內文標題往下一階：# → ##，依此類推（只在內文最高層級是 # 時）
  if (/^# /m.test(body)) body = body.replace(/^(#{1,5}) /gm, '#$1 ');

  // 拿掉有桐桐正臉的照片（連同緊接在下一行的斜體圖說）
  body = body.replace(/!\[[^\]]*\]\(\.\/images\/\d+\/([^)\s]+)\)(\s*\n\*[^\n]*\*)?/g, (all, name) =>
    hide.has(name) ? removedNote : all,
  );

  let fm = front;
  const coverName = fm.match(/cover:\s*"\.\/images\/\d+\/([^"]+)"/)?.[1];
  if (coverName && hide.has(coverName)) {
    fm = coverFallback[id]
      ? fm.replace(/cover:\s*".*"/, `cover: "./images/${id}/${coverFallback[id]}"`)
      : fm.replace(/^cover:.*\n?/m, '');
  }
  if (!/^origin:/m.test(fm)) fm += '\norigin: "叉傑克不跑步聊數據"';

  writeFileSync(path.join(dest, file), `---\n${fm}\n---\n${body}`, 'utf8');

  const imgDir = path.join(src, 'images', String(id));
  if (existsSync(imgDir)) {
    const out = path.join(dest, 'images', String(id));
    mkdirSync(out, { recursive: true });
    for (const img of readdirSync(imgDir)) {
      if (hide.has(img)) continue;
      // 舊圖有些檔頭不標準（Astro 讀不到尺寸），統一重新存一次，順便把寬度壓到 1600 以內
      const input = path.join(imgDir, img);
      const pipeline = sharp(input).rotate().resize({ width: 1600, withoutEnlargement: true });
      if (/\.png$/i.test(img)) await pipeline.png({ compressionLevel: 9 }).toFile(path.join(out, img));
      else if (/\.jpe?g$/i.test(img)) await pipeline.jpeg({ quality: 85, mozjpeg: true }).toFile(path.join(out, img));
      else copyFileSync(input, path.join(out, img));
    }
  }
  console.log(file, hide.size ? `（拿掉 ${hide.size} 張）` : '');
}
