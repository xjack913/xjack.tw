// 把雲端「桐爸日記漫畫」典藏收進 src/content/tongdad/，給 /tongdad/ 用。
// 用法：node scripts/import-tongdad.mjs <漫畫典藏資料夾> <posts-all.json>
//   典藏只放已發表的定稿，檔名「發表日期 YYMMDD_主題」（粉專 repo 的 skill「整理桐爸漫畫」負責維護）；
//   posts-all.json 是粉專 repo 每天自動更新的全期貼文主檔。用日期加主題對到臉書貼文，拿標題、文字和原文網址。
// 已經收過的不重做；要重做某一張，先刪掉它的 .md 和圖。對不到貼文的列出來、不收，要人看過再處理。
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const [src, postsFile] = process.argv.slice(2);
if (!src || !postsFile) throw new Error('用法：node scripts/import-tongdad.mjs <漫畫典藏資料夾> <posts-all.json>');
const dest = path.resolve('src/content/tongdad');
const imgDir = path.join(dest, 'images');
mkdirSync(imgDir, { recursive: true });

const { posts } = JSON.parse(readFileSync(postsFile, 'utf8'));
const norm = (s = '') => s.replace(/[\p{P}\p{S}\s_]+/gu, '');
const yaml = (s) => JSON.stringify(s);
const hashtagLine = (l) => /^\s*(#\S+\s*)+$/.test(l);
// 分隔線換成空行；「⋯⋯」「……」是對白裡的停頓，照留
const ruleLine = (l) => /^\s*[-—–_]+\s*$/.test(l);

// 主題和貼文開頭共有幾個字；貼文有 #桐爸日記 再加分。同一天有兩篇時挑比較像的那篇
const score = (topic, p) =>
  [...new Set(norm(topic))].filter((c) => norm((p.message ?? '').split('\n').slice(0, 3).join('')).includes(c)).length +
  (p.message?.includes('#桐爸日記') ? 2 : 0);

// XJack 決定不進漫畫區的貼文（貼文編號底線後那段）→ 原因。
// 網址照樣先排好才跳過，同一天其他張的網址才不會變（例如 260130 跳過，260130-2 還是 260130-2）
const skip = new Map([
  ['1453616180112935', '〈從開團到開公司〉下集：有標 #桐爸日記，但講的是魔獸戰友創業，跟上集一起放冒險日誌（2026-11-02）'],
  // 2026-11-02 XJack：只有單格的不放漫畫區（單張插畫、節日賀圖）
  ['1361802815960939', '單格〈真正要訓練的，從來不是孩子，是爸媽。〉'],
  ['1369505361857351', '單格〈停車風險控管升級成親子互動功能。〉'],
  ['1371642138310340', '單格〈路過飲料店時，家裡真正的營養顧問會自動上線。〉'],
  ['1553364050138147', '單格〈我今天的產出是蓮花〉'],
  ['1584255123715706', '單格〈中秋節快樂〉'],
]);

const files = readdirSync(src)
  .filter((f) => /^\d{6}_.+\.(jpe?g|png|webp)$/i.test(f))
  .sort();

// 先全部對好：每個檔對一篇貼文，一篇貼文只給一個檔
const used = new Set();
const matched = [];
const missing = [];
for (const file of files) {
  const yymmdd = file.slice(0, 6);
  const topic = file.slice(7).replace(/\.[^.]+$/, '');
  const day = `20${yymmdd.slice(0, 2)}-${yymmdd.slice(2, 4)}-${yymmdd.slice(4, 6)}`;
  const best = posts
    .filter((p) => p.created_tpe.startsWith(day) && !used.has(p.post_id))
    .map((p) => ({ p, s: score(topic, p) }))
    .sort((a, b) => b.s - a.s)[0];
  if (!best || best.s < 3) {
    missing.push(file);
    continue;
  }
  used.add(best.p.post_id);
  matched.push({ file, yymmdd, topic, day, post: best.p });
}

// 網址用發表日期；同一天兩張照發文時間排，第二張加 -2
matched.sort((a, b) => a.post.created_unix - b.post.created_unix);
const perDay = new Map();
for (const m of matched) {
  const n = (perDay.get(m.yymmdd) ?? 0) + 1;
  perDay.set(m.yymmdd, n);
  m.slug = n === 1 ? m.yymmdd : `${m.yymmdd}-${n}`;
}

const done = new Set(readdirSync(dest).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3)));
const kept = matched.filter((m) => !skip.has(m.post.post_id.split('_').pop()));
let added = 0;
for (const { file, topic, day, post, slug } of kept) {
  if (done.has(slug)) continue;
  const lines = (post.message ?? '').split('\n');
  const first = lines.findIndex((l) => l.trim());
  const bracket = lines[first]?.trim().match(/^【(.+)】$/);
  const title = bracket ? bracket[1].trim() : topic;
  const text = lines
    .filter((l, i) => !(bracket && i === first) && !hashtagLine(l))
    .map((l) => (ruleLine(l) ? '' : l.trimEnd()))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  for (const word of ['娶', '嫁', '不跑步聊數據']) {
    if (text.includes(word) || title.includes(word)) throw new Error(`${file} 還有「${word}」`);
  }

  await sharp(path.join(src, file))
    .resize({ width: 1400, withoutEnlargement: true })
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(imgDir, `${slug}.jpg`));
  const front = [
    '---',
    `title: ${yaml(title)}`,
    `date: ${day}`,
    `image: ${yaml(`./images/${slug}.jpg`)}`,
    `alt: ${yaml(`桐爸日記漫畫〈${title}〉`)}`,
    `originalUrl: ${yaml(post.permalink_url)}`,
    `text: ${yaml(text)}`,
    '---',
  ];
  writeFileSync(path.join(dest, `${slug}.md`), `${front.join('\n')}\n`, 'utf8');
  added++;
  console.log(slug, title);
}

console.log(`新增 ${added} 張，原本就有的 ${kept.length - added} 張沒動，照 skip 跳過 ${matched.length - kept.length} 張`);
if (missing.length) console.log(`對不到貼文、沒收（要人看過）：\n  ${missing.join('\n  ')}`);
