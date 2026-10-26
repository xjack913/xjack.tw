import type { APIRoute } from 'astro';

// 正式網域開放收錄；驗收用的子網域整站擋掉
export const GET: APIRoute = ({ site }) => {
  const body =
    site?.hostname === 'xjack.tw'
      ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`
      : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
