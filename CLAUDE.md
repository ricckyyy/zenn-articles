# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## コマンド

```bash
npm run lint:md        # Markdownlintチェック（articles/**/*.md が対象）
npm run lint:md:fix    # 自動修正
npm run preview        # Zennプレビュー起動（localhost:8000）
npx zenn new:article   # 新規記事作成（frontmatter付きファイルを自動生成）
```

コミット前は必ず `npm run lint:md` を実行する。

## ブランチ運用

Feature Branch Workflow を採用。mainへの直接コミットは避ける。

| プレフィックス | 用途 |
| -------------- | ---- |
| `article/` | 新規記事執筆 |
| `update/` | 既存記事の更新 |
| `draft/` | 下書き段階 |
| `fix/` | 誤字脱字の修正 |

## Zenn記事の構造

- `articles/[slug].md` — 記事本体。frontmatterに `title`, `emoji`, `type`, `topics`, `published` が必要
- `images/[slug]/` — 記事の画像置き場。画像パスは `/images/[slug]/xxx.png` の絶対パス形式のみ有効

## Markdownlintカスタムルール

`.markdownlint-cli2.jsonc` で設定。無効化しているルール：MD024, MD033, MD036, MD041。

カスタムルール `.markdownlint/rules/image-path-rule.js` が以下を禁止：

- `../images/` の相対パス → `/images/` に変換する
- `images/` で始まるパス（先頭の `/` なし）→ `/images/` に変換する

テーブルなど長い行が必要な場合は
`<!-- markdownlint-disable MD013 -->` / `<!-- markdownlint-enable MD013 -->` で囲む。

## Skills（呼び出し可能なコマンド）

| スキル | 説明 |
| ------ | ---- |
| `/new-article` | 新規記事の作成ワークフロー（ブランチ作成〜ファイル生成） |
| `/article-review` | 記事のレビュー（チェックリストに沿って実行） |
| `/zenn-article-lint` | Markdownlintチェックと自動修正 |

Skillファイルの配置：`.claude/skills/`（Claude Code専用）、`.github/skills/`（Copilotと共用）。

## Git Hooks

`.github/hooks/pre-commit` にpre-commit hookがある。
セットアップは `.github/hooks/README.md` を参照。コミット時にMarkdownlintが自動実行される。
