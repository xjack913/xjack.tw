// 把舊文章備份（scratchpad 的 research/<來源>）搬進 src/content/blog/<來源>/。
// 只動標記不動文字：標題層級往下一階（文章頁的 h1 是標題）、拿掉有桐桐正臉的照片、圖片重新存檔壓到 1600 寬。
// 用法：node scripts/import-legacy-blog.mjs <來源> <備份資料夾>
//   來源：xjack（舊站 xjack.tw）、medium、blogger、biji（運動筆記）
// 圖片寬度壓到 1400、JPEG 品質 80、PNG 減色，控制 repo 大小
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import sharp from 'sharp';

const [source, src] = process.argv.slice(2);
if (!source || !src) throw new Error('用法：node scripts/import-legacy-blog.mjs <來源> <備份資料夾>');
const dest = path.resolve('src/content/blog', source);

const origins = {
  xjack: 'xjack.tw 舊站',
  medium: 'Medium',
  blogger: '叉傑克-進化科學跑者之路',
  biji: '運動筆記',
};

// 有桐桐真實正臉的照片不放（隱私規則），之後若有去識別化版本再補回。key：圖片資料夾代號
const hidden = {
  1277: ['02.jpg', '03.jpg', '04.jpg', '05.jpg', '08.jpg', '09.jpg', '10.jpg', 'cover.jpg'],
  df407f858d30: ['01.jpg', '04.jpg', '05.jpg'],
  e556c609ce68: ['02.jpg'],
  '9f412d55a572': ['01.jpg'],
};
const coverFallback = {
  1277: '01.jpg',
  '9f412d55a572': '02.jpg',
};
// 沒有照片、或沒有適合當封面的照片：用 scripts/og/cover.mjs 做一張（標題用「|」斷行、分類）
const madeCover = {
  'medium/2020-11-28-df407f858d30.md': ['親身經歷產後大出血事故|（母女均安）之重點分享', '家庭與桐爸'],
  'blogger/2019-02-02-108c.md': ['【臺北市108年田徑C級教練】|課程筆記摘要', '跑步知識'],
};
// 原文沒有照片：從 XJack 的 Google 相簿找回比賽當天的照片，放在備份資料夾 images/<代號>/01.jpg。
// 內文開頭放整張；照片是直的，封面從 top（原圖高度的比例）往下裁一張 16:10
const addedPhoto = {
  // 比賽是 2013-12-22，心得 2014 年 3 月才寫
  'biji/2014-03-19-678.md': { alt: '2013 花蓮太平洋縱谷馬拉松會場，拿著完賽毛巾', top: 0.13 },
  'biji/2014-08-18-984.md': { alt: '2014 都蘭夏日馬拉松，沿著海岸步道往前跑的背影', top: 0.03 },
};

// 同一篇發在好幾個地方：留最早的原文（Blogger）或圖片最完整的版本，其他版本只記在 alsoAt
const skip = {
  medium: ['5d043c2d2e50', '76ec663a504f', 'bfafa220ea3e'],
  biji: ['39441'],
};
const medium = (hash) => `https://medium.com/p/${hash}`;
const biji = (id) => `https://running.biji.co/index.php?q=review&act=detail&id=${id}`;
const fbPage = (id) => `https://www.facebook.com/1468991118575441/posts/${id}`;
const alsoAt = {
  'xjack/2022-04-18-1310.md': [medium('354a2e062c4b'), fbPage('498443208506255')],
  'xjack/2021-12-24-1297.md': [medium('fcf8a79c221f')],
  'xjack/2021-07-17-1277.md': [medium('a6ddba5ef363')],
  'xjack/2021-01-26-1266.md': [medium('e3c6f679131a')],
  'xjack/2021-01-05-1268.md': [medium('235ef6dcd93a')],
  'blogger/2017-05-11-kkboxizerorunningquotient.md': [medium('5d043c2d2e50')],
  'blogger/2019-02-02-108c.md': [medium('76ec663a504f')],
  'blogger/2018-12-10-blog-post.md': [medium('bfafa220ea3e'), biji(35591)],
  'blogger/2017-11-19-2017pb-15301.md': [biji(32963)],
  'blogger/2018-09-19-seiko.md': [biji(34646)],
  'blogger/2018-01-31-2018.md': [biji(33122)],
  'medium/2020-01-22-fc6efd06f772.md': [biji(39441)],
  // 粉專也貼過同一篇（scripts/import-facebook-posts.mjs 就不再搬一次）
  'medium/2020-12-01-e556c609ce68.md': [fbPage('200640534953192')],
  'medium/2023-09-22-bfab2519d71e.md': [fbPage('738623624945531')],
};

