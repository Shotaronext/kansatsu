import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 独自ドメインが決まったら site を差し替える
export default defineConfig({
  site: 'https://friendly-daffodil-06efc0.netlify.app',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'ja', locales: { ja: 'ja', en: 'en', es: 'es', fr: 'fr' } },
    }),
  ],
});
