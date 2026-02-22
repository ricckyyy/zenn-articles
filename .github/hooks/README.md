# Git Hooks設定ガイド

このディレクトリには、Zenn記事の品質を保つためのGit Hooksが含まれています。

## 利用可能なHooks

### pre-commit

コミット前に自動でMarkdownlintチェックを実行します。

**動作**:
1. `articles/` ディレクトリの `.md` ファイルに変更がある場合のみ実行
2. `npm run lint:md` でチェック
3. エラーがある場合はコミットを中断
4. 自動修正の方法を提示

## セットアップ方法

### 1. Hookを有効化

```bash
# Hookスクリプトに実行権限を付与
chmod +x .github/hooks/pre-commit

# Gitのhooksディレクトリを変更
git config core.hooksPath .github/hooks
```

### 2. 動作確認

```bash
# テスト用に記事を編集
echo "test" >> articles/test.md

# コミット試行（lintエラーがあれば中断される）
git add articles/test.md
git commit -m "test"
```

## Hookを一時的に無効化

緊急時など、Hookをスキップしたい場合：

```bash
git commit --no-verify
```

:::message alert
`--no-verify` の使用は非推奨です。Lintエラーがあると公開時に問題が発生する可能性があります。
:::

## Hookの無効化

Hookを完全に無効化したい場合：

```bash
git config --unset core.hooksPath
```

## トラブルシューティング

### Hookが実行されない

```bash
# Hookパスの確認
git config core.hooksPath

# 実行権限の確認
ls -la .github/hooks/pre-commit

# 実行権限がない場合
chmod +x .github/hooks/pre-commit
```

### Lintエラーの修正方法

```bash
# 自動修正を試す
npm run lint:md:fix

# エラー内容を確認
npm run lint:md

# 手動で修正が必要な場合は、エラーメッセージに従って修正
```

## GitHub Actions との併用

Pre-commit hookはローカル環境での品質チェックです。
CI/CDパイプラインにも同様のチェックを追加することを推奨します。

```yaml
# .github/workflows/lint.yml の例
name: Lint Check

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint:md
```
