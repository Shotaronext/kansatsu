# 観察 / KANSATSU

Astro で作る静的サイト。`npm run dev` で http://localhost:4321/ に表示、`npm run build` で `dist/` に書き出す。

## URL
| ページ | 日本語 | 他の言語 |
|---|---|---|
| トップ | `/` | `/en/` `/es/` `/fr/` |
| 投稿 | `/posts/{id}/` | `/en/posts/{id}/` |
| RSS | `/rss.xml` | `/en/rss.xml` |

## 投稿を書く
`src/content/posts/{id}/` に4つのファイルを置く。

- `index.ja.md`（原文）：front-matter にすべての情報を書く
  ```yaml
  title: "車窓"
  route: "Nice → Cannes"     # 移動シリーズだけ
  date: "2026-10-27 16:20"   # 並び順にも使う
  place: "Nice → Cannes"
  kind: video                # video | photos
  loop: "train2_loop"        # public/img/{loop}_av1.mp4 / _hevc.mp4（固定カメラのサムネ）
  post: "train2_post"        # 本編（音あり）
  still: "train2_poster.avif"
  images: ["a.webp", "b.webp"]  # 写真の回
  len: "3:04"
  moving: true               # 移動・POV（サムネを静止画にする）
  draft: true                # 仮の本文（薄く表示）
  ```
- `index.en.md` / `index.es.md` / `index.fr.md`：`title`（訳）と本文だけ

本文は段落を空行で区切る。段落内の改行はそのまま改行として表示される。

## OGP 画像
`bash scripts/make_og.sh --all` で `public/og/{id}.jpg`（1200×630）を作り直す。
