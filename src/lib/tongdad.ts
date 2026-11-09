import { getCollection, type CollectionEntry } from 'astro:content';

export type Comic = CollectionEntry<'tongdad'>;

export const comicUrl = (comic: Comic) => `/tongdad/${comic.id}/`;

/** 結構化資料裡「桐爸日記」這個連載的固定 @id：列表頁定義，每一話的 isPartOf 指回來 */
export const seriesId = (site: URL | undefined) => new URL('/tongdad/#series', site).href;

/** 新的在前；同一天照網址排，第二張（-2）在第一張前面 */
export async function getComics() {
  const comics = await getCollection('tongdad');
  return comics.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || b.id.localeCompare(a.id));
}

/** 連續閱讀用：舊的在前，最早的一篇是第 1 話。之後補收更早的漫畫，後面的話數會跟著往後移 */
export async function getEpisodes() {
  return (await getComics()).reverse().map((comic, i) => ({ comic, no: i + 1 }));
}

/** 連續閱讀頁裡某一話的位置 */
export const readUrl = (comic: Comic) => `/tongdad/read/#${comic.id}`;

/** 貼文文字切段：空行分段，段內的換行保留 */
export const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.split('\n').map((l) => l.trim()).filter(Boolean))
    .filter((p) => p.length);

/** 搜尋描述、RSS、llms.txt 用的摘要：貼文開頭 max 字，沒有文字就用標題 */
export function comicSummary(comic: Comic, max = 120) {
  const flat = paragraphs(comic.data.text).flat().join(' ');
  if (!flat) return `桐爸日記漫畫〈${comic.data.title}〉`;
  return [...flat].length > max ? `${[...flat].slice(0, max - 1).join('')}…` : flat;
}

export const monthLabel =(d: Date) => `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`;
