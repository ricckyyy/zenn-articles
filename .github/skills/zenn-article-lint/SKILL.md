---
name: zenn-article-lint
description: Zenn記事のMarkdownLintチェックと自動修正を行う。「lintして」「記事をチェックして」「Markdownを修正して」などの依頼で使用。
---

# Zenn Article Lint Skill

Zenn記事のMarkdownLintチェックと自動修正を実行します。

## 実行手順

1. **Lintチェック実行**

   ```bash
   npm run lint:md
   ```

2. **エラーがある場合**
   - 自動修正できるものは `npm run lint:md:fix` を実行
   - 手動修正が必要なものは下記のエラー一覧を参照して提案

3. **結果報告**
   - 修正した項目をリスト表示
   - 残っているエラーがあれば説明と修正提案

## よくあるエラーと修正方法

### MD013: 行が長すぎる（80文字超）

手動修正。適切な位置で改行する。

```markdown
<!-- Before -->
GitHub Copilotのカスタマイズ機能が充実してきた今、Instructions、Prompts、Skills、Agents、Hooks、Plugins、Cookbook Recipesといった様々な概念が登場しています。

<!-- After -->
GitHub Copilotのカスタマイズ機能が充実してきた今、
Instructions、Prompts、Skills、Agents、Hooks、Plugins、
Cookbook Recipesといった様々な概念が登場しています。
```

### MD040: コードブロックに言語指定なし

手動修正。適切な言語名を追加する。

````markdown
<!-- Before -->
```
git commit
```

<!-- After -->
```bash
git commit
```
````

### MD032: リスト前後に空行なし

自動修正可能（`npm run lint:md:fix`）。

```markdown
<!-- Before -->
これはリスト：
- 項目1
- 項目2
次の段落

<!-- After -->
これはリスト：

- 項目1
- 項目2

次の段落
```

### MD031: コードブロック前後に空行なし

自動修正可能（`npm run lint:md:fix`）。

### MD036: 太字を見出しの代わりに使っている

手動修正。適切な見出しレベルに変更する。

```markdown
<!-- Before -->
**セクションタイトル**

内容...

<!-- After -->
### セクションタイトル

内容...
```

### MD060: テーブルのパイプ前後にスペースなし

自動修正可能（`npm run lint:md:fix`）。

## 自動修正できるエラー

`npm run lint:md:fix` で修正可能：MD031、MD032、MD060

## 手動修正が必要なエラー

文脈の判断が必要：MD013（改行位置）、MD040（言語名）、MD036（見出しvs太字）
