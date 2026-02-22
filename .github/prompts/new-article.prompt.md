# 新規Zenn記事作成プロンプト

新しいZenn記事を作成します。以下のワークフローに従ってください：

## 作業手順

### 1. ブランチ作成
```bash
git checkout -b article/[記事のトピック]
```

### 2. 記事ファイル作成
```bash
npx zenn new:article --slug [記事スラッグ] --title "[記事タイトル]" --type tech --emoji 🎯
```

### 3. 画像ディレクトリ作成
```bash
mkdir -p images/[記事スラッグ]
```

### 4. メタデータ設定

記事冒頭のフロントマターを設定：

```yaml
---
title: "記事タイトル"
emoji: "🎯"  # 記事のテーマに合わせた絵文字
type: "tech"  # または "idea"
topics: ["topic1", "topic2", "topic3"]  # 5個まで
published: false  # 公開準備ができたらtrue
---
```

### 5. 記事執筆開始

## よく使うZenn記法

### コードブロック
\`\`\`言語名:ファイル名
コード
\`\`\`

### メッセージ
:::message
重要な情報
:::

:::message alert
警告
:::

### アコーディオン
:::details タイトル
内容
:::

### 画像
![画像の説明](/images/[スラッグ]/image.png)

## 執筆完了後

1. Lintチェック: `npm run lint:md`
2. プレビュー確認: `npm run preview`
3. コミット & PR作成
