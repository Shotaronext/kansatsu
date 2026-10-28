import { getCollection, type CollectionEntry } from 'astro:content';

export const LANGS = ['ja', 'en', 'es', 'fr'] as const;
export type Lang = (typeof LANGS)[number];
export const OTHER_LANGS = LANGS.filter((l) => l !== 'ja');
export const LANG_NAMES: Record<Lang, string> = { ja: '日本語', en: 'English', es: 'Español', fr: 'Français' };

export const UI = {
  back: { ja: '← 戻る', en: '← Back', es: '← Volver', fr: '← Retour' },
  son: { ja: '音を出す', en: 'Sound on', es: 'Activar sonido', fr: 'Activer le son' },
  soff: { ja: '音を消す', en: 'Sound off', es: 'Silenciar', fr: 'Couper le son' },
  film: { ja: '映像', en: 'Film', es: 'Vídeo', fr: 'Film' },
  list: { ja: '投稿一覧', en: 'Posts', es: 'Entradas', fr: 'Billets' },
  desc: {
    ja: '目線の高さでの定点観測を、外へ向かう瞑想として。',
    en: 'Fixed-point observation at eye level, as a meditation that turns outward.',
    es: 'Observación desde un punto fijo, a la altura de los ojos, como una meditación hacia fuera.',
    fr: 'Observer depuis un point fixe, à hauteur des yeux, comme une méditation tournée vers l’extérieur.',
  },
} satisfies Record<string, Record<Lang, string>>;

// URL: 日本語はルート、他は /{lang}/
export const prefix = (lang: Lang) => (lang === 'ja' ? '/' : `/${lang}/`);
export const indexUrl = (lang: Lang) => prefix(lang);
export const postUrl = (lang: Lang, id: string) => `${prefix(lang)}posts/${id}/`;
export const aboutUrl = (lang: Lang) => `${prefix(lang)}about/`;

export type Post = {
  id: string;
  ja: CollectionEntry<'posts'>; // 原文（すべての情報）
  tr: CollectionEntry<'posts'>; // 表示する言語の版（無ければ原文）
};

// 投稿を新しい順に。情報は日本語版から、タイトルと本文はその言語の版から
export async function getPosts(lang: Lang): Promise<Post[]> {
  const all = await getCollection('posts');
  const byId = new Map(all.map((e) => [e.id, e]));
  return all
    .filter((e) => e.id.endsWith('/ja'))
    .map((ja) => {
      const id = ja.id.split('/')[0];
      return { id, ja, tr: byId.get(`${id}/${lang}`) ?? ja };
    })
    .sort((a, b) => (b.ja.data.date ?? '').localeCompare(a.ja.data.date ?? ''));
}

// 投稿ページの見出し。日本語以外では、ルートのある回は「車窓 — Nice → Cannes」
export function postTitle(p: Post, lang: Lang) {
  const d = p.ja.data;
  if (lang === 'ja') return d.title;
  return d.route ? `${d.title} — ${d.route}` : p.tr.data.title;
}

// 縦書きキャプションの下段：ルートか翻訳（日本語ページでは英訳）
export async function captionSub(p: Post, lang: Lang) {
  if (p.ja.data.route) return p.ja.data.route;
  if (lang !== 'ja') return p.tr.data.title;
  const en = (await getCollection('posts')).find((e) => e.id === `${p.id}/en`);
  return en?.data.title ?? '';
}

export const stillOf = (p: Post) => p.ja.data.still ?? p.ja.data.images?.[0] ?? '';
export const displayDate = (s?: string) => (s ?? '').replace(/-/g, '/');

// og:description 用。本文の冒頭（マーカーや改行を除く）
export function excerpt(body: string | undefined, lang: Lang, n = lang === 'ja' ? 80 : 150) {
  const t = (body ?? '')
    .replace(/^(［仮の本文］|\[(Draft|Borrador|Brouillon)\])\s*/, '')
    .replace(/\s*\n\s*/g, lang === 'ja' ? '' : ' ') // 日本語は改行を詰める
    .replace(/\s+/g, ' ')
    .trim();
  return t.length > n ? t.slice(0, n) + '…' : t;
}