// 舊站版本少了的圖說，從同一篇的 Medium 版補回來（XJack 自己寫的原文）
const captions = {
  1310: {
    '01.jpeg': '2016 年一對一線上教學經驗分享會',
    '02.jpeg': '2017 年 Garmin 全馬 PB 班最後一次團練',
    '03.jpeg': '2018 年跑步教練聚會',
    '04.jpeg': '2019 年第一屆 RQ project 市民菁英培訓營',
    '05.jpeg': '2020 年 STRYD 跑步功率課程',
    '06.png': '2021 年徐國峰跑者專項線上力量課程',
    '07.png': '2022 年徐國峰 5K 飆速線上訓練營',
  },
  1297: {
    '05.jpg': '感謝 All Sports 送的照片',
  },
};
const extraHidden = (() => {
  const f = path.join(src, 'hidden.json');
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {};
})();

const removedNote =
  '<p class="photo-removed">（這裡原本有一張桐桐露臉的照片，為了保護她的隱私，搬家時先拿掉了。）</p>';
const lostNote = '<p class="photo-removed">（這張圖在原站就已經失效，找不回來了。）</p>';

// 備份時就下載失敗的圖（原站本身已經 404），換成說明，保留圖說
const failedUrls = (() => {
  const f = path.join(src, 'index.json');
  if (!existsSync(f)) return new Set();
  const index = JSON.parse(readFileSync(f, 'utf8'));
  return new Set(index.flatMap((p) => (p.failedImages ?? []).map((x) => (typeof x === 'string' ? x : x.sourceUrl))));
})();

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

