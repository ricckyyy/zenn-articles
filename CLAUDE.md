# Claude Code Instructions

## ブランチ運用ルール

このリポジトリはFeature Branch Workflow（機能ブランチワークフロー）を採用しています。

### ブランチ命名規則

- `article/[記事タイトル要約]` - 新規記事執筆
- `update/[記事名]` - 既存記事の更新
- `draft/[記事名]` - 下書き段階
- `fix/[修正内容]` - 誤字脱字の修正

### ワークフロー

1. 作業開始時は必ず適切な名前のブランチを作成
2. ブランチ上で記事を執筆・編集
3. コミット前に `npm run lint:md` でLintチェック
4. `npm run preview` でプレビュー確認
5. Pull Requestを作成してレビュー
6. 問題なければmainブランチにマージ

### 注意事項

- mainブランチへの直接コミットは避ける
- 複数記事を並行作業する場合は、それぞれ別のブランチで管理
- マージ後は作業ブランチを削除

## Zenn記事のルール

- 記事ファイルは `articles/` ディレクトリに配置
- 画像は `images/[記事スラッグ]/` ディレクトリに配置
- Markdownlintのルールに従う（`.markdownlint-cli2.jsonc` 参照）

## よく使うコマンド

```bash
npm run lint:md        # Markdownlintチェック
npm run lint:md:fix    # 自動修正
npm run preview        # プレビュー起動
npx zenn new:article   # 新規記事作成
```

## 利用可能なSkills

- `/new-article` - 新規記事の作成ワークフロー
- `/article-review` - 記事のレビュー
- `/zenn-article-lint` - Markdownlintチェックと自動修正（`.github/skills/` に配置）
