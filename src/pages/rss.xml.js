import rss from '@astrojs/rss';
import { getPosts, postUrl } from '../lib/blog';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: '叉傑克 XJack 的文章',
    description: '跑步數據、科學化訓練、創業與育兒。',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: postUrl(post),
    })),
    customData: '<language>zh-TW</language>',
  });
}
