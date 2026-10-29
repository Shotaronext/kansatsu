import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://shotaronext.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'ja', locales: { ja: 'ja', en: 'en', es: 'es', fr: 'fr' } },
    }),
  ],
});
