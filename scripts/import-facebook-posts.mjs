// 把粉專長文搬進 src/content/blog/facebook/。
// 文字照原文，只做 scripts/facebook-edits.json 列的修改：刪掉只在臉書成立的句子（連結放留言、報名、hashtag）、
// 隱私與用字調整。原文的空行分段、單一換行保留成換行。
// 用法：node scripts/import-facebook-posts.mjs <備份資料夾>
//   備份資料夾：page-all.json（Graph API 抓的全部貼文）、img/NNN.jpg（原圖）、img-edit/NNN.jpg（處理過的圖）
//   NNN 是 facebook-edits.json 的 n（粉專 500 字以上長文依日期排的編號）
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import sharp from 'sharp';

const [src] = process.argv.slice(2);
if (!src) throw new Error('用法：node scripts/import-facebook-posts.mjs <備份資料夾>');
const dest = path.resolve('src/content/blog/facebook');
const origin = '叉傑克 XJack 粉專';

const edits = JSON.parse(readFileSync(path.resolve('scripts/facebook-edits.json'), 'utf8'));
const { posts } = JSON.parse(readFileSync(path.join(src, 'page-all.json'), 'utf8'));
const byId = new Map(posts.map((p) => [p.id, p]));

// 貼文時間換成臺北日期
const tpe = (iso) => new Date(new Date(iso).getTime() + 8 * 3600e3).toISOString().slice(0, 10);
const yaml = (s) => JSON.stringify(s);

// 行首會被當成 Markdown 語法的字元，以及行內的強調、連結、HTML 符號，一律跳脫成原字
const escape = (line) =>
  line
    .replace(/([\\`*_[\]<>])/g, '\\$1')
    .replace(/^(\s*)([#>+\-=|~])/, '$1\\$2')
    .replace(/^(\s*\d+)([.)])/, '$1\\$2');

const hashtagLine = (l) => /^\s*(#\S+\s*)+$/.test(l);
const ruleLine = (l) => /^\s*[-—–_]{2,}\s*$/.test(l);

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

for (const e of edits) {
  const post = byId.get(e.id);
  if (!post) throw new Error(`找不到貼文 #${e.n} ${e.id}`);
  const lines = post.message.split('\n');

  for (const r of e.replace) {
    const i = r.line - 1;
    if (!lines[i]?.includes(r.from)) throw new Error(`#${e.n} 第 ${r.line} 行沒有「${r.from}」`);
    lines[i] = lines[i].replace(r.from, r.to);
  }
  const drop = new Set();
  for (const [a, b] of e.cut) for (let i = a; i <= b; i++) drop.add(i - 1);
  if (e.dropFirstLine) drop.add(lines.findIndex((l) => l.trim()));

  const kept = lines.filter((l, i) => !drop.has(i) && !hashtagLine(l) && !ruleLine(l));
  // 網站不能出現的字（娶嫁、爸爸不想看到的「快 40 年」「殺進殺出」）
  for (const word of ['娶', '嫁', '殺進殺出', '快 40 年', '快40年']) {
    if (kept.some((l) => l.includes(word)) || e.title.includes(word)) throw new Error(`#${e.n} 還有「${word}」`);
  }

  // 空行分段；段內的換行用反斜線硬換行保留
  const blocks = [];
  let cur = [];
  for (const l of kept) {
    if (l.trim()) cur.push(l.trimEnd());
    else if (cur.length) blocks.push(cur), (cur = []);
  }
  if (cur.length) blocks.push(cur);
  const body = blocks.map((b) => b.map(escape).join('\\\n')).join('\n\n');

  const flat = blocks[0].join('');
  const excerpt = flat.length > 80 ? `${flat.slice(0, 80)}…` : flat;

  const date = tpe(post.created_time);
  const key = post.id.split('_').pop();
  const imgDir = path.join(dest, 'images', key);
  mkdirSync(imgDir, { recursive: true });

  const head = [];
  let cover;
  if (e.image === 'hidden') {
    head.push('<p class="photo-removed">（這裡原本有一張桐桐露臉的照片，為了保護她的隱私，搬家時先拿掉了。）</p>');
  } else {
    const file = path.join(src, e.image === 'edited' ? 'img-edit' : 'img', `${String(e.n).padStart(3, '0')}.jpg`);
    await sharp(file).resize({ width: 1400, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(imgDir, '01.jpg'));
    head.push(`![${e.alt}](./images/${key}/01.jpg)`);
    cover = `./images/${key}/01.jpg`;
  }
  if (e.video) head.push(`[到 Facebook 看這支影片](${e.video})`);

  // 沒有可用的圖就做一張封面（標題、分類、日期）
  if (!cover) {
    const out = path.join(imgDir, 'cover.jpg');
    execFileSync(process.execPath, ['scripts/og/cover.mjs', out, e.coverTitle ?? e.title, e.tag, date.replaceAll('-', '.')], { stdio: 'ignore' });
    cover = `./images/${key}/cover.jpg`;
  }

  const front = [
    '---',
    `title: ${yaml(e.title)}`,
    `date: ${date}`,
    `slug: ${yaml(`fb-${key}`)}`,
    `cover: ${yaml(cover)}`,
    `excerpt: ${yaml(excerpt)}`,
    `tags: ${JSON.stringify([e.tag])}`,
    `origin: ${yaml(origin)}`,
    `originalUrl: ${yaml(post.permalink_url)}`,
    '---',
  ];
  writeFileSync(path.join(dest, `${date}-${key}.md`), `${front.join('\n')}\n\n${head.join('\n\n')}\n\n${body}\n`, 'utf8');
  console.log(`#${e.n}`, date, e.title);
}
console.log(`共 ${edits.length} 篇`);
