import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

export const postSlug = (post: Post) => post.data.slug ?? String(post.data.legacyId ?? post.id);

export const postUrl = (post: Post) => `/blog/${postSlug(post)}/`;

export async function getPosts() {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

// ── 主題頁：文章數夠多的標籤才開一頁，太少的頁面對讀者和搜尋都沒用 ──
const TOPIC_MIN_POSTS = 4;

export const tagSlug = (tag: string) => tag.trim().replace(/\s+/g, '-');

export const tagUrl = (tag: string) => `/blog/tag/${tagSlug(tag)}/`;

/** 有主題頁的標籤，文章多的排前面 */
export function topicTags(posts: Post[]) {
  const map = new Map<string, Post[]>();
  for (const post of posts) {
    for (const tag of post.data.tags) map.set(tag, [...(map.get(tag) ?? []), post]);
  }
  return [...map]
    .filter(([, list]) => list.length >= TOPIC_MIN_POSTS)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([tag, list]) => ({ tag, posts: list }));
}

/** 相關文章：共同標籤越多越前面，一樣多就挑日期近的 */
export function relatedPosts(post: Post, posts: Post[], count = 3) {
  const tags = new Set(post.data.tags);
  const gap = (p: Post) => Math.abs(p.data.date.valueOf() - post.data.date.valueOf());
  return posts
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, shared: p.data.tags.filter((t) => tags.has(t)).length }))
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.shared - a.shared || gap(a.p) - gap(b.p))
    .slice(0, count)
    .map((x) => x.p);
}

const normalize = (url: string) => {
  try {
    const u = new URL(url);
    // 運動筆記的文章網址靠 ?id= 區分，所以查詢字串要留著
    return `${u.hostname.replace(/^www\./, '')}${decodeURI(u.pathname).replace(/\/$/, '')}${u.search}`;
  } catch {
    return url;
  }
};

/** 外部原文網址 → 站內文章網址，讓里程碑優先連到搬過來的版本 */
export async function legacyLinkMap() {
  const map = new Map<string, string>();
  for (const post of await getPosts()) {
    for (const url of [post.data.originalUrl, ...post.data.alsoAt]) {
      if (url) map.set(normalize(url), postUrl(post));
    }
  }
  return (url?: string) => (url ? (map.get(normalize(url)) ?? url) : url);
}

/**
 * 搜尋結果和 RSS 用的摘要。舊文章的 excerpt 常常只有一句（中位數 43 字），
 * 太短時從內文裡 excerpt 那句接著往下取，只用原文的字、不改寫，最多 120 字。
 */
export function postSummary(post: Post, max = 120) {
  const excerpt = post.data.excerpt ?? '';
  if ([...excerpt].length >= 70) return excerpt;
  const text = (post.body ?? '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
    .replace(/(\*\*|__|~~|`)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  // 從 excerpt 那句開始接，跳過開頭的影片連結、圖說這類不是正文的字
  const from = excerpt ? text.indexOf(excerpt.replace(/\s+/g, ' ').trim().slice(0, 12)) : -1;
  const chars = [...(from > 0 ? text.slice(from) : text)];
  if (chars.length <= max) return chars.join('') || excerpt;
  const head = chars.slice(0, max).join('');
  // 盡量停在句尾；第 60 字之後都沒有句尾才硬切
  const end = Math.max(...['。', '！', '？', '!', '?', '～', '~'].map((p) => head.lastIndexOf(p)));
  return end >= 60 ? head.slice(0, end + 1) : `${chars.slice(0, max - 1).join('')}…`;
}

export const formatDate = (d: Date) =>
  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
