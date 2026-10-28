import type { APIContext } from 'astro';
import { OTHER_LANGS, type Lang } from '../../lib/i18n';
import { feed } from '../../lib/rss';

export const getStaticPaths = () => OTHER_LANGS.map((lang) => ({ params: { lang } }));
export const GET = (context: APIContext) => feed(context.params.lang as Lang, context);
