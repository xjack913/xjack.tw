// 抓 Facebook 粉專的精選貼文，給首頁「世界頻道」用：
//   src/data/fb-featured.json  貼文摘要、日期、連結
//   public/fb-featured/*.jpg   貼文縮圖（臉書圖片網址會過期，所以抓下來自己放）
//
// 用法：FB_PAGE_TOKEN=... node scripts/sync-fb-featured.mjs
//       本機也可以給 FB_USER_TOKEN，會自動換成粉專權杖。
// 沒有權杖、或臉書 API 出錯，就什麼都不動、正常結束，網站沿用 repo 裡現有的那份。

import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PAGE_ID = '104140774603169';
const API = 'https://graph.facebook.com/v25.0';
// XJack 2026-10-27：挑三篇有代表性、最吸引人、風格和領域都不同的，不用最新的。
// 照粉專全期互動數挑；桐桐有真實照片的不選（網站不放桐桐真實照片）。
const PICKS = [
  { id: '1389468073194413', tag: 'AI 梗圖' }, // 〈我現在就退訂 Gemini！〉粉專觸及最高的一篇
  { id: '1363585379116016', tag: '桐爸日記' }, // 〈有些決定，要等你成為爸爸才懂〉
  { id: '1343199934487894', tag: '跑步數據' }, // 2025 臺北半馬男子跑者數據解密
];
const root = path.resolve(import.meta.dirname, '..');
const imgDir = path.join(root, 'public', 'fb-featured');
const outFile = path.join(root, 'src', 'data', 'fb-featured.json');

async function get(url) {
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(`Graph API ${res.status}：${json.error?.message ?? '未知錯誤'}`);
  return json;
}

async function pageToken() {
  if (process.env.FB_PAGE_TOKEN) return process.env.FB_PAGE_TOKEN;
  if (process.env.FB_USER_TOKEN) {
    const page = await get(`${API}/${PAGE_ID}?fields=access_token&access_token=${process.env.FB_USER_TOKEN}`);
    return page.access_token;
  }
  return null;
}

// 摘要：只取分隔線（— 或 --）以前的正文，去掉只有 hashtag 或句點的行，空白合併成一個，留前 140 字
function excerpt(message = '') {
  const lines = message.split('\n').map((line) => line.trim());
  const cut = lines.findIndex((line) => /^(—+|-{2,})$/.test(line));
  const text = (cut === -1 ? lines : lines.slice(0, cut))
    .filter((line) => line && !/^(#\S+\s*)+$/.test(line) && !/^[.．。…]+$/.test(line))
    .join(' ')
    .replace(/\s+/g, ' ');
  const chars = [...text];
  return chars.length > 140 ? `${chars.slice(0, 140).join('')}…` : text;
}

async function main() {
  const token = await pageToken();
  if (!token) {
    console.log('[skip] 沒有 FB_PAGE_TOKEN，沿用現有的 fb-featured.json');
    return;
  }

  // 全部抓完、縮好圖才動檔案，中途失敗不會留下半套
  const posts = [];
  const images = [];
  for (const { id, tag } of PICKS) {
    const p = await get(`${API}/${PAGE_ID}_${id}?fields=created_time,message,permalink_url,full_picture&access_token=${token}`);
    let image = null;
    if (p.full_picture) {
      const res = await fetch(p.full_picture);
      if (!res.ok) throw new Error(`下載圖片失敗 ${res.status}`);
      const file = `${id}.jpg`;
      const buf = await sharp(Buffer.from(await res.arrayBuffer()))
        .rotate()
        .resize({ width: 720, withoutEnlargement: true })
        .jpeg({ quality: 78, mozjpeg: true })
        .toBuffer();
      images.push({ file, buf });
      image = `/fb-featured/${file}`;
    }
    posts.push({
      tag,
      date: new Date(p.created_time.replace(/([+-]\d\d)(\d\d)$/, '$1:$2')).toISOString(),
      text: excerpt(p.message),
      url: p.permalink_url,
      image,
    });
  }

  await rm(imgDir, { recursive: true, force: true });
  await mkdir(imgDir, { recursive: true });
  for (const { file, buf } of images) await writeFile(path.join(imgDir, file), buf);
  await writeFile(outFile, `${JSON.stringify({ fetchedAt: new Date().toISOString(), posts }, null, 2)}\n`);
  console.log(`[ok] ${posts.length} 篇貼文、${images.length} 張圖`);
}

main().catch((err) => {
  console.warn(`[warn] 粉專精選沒更新：${err.message}`);
});
