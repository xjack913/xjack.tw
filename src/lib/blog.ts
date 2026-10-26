import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

export const postSlug = (post: Post) => post.data.slug ?? String(post.data.legacyId ?? post.id);

export const postUrl = (post: Post) => `/blog/${postSlug(post)}/`;

export async function getPosts() {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
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

export const formatDate = (d: Date) =>
  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
