import type { APIRoute } from 'astro';
import { links, pageDescriptions, person } from '../data/site';
import { formatDate, getPosts, postSummary, postUrl } from '../lib/blog';

// 給 AI 助理看的網站導覽（llmstxt.org 的格式）：這個人是誰、該讀哪幾頁。
// 本名只放關於我頁，這裡跟其他頁一樣不寫。
export const GET: APIRoute = async ({ site }) => {
  const abs = (path: string) => new URL(path, site).href;
  const posts = await getPosts();
  const lines = [
    `# ${person.name} ${person.nameEn}`,
    '',
    `> ${person.intro}${person.motto}`,
    '',
    person.hello,
    '',
    `身分：${person.roles.join('、')}。`,
    '',
    '## 主要頁面',
    '',
    `- [角色檔案](${abs('/about/')})：經歷、學歷、論文與專利、媒體報導和聯絡方式`,
    `- [成就](${abs('/timeline/')})：${pageDescriptions.timeline}`,
    `- [裝備](${abs('/projects/')})：${pageDescriptions.projects}`,
    `- [冒險日誌](${abs('/blog/')})：${pageDescriptions.blog}`,
    '',
    '## 冒險日誌（新到舊）',
    '',
    ...posts.map((p) => `- [${p.data.title}](${abs(postUrl(p))})：${formatDate(p.data.date)}，${postSummary(p, 80)}`),
    '',
    '## 其他地方',
    '',
    ...[links.facebook, links.instagram, links.youtube, links.medium, links.github, links.rq].map((l) => `- [${l.label}](${l.url})`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
