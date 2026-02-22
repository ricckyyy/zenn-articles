---
name: new-article
description: 新しいZenn記事を作成する。ブランチ作成・ファイル生成・画像ディレクトリ作成を行う。「新規記事」「記事を作りたい」などの依頼で使用。
disable-model-invocation: true
---

新しいZenn記事を作成します。以下のワークフローに従ってください。

## 作業手順

### 1. 記事の情報をユーザーに確認

まだ聞いていなければ以下を確認：
- 記事のテーマ・タイトル
- スラッグ（英数字・ハイフン）
- トピック（最大5個）
- 絵文字

### 2. ブランチ作成

```bash
git checkout -b article/[記事のトピック]
```

### 3. 記事ファイル作成

```bash
npx zenn new:article --slug [記事スラッグ] --title "[記事タイトル]" --type tech --emoji 🎯
```

### 4. 画像ディレクトリ作成

```bash
mkdir -p images/[記事スラッグ]
```

### 5. フロントマターを更新

```yaml
---
title: "記事タイトル"
emoji: "🎯"
type: "tech"
topics: ["topic1", "topic2"]
published: false
---
```

### 6. 記事の初期構成を作成

以下のセクションで記事の骨格を作る：

```markdown
## はじめに

## （本文セクション）

## まとめ

## 参考リンク
```

### 7. 完了後の案内

- Lintチェック: `npm run lint:md`
- プレビュー: `npm run preview`
