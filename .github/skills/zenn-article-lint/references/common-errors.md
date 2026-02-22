# よくあるMarkdownlintエラーと修正方法

## MD013: Line length

**問題**: 1行が80文字を超えている

**修正方法**:
```markdown
<!-- Before -->
GitHub Copilotのカスタマイズ機能が充実してきた今、Instructions、Prompts、Skills、Agents、Hooks、Plugins、Cookbook Recipesといった様々な概念が登場しています。

<!-- After -->
GitHub Copilotのカスタマイズ機能が充実してきた今、
Instructions、Prompts、Skills、Agents、Hooks、Plugins、
Cookbook Recipesといった様々な概念が登場しています。
```

---

## MD040: Fenced code blocks should have a language specified

**問題**: コードブロックに言語指定がない

**修正方法**:
````markdown
<!-- Before -->
```
git commit
```

<!-- After -->
```bash
git commit
```

または

```text
プレーンテキスト
```
````

---

## MD032: Lists should be surrounded by blank lines

**問題**: リストの前後に空行がない

**修正方法**:
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

---

## MD036: Emphasis used instead of a heading

**問題**: 太字を見出しの代わりに使っている

**修正方法**:
```markdown
<!-- Before -->
**セクションタイトル**

内容...

<!-- After -->
### セクションタイトル

内容...
```

---

## MD031: Fenced code blocks should be surrounded by blank lines

**問題**: コードブロックの前後に空行がない

**修正方法**:
````markdown
<!-- Before -->
説明文
```bash
コマンド
```
次の文

<!-- After -->
説明文

```bash
コマンド
```

次の文
````

---

## MD060: Table column style

**問題**: テーブルのパイプ（|）の前後にスペースがない

**修正方法**:
```markdown
<!-- Before -->
|A|B|C|
|---|---|---|

<!-- After -->
| A | B | C |
| --- | --- | --- |
```

---

## 自動修正できるエラー

以下は `npm run lint:md:fix` で自動修正可能：
- MD032（リスト前後の空行）
- MD031（コードブロック前後の空行）
- MD060（テーブルのスペース）

## 手動修正が必要なエラー

以下は文脈を理解する必要があるため手動修正：
- MD013（行の長さ）- 適切な改行位置を判断
- MD040（言語指定）- 正しい言語名を判断
- MD036（太字vs見出し）- 文書構造を判断
