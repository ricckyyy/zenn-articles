# Zenn Markdown記法スニペット集

よく使うZenn独自のMarkdown記法のコピペ用サンプルです。

## 💬 メッセージ

### 通常メッセージ

```markdown
:::message
ここに伝えたいことを書く
:::
```

### 警告メッセージ

```markdown
:::message alert
注意が必要な内容
:::
```

---

## 📦 アコーディオン（折りたたみ）

### 基本

```markdown
:::details タイトル
折りたたまれている内容
:::
```

### 長い補足説明に使う例

```markdown
:::details 詳細な設定手順はこちら

1. 設定ファイルを開く
2. 以下を追加
   \`\`\`json
   {
     "setting": "value"
   }
   \`\`\`
3. 保存して再起動

:::
```

---

## 🖼️ 画像

### 基本

```markdown
![alt text](/images/記事スラッグ/image.png)
```

### 画像にキャプション

```markdown
![](/images/記事スラッグ/screenshot.png)
*図1: スクリーンショットの説明*
```

### 画像サイズ指定

```markdown
![](/images/記事スラッグ/logo.png =250x)
```

幅のみ指定:
```markdown
![](/images/記事スラッグ/banner.png =500x)
```

高さのみ指定:
```markdown
![](/images/記事スラッグ/icon.png =x100)
```

---

## 💻 コードブロック

### ファイル名付き

````markdown
```javascript:app.js
console.log('Hello, Zenn!');
```
````

### 差分表示

````markdown
```diff javascript
- console.log('old');
+ console.log('new');
```
````

### 行番号なし

行番号を非表示にする場合は、ファイル名の前に`:` を付けない：

````markdown
```javascript
console.log('No line numbers');
```
````

---

## 🔗 リンクカード

### 外部リンク

```markdown
https://zenn.dev
```

URLだけで自動的にカードになります。

### Zenn内の記事

```markdown
https://zenn.dev/username/articles/article-slug
```

---

## 📊 テーブル（表）

### 基本

```markdown
| ヘッダー1 | ヘッダー2 | ヘッダー3 |
| -------- | -------- | -------- |
| データ1  | データ2  | データ3  |
| データ4  | データ5  | データ6  |
```

### 左寄せ・中央・右寄せ

```markdown
| 左寄せ | 中央揃え | 右寄せ |
| :---- | :------: | -----: |
| Left  | Center   | Right  |
```

---

## 📝 引用

### 基本

```markdown
> 引用文
> 複数行も可能
```

### ネスト

```markdown
> 引用レベル1
>> 引用レベル2
>>> 引用レベル3
```

---

## ✅ チェックリスト

```markdown
- [ ] 未完了タスク
- [x] 完了タスク
```

---

## 🎨 その他の記法

### 注釈

```markdown
脚注の例[^1]です。

[^1]: これが脚注の内容
```

### 水平線

```markdown
---
```

または

```markdown
***
```

### インラインコード

```markdown
`console.log()` のように書く
```

### 太字・斜体

```markdown
**太字**
*斜体*
***太字かつ斜体***
```

### 打ち消し線

```markdown
~~打ち消し~~
```

---

## 📄 フロントマター（記事の設定）

### tech記事

```yaml
---
title: "記事のタイトル"
emoji: "💻"
type: "tech"
topics: ["javascript", "typescript", "react"]
published: false
---
```

### idea記事

```yaml
---
title: "アイデア記事のタイトル"
emoji: "💡"
type: "idea"
topics: ["キャリア", "ポエム"]
published: true
publication_name: "組織名"  # 組織に投稿する場合
---
```

### 利用可能なトピック例

```
技術: javascript, typescript, react, vue, nextjs, nodejs, python, 
      go, rust, docker, kubernetes, aws, azure, gcp, git, github
概念: 設計, アーキテクチャ, テスト, CI/CD, セキュリティ
その他: vscode, 開発効率化, エディタ, CLI
```

---

## 🎯 よく使うパターン

### コード説明

````markdown
まず、設定ファイルを作成します：

```json:config.json
{
  "name": "my-app",
  "version": "1.0.0"
}
```

:::message
本番環境では `version` を適切に管理してください。
:::
````

### 手順説明with画像

```markdown
### 手順1: 設定画面を開く

![設定画面](/images/article/step1.png)

### 手順2: 値を入力

以下のように入力します：

:::details 詳細な入力例

- フィールド1: `value1`
- フィールド2: `value2`

:::
```

---

## 📖 参考

- [Zenn Markdown記法一覧](https://zenn.dev/zenn/articles/markdown-guide)
