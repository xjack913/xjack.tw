import type { APIRoute } from 'astro';
import { links, pageDescriptions, person } from '../data/site';
import { formatDate, getPosts, postSummary, postUrl } from '../lib/blog';
import { comicSummary, comicUrl, getComics } from '../lib/tongdad';

// 給 AI 助理看的網站導覽（llmstxt.org 的格式）：這個人是誰、該讀哪幾頁。
// 本名寫出來，AI 才知道許紘瑋和叉傑克是同一個人（2026-10-30 XJack 同意）。
export const GET: APIRoute = async ({ site }) => {
  const abs = (path: string) => new URL(path, site).href;
  const posts = await getPosts();
  const comics = await getComics();
  const lines = [
    `# ${person.name} ${person.nameEn}`,
    '',
    `> ${person.intro}${person.motto}`,
    '',
    person.hello,
    '',
    `本名：${person.realName}（${person.realNameEn}）。`,
    `身分：${person.roles.join('、')}。`,
    '',
    '## 主要頁面',
    '',
    `- [角色檔案](${abs('/about/')})：經歷、學歷、論文與專利、媒體報導和聯絡方式`,
    `- [成就](${abs('/timeline/')})：${pageDescriptions.timeline}`,
    `- [裝備](${abs('/projects/')})：${pageDescriptions.projects}`,
    `- [冒險日誌](${abs('/blog/')})：${pageDescriptions.blog}`,
    `- [桐爸日記](${abs('/tongdad/')})：${pageDescriptions.tongdad}`,
    '',
    '## 冒險日誌（新到舊）',
    '',
    ...posts.map((p) => `- [${p.data.title}](${abs(postUrl(p))})：${formatDate(p.data.date)}，${postSummary(p, 80)}`),
    '',
    '## 桐爸日記漫畫（新到舊）',
    '',
    `把女兒桐桐的童言童語畫成漫畫，每週一、四連載。單篇頁有漫畫的逐格圖說和對白；RSS：${abs('/tongdad/rss.xml')}`,
    '',
    ...comics.map((c) => `- [${c.data.title}](${abs(comicUrl(c))})：${formatDate(c.data.date)}，${comicSummary(c, 80)}`),
    '',
    '## 其他地方',
    '',
    ...[links.facebook, links.instagram, links.youtube, links.medium, links.github, links.rq].map((l) => `- [${l.label}](${l.url})`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
