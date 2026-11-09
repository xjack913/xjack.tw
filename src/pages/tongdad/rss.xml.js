import rss from '@astrojs/rss';
import { getImage } from 'astro:assets';
import { pageDescriptions } from '../../data/site';
import { comicSummary, comicUrl, getComics, paragraphs } from '../../lib/tongdad';

// 桐爸日記漫畫自己的 RSS：主 RSS（/rss.xml）只有冒險日誌，每週兩話的漫畫另外出一份，
// 訂閱器和會讀 RSS 的 AI 工具才抓得到新的一話。內容放漫畫圖（附逐格圖說）和貼文文字。
const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET(context) {
  const comics = await getComics();
  const items = await Promise.all(
    comics.map(async (comic) => {
      const { title, date, image, alt, text } = comic.data;
      const img = await getImage({ src: image, width: Math.min(1080, image.width), format: 'jpg' });
      const body = paragraphs(text)
        .map((p) => `<p>${p.map(escape).join('<br>')}</p>`)
        .join('');
      return {
        title,
        pubDate: date,
        description: comicSummary(comic),
        link: comicUrl(comic),
        content: `<p><img src="${new URL(img.src, context.site).href}" alt="${escape(alt)}"></p>${body}`,
      };
    }),
  );
  return rss({
    title: '桐爸日記｜叉傑克 XJack',
    description: pageDescriptions.tongdad,
    site: context.site,
    items,
    customData: '<language>zh-TW</language>',
  });
}
