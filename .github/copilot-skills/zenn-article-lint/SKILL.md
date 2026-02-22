---
name: zenn-article-lint
description: Zenn記事のMarkdownLintチェックと自動修正を行う
version: 1.0.0
author: GitHub Copilot User
triggers:
  - "lint"
  - "記事をチェック"
  - "Markdownlint"
  - "記事を修正"
---

# Zenn Article Lint Skill

Zenn記事のMarkdownLintチェックと自動修正を実行します。

## 使い方

### 基本的な使用

ユーザーが以下のように依頼したときにこのSkillを使用：
- 「記事をlintして」
- 「Markdownをチェックして」
- 「記事の品質をチェック」
- 「lintエラーを修正して」

### 実行手順

1. **Lintチェック実行**
   ```bash
   npm run lint:md
   ```

2. **エラーがある場合**
   - エラー内容を解析
   - 修正可能なものは `npm run lint:md:fix` で自動修正
   - 手動修正が必要なものはユーザーに提案

3. **エラーの種類と対処**

   - `MD013` (line-length): 80文字を超える行
     → 適切な位置で改行を提案
   
   - `MD040` (fenced-code-language): コードブロックに言語指定なし
     → 適切な言語名を追加
   
   - `MD032` (blanks-around-lists): リスト前後に空行なし
     → 空行を追加
   
   - `MD036` (no-emphasis-as-heading): 太字を見出しの代わりに使用
     → 適切な見出しレベル（###）に変更

4. **結果報告**
   - 修正した項目をリスト表示
   - 残っているエラーがあれば説明
   - 次のアクションを提案

## 参考ファイル

- Lintルール: `.markdownlint-cli2.jsonc` および `.markdownlintrc`
- 実行スクリプト: `package.json` の `scripts.lint:md`

## 例

**ユーザー**: 記事をlintして

**AI**: 
1. `npm run lint:md` を実行
2. エラーを検出: MD013（行が長すぎる）x 3箇所
3. 自動修正を実行: `npm run lint:md:fix`
4. 結果: 2箇所自動修正、1箇所は手動修正が必要
5. 手動修正の提案を表示