const files = readdirSync(src).filter(
  (f) => /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(f) && !(skip[source] ?? []).some((s) => f.includes(s)),
);
for (const file of files) {
  const md = readFileSync(path.join(src, file), 'utf8').replace(/^﻿/, '');
  const [, front, raw] = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const added = addedPhoto[`${source}/${file}`];
  const body0 = added ? `\n![${added.alt}](./images/${file.slice(11, -3)}/01.jpg)\n${raw}` : raw;
  // 圖片資料夾代號：./images/<key>/...
  const key = body0.match(/\.\/images\/([^/]+)\//)?.[1] ?? front.match(/\.\/images\/([^/]+)\//)?.[1];
  const hide = new Set([...(hidden[key] ?? []), ...(extraHidden[key] ?? [])]);
  let body = body0;

  // 內文標題往下一階：# → ##（只在內文最高層級是 # 時）
  if (/^# /m.test(body)) body = body.replace(/^(#{1,5}) /gm, '#$1 ');

  // 拿掉有桐桐正臉的照片（連同緊接在下一行的斜體圖說）
  body = body.replace(/!\[[^\]]*\]\(\.\/images\/[^/]+\/([^)\s]+)\)(\s*\n\*[^\n]*\*)?/g, (all, name, caption) => {
    if (hide.has(name)) return removedNote;
    const extra = captions[key]?.[name];
    return extra && !caption ? `![${extra}](./images/${key}/${name})\n\n*${extra}*` : all;
  });

  body = body.replace(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g, (all, url) => (failedUrls.has(url) ? lostNote : all));

  let fm = front;
  if (failedUrls.has(fm.match(/^cover:\s*"?([^"\n]+)"?/m)?.[1])) fm = fm.replace(/^cover:.*\n?/m, '');
  // 做的封面放進這篇的圖片資料夾；沒有圖的文章用檔名裡的代號當資料夾
  const made = madeCover[`${source}/${file}`];
  const madeDir = (made || added) && (key ?? file.slice(11, -3));
  const coverName = fm.match(/cover:\s*"\.\/images\/[^/]+\/([^"]+)"/)?.[1];
  if (made || added) {
    const line = `cover: "./images/${madeDir}/cover.jpg"`;
    fm = /^cover:/m.test(fm) ? fm.replace(/^cover:[^\r\n]*/m, line) : `${fm}\n${line}`;
  } else if (coverName && hide.has(coverName)) {
    fm = coverFallback[key]
      ? fm.replace(/cover:\s*".*"/, `cover: "./images/${key}/${coverFallback[key]}"`)
      : fm.replace(/^cover:.*\n?/m, '');
  }
  // 原文網址統一放 originalUrl，方便里程碑把外部連結換成站內文章
  const original = fm.match(/^(?:legacyUrl|mediumUrl|bloggerUrl|bijiUrl|originalUrl):\s*"?([^"\n]+)"?/m)?.[1];
  if (original && !/^originalUrl:/m.test(fm)) fm += `\noriginalUrl: "${original}"`;
  if (!/^origin:/m.test(fm)) fm += `\norigin: "${origins[source] ?? source}"`;
  const others = alsoAt[`${source}/${file}`];
  if (others) fm += `\nalsoAt:\n${others.map((u) => `  - "${u}"`).join('\n')}`;

  writeFileSync(path.join(dest, file), `---\n${fm}\n---\n${body}`, 'utf8');

  const imgDir = key && path.join(src, 'images', key);
  if (imgDir && existsSync(imgDir)) {
    const out = path.join(dest, 'images', key);
    mkdirSync(out, { recursive: true });
    for (const img of readdirSync(imgDir)) {
      if (hide.has(img)) continue;
      // 舊圖有些檔頭不標準（Astro 讀不到尺寸），統一重新存一次，順便把寬度壓到 1400 以內、PNG 減色
      const input = path.join(imgDir, img);
      const pipeline = sharp(input, { animated: /\.gif$/i.test(img) })
        .rotate()
        .resize({ width: 1400, withoutEnlargement: true });
      if (/\.png$/i.test(img)) await pipeline.png({ compressionLevel: 9, palette: true, quality: 85, effort: 10 }).toFile(path.join(out, img));
      else if (/\.jpe?g$/i.test(img)) await pipeline.jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(out, img));
      else if (/\.webp$/i.test(img)) await pipeline.webp({ quality: 85 }).toFile(path.join(out, img));
      else copyFileSync(input, path.join(out, img));
    }
  }
  if (made) {
    const [title, tag] = made;
    const out = path.join(dest, 'images', madeDir, 'cover.jpg');
    mkdirSync(path.dirname(out), { recursive: true });
    execFileSync(process.execPath, ['scripts/og/cover.mjs', out, title, tag, file.slice(0, 10).replaceAll('-', '.')], { stdio: 'ignore' });
  }
  if (added) {
    const input = path.join(src, 'images', madeDir, '01.jpg');
    const { width, height } = await sharp(input).rotate().metadata();
    const h = Math.round((width * 10) / 16);
    await sharp(input)
      .rotate()
      .extract({ left: 0, top: Math.min(Math.round(height * added.top), height - h), width, height: h })
      .resize({ width: 1400 })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(dest, 'images', madeDir, 'cover.jpg'));
  }
  console.log(file, hide.size ? `（拿掉 ${hide.size} 張）` : '');
}
