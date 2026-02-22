# Zenn CLI クイックレシピ

よく使うZenn CLIコマンドのコピペ用リファレンスです。

## 📝 記事作成

### 新規記事を作成

```bash
npx zenn new:article
```

### スラッグとタイトルを指定して作成

```bash
npx zenn new:article --slug my-awesome-article --title "素晴らしい記事"
```

### tech記事として作成

```bash
npx zenn new:article --type tech --emoji 💻
```

### idea記事として作成

```bash
npx zenn new:article --type idea --emoji 💡
```

---

## 📚 本（Book）作成

### 新規の本を作成

```bash
npx zenn new:book
```

### スラッグを指定して作成

```bash
npx zenn new:book --slug my-book --title "私の本"
```

---

## 👀 プレビュー

### ローカルプレビューサーバー起動

```bash
npx zenn preview
```

デフォルトで `http://localhost:8000` で起動

### ポート指定

```bash
npx zenn preview --port 3000
```

### 公開記事のみ表示

```bash
npx zenn preview --published
```

---

## 🔍 Lintチェック

### 全記事をチェック

```bash
npm run lint:md
```

### 自動修正

```bash
npm run lint:md:fix
```

### 特定のファイルのみチェック

```bash
npx markdownlint-cli2 "articles/specific-article.md"
```

---

## 🌿 ブランチワークフロー

### 新規記事用ブランチ作成

```bash
git checkout -b article/記事のトピック
```

### 更新用ブランチ作成

```bash
git checkout -b update/記事スラッグ
```

### 下書き用ブランチ作成

```bash
git checkout -b draft/記事スラッグ
```

---

## 📁 ディレクトリ構成

### 記事用画像ディレクトリ作成

```bash
mkdir -p images/記事スラッグ
```

### 構成確認

```bash
tree -L 2
```

期待される構成：
```
.
├── articles/
│   └── my-article.md
├── books/
├── images/
│   └── my-article/
│       └── screenshot.png
└── package.json
```

---

## 🚀 公開フロー

### 1. 記事を執筆

```bash
# ブランチ作成
git checkout -b article/new-topic

# 記事作成
npx zenn new:article --slug new-topic

# 画像ディレクトリ作成
mkdir -p images/new-topic
```

### 2. プレビュー確認

```bash
npm run preview
```

### 3. Lint チェック

```bash
npm run lint:md:fix
npm run lint:md
```

### 4. 公開設定

`articles/new-topic.md` のフロントマターを編集：

```yaml
published: true
```

### 5. コミット & プッシュ

```bash
git add .
git commit -m "記事追加: 新しいトピック"
git push origin article/new-topic
```

### 6. マージ

```bash
# PRを作成してレビュー、またはローカルでマージ
git checkout main
git merge article/new-topic
git push origin main

# ブランチ削除
git branch -d article/new-topic
```

---

## 🛠️ トラブルシューティング

### Zenn CLIをアップデート

```bash
npm install zenn-cli@latest
```

### キャッシュクリア

```bash
rm -rf node_modules package-lock.json
npm install
```

### プレビューサーバーが起動しない

```bash
# ポートを変更
npx zenn preview --port 8080

# プロセスを確認して強制終了
lsof -i :8000
kill -9 <PID>
```

---

## 📖 参考リンク

- [Zenn CLI Guide](https://zenn.dev/zenn/articles/zenn-cli-guide)
- [Zenn Markdown記法](https://zenn.dev/zenn/articles/markdown-guide)
