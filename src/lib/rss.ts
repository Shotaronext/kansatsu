import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { UI, getPosts, postTitle, postUrl, prefix, excerpt, type Lang } from './i18n';

// /rss.xml（日本語）と /{lang}/rss.xml
export async function feed(lang: Lang, context: APIContext) {
  const posts = await getPosts(lang);
  return rss({
    title: 'SHOTARONEXT',
    description: UI.desc[lang],
    site: new URL(prefix(lang), context.site).href,
    items: posts.map((p) => ({
      title: postTitle(p, lang),
      link: postUrl(lang, p.id),
      pubDate: p.ja.data.date ? new Date(p.ja.data.date.replace(' ', 'T') + ':00+02:00') : undefined,
      description: excerpt(p.tr.body, lang),
    })),
    customData: `<language>${lang}</language>`,
  });
}
