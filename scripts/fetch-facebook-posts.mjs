// 抓指定的粉專貼文給 import-facebook-posts.mjs 用（唯讀 Graph API）：
//   <備份資料夾>/page-all.json  貼文原文、時間、網址
//   <備份資料夾>/img/<編號>.jpg   第一張圖的最大尺寸（影片用預設縮圖），編號是貼文編號底線後那段
//
// 用法：FB_PAGE_TOKEN=... node scripts/fetch-facebook-posts.mjs <備份資料夾> <貼文編號> [<貼文編號> ...]
//       本機也可以給 FB_USER_TOKEN，會自動換成粉專權杖。權杖不印出來、不寫進備份資料夾。
// 備份資料夾放 repo 外面：原圖可能有桐桐的臉，網站只放處理過的版本。

import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const PAGE_ID = '104140774603169';
const API = 'https://graph.facebook.com/v25.0';
const [outDir, ...ids] = process.argv.slice(2);
if (!outDir || !ids.length) throw new Error('用法：node scripts/fetch-facebook-posts.mjs <備份資料夾> <貼文編號> ...');

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
  throw new Error('要給 FB_PAGE_TOKEN 或 FB_USER_TOKEN');
}

// 第一張圖的最大尺寸：照片查 images，影片查預設縮圖，都查不到就用 full_picture
async function bestImage(post, token) {
  const att = post.attachments?.data?.[0];
  const first = att?.subattachments?.data?.[0] ?? att;
  try {
    if (first?.media_type === 'photo') {
      const fbid = first.target?.id;
      const { images } = await get(`${API}/${fbid}?fields=images&access_token=${token}`);
      return images.sort((a, b) => b.width - a.width)[0].source;
    }
    if (first?.media_type === 'video') {
      const { thumbnails } = await get(`${API}/${first.target?.id}?fields=thumbnails{uri,is_preferred}&access_token=${token}`);
      return (thumbnails.data.find((t) => t.is_preferred) ?? thumbnails.data[0]).uri;
    }
  } catch (err) {
    console.log(`[注意] ${post.id} 查不到原尺寸，改用 full_picture：${err.message}`);
  }
  return post.full_picture;
}

const token = await pageToken();
const fields = 'id,created_time,message,permalink_url,full_picture,attachments{media_type,target,subattachments.limit(1){media_type,target}}';
mkdirSync(path.join(outDir, 'img'), { recursive: true });

const posts = [];
for (const raw of ids) {
  const id = raw.includes('_') ? raw : `${PAGE_ID}_${raw}`;
  const post = await get(`${API}/${id}?fields=${encodeURIComponent(fields)}&access_token=${token}`);
  posts.push(post);
  const key = id.split('_').pop();
  const src = await bestImage(post, token);
  if (!src) {
    console.log(key, '沒有圖');
    continue;
  }
  const res = await fetch(src);
  if (!res.ok) throw new Error(`${key} 圖片下載失敗 ${res.status}`);
  writeFileSync(path.join(outDir, 'img', `${key}.jpg`), Buffer.from(await res.arrayBuffer()));
  console.log(key, post.created_time, (post.message ?? '').split('\n')[0]);
}
writeFileSync(path.join(outDir, 'page-all.json'), JSON.stringify({ fetched_at: new Date().toISOString(), posts }, null, 1), 'utf8');
console.log(`寫入 ${posts.length} 篇到 ${outDir}`);
