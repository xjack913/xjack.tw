// 把舊文章備份（scratchpad 的 research/<來源>）搬進 src/content/blog/<來源>/。
// 只動標記不動文字：標題層級往下一階（文章頁的 h1 是標題）、拿掉有桐桐正臉的照片、圖片重新存檔壓到 1600 寬。
// 用法：node scripts/import-legacy-blog.mjs <來源> <備份資料夾>
//   來源：xjack（舊站 xjack.tw）、medium、blogger、biji（運動筆記）
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const [source, src] = process.argv.slice(2);
if (!source || !src) throw new Error('用法：node scripts/import-legacy-blog.mjs <來源> <備份資料夾>');
const dest = path.resolve('src/content/blog', source);

const origins = {
  xjack: '叉傑克不跑步聊數據',
  medium: 'Medium',
  blogger: '叉傑克-進化科學跑者之路',
  biji: '運動筆記',
};

// 有桐桐真實正臉的照片不放（隱私規則），之後若有去識別化版本再補回。key：檔名裡的文章代號
const hidden = {
  1277: ['02.jpg', '03.jpg', '04.jpg', '05.jpg', '08.jpg', '09.jpg', '10.jpg', 'cover.jpg'],
};
const coverFallback = {
  1277: '01.jpg',
};
const extraHidden = (() => {
  const f = path.join(src, 'hidden.json');
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {};
})();

const removedNote =
  '<p class="photo-removed">（這裡原本有一張桐桐露臉的照片，為了保護她的隱私，搬家時先拿掉了。）</p>';

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

const files = readdirSync(src).filter((f) => /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(f));
for (const file of files) {
  const md = readFileSync(path.join(src, file), 'utf8').replace(/^﻿/, '');
  const [, front, body0] = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  // 圖片資料夾代號：./images/<key>/...
  const key = body0.match(/\.\/images\/([^/]+)\//)?.[1] ?? front.match(/\.\/images\/([^/]+)\//)?.[1];
  const hide = new Set([...(hidden[key] ?? []), ...(extraHidden[key] ?? [])]);
  let body = body0;

  // 內文標題往下一階：# → ##（只在內文最高層級是 # 時）
  if (/^# /m.test(body)) body = body.replace(/^(#{1,5}) /gm, '#$1 ');

  // 拿掉有桐桐正臉的照片（連同緊接在下一行的斜體圖說）
  body = body.replace(/!\[[^\]]*\]\(\.\/images\/[^/]+\/([^)\s]+)\)(\s*\n\*[^\n]*\*)?/g, (all, name) =>
    hide.has(name) ? removedNote : all,
  );

  let fm = front;
  const coverName = fm.match(/cover:\s*"\.\/images\/[^/]+\/([^"]+)"/)?.[1];
  if (coverName && hide.has(coverName)) {
    fm = coverFallback[key]
      ? fm.replace(/cover:\s*".*"/, `cover: "./images/${key}/${coverFallback[key]}"`)
      : fm.replace(/^cover:.*\n?/m, '');
  }
  // 原文網址統一放 originalUrl，方便里程碑把外部連結換成站內文章
  const original = fm.match(/^(?:legacyUrl|mediumUrl|bloggerUrl|bijiUrl|originalUrl):\s*"?([^"\n]+)"?/m)?.[1];
  if (original && !/^originalUrl:/m.test(fm)) fm += `\noriginalUrl: "${original}"`;
  if (!/^origin:/m.test(fm)) fm += `\norigin: "${origins[source] ?? source}"`;

  writeFileSync(path.join(dest, file), `---\n${fm}\n---\n${body}`, 'utf8');

  const imgDir = key && path.join(src, 'images', key);
  if (imgDir && existsSync(imgDir)) {
    const out = path.join(dest, 'images', key);
    mkdirSync(out, { recursive: true });
    for (const img of readdirSync(imgDir)) {
      if (hide.has(img)) continue;
      // 舊圖有些檔頭不標準（Astro 讀不到尺寸），統一重新存一次，順便把寬度壓到 1600 以內
      const input = path.join(imgDir, img);
      const pipeline = sharp(input, { animated: /\.gif$/i.test(img) })
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true });
      if (/\.png$/i.test(img)) await pipeline.png({ compressionLevel: 9 }).toFile(path.join(out, img));
      else if (/\.jpe?g$/i.test(img)) await pipeline.jpeg({ quality: 85, mozjpeg: true }).toFile(path.join(out, img));
      else if (/\.webp$/i.test(img)) await pipeline.webp({ quality: 85 }).toFile(path.join(out, img));
      else copyFileSync(input, path.join(out, img));
    }
  }
  console.log(file, hide.size ? `（拿掉 ${hide.size} 張）` : '');
}
