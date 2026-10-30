import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 投稿: src/content/posts/{id}/index.{lang}.md
// 日本語ファイル（原文）にすべての情報を書く。他の言語のファイルは title（訳）と本文だけ。
const posts = defineCollection({
  loader: glob({
    pattern: '*/index.*.md',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.replace(/\/index\.(\w+)\.md$/, '/$1'), // "creperie/ja"
  }),
  schema: z.object({
    title: z.string(),
    route: z.string().optional(), // 移動シリーズの行き先（例 "Nice → Cannes"）
    date: z.string().optional(), // "2026-10-27 16:20"
    place: z.string().optional(),
    kind: z.enum(['video', 'photos']).optional(),
    loop: z.string().optional(), // 10秒ループの名前（{loop}_av1.mp4 / _hevc.mp4）
    post: z.string().optional(), // 本編の名前（{post}_av1.mp4 / _hevc.mp4）
    still: z.string().optional(), // 静止画ファイル名
    images: z.array(z.string()).optional(),
    len: z.string().optional(),
    moving: z.boolean().optional(), // 移動・POV（サムネは静止画）
    draft: z.boolean().optional(), // 仮の本文（薄く表示）
    hidden: z.boolean().optional(), // 非公開（一覧・ページ・RSS・サイトマップに出さない）
  }),
});

export const collections = { posts };
