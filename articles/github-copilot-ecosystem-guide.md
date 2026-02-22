---
title: "GitHub Copilot 7つの拡張機能を実装して理解する完全ガイド"
emoji: "🎯"
type: "tech"
topics: ["githubcopilot", "ai", "vscode", "開発効率化", "zenn"]
published: false
---

## はじめに

GitHub Copilotには、**Instructions、Prompts、Skills、Agents、Hooks、Plugins、
Cookbook Recipes**という7つのカスタマイズ機能があります。

一見似ているようで、それぞれ異なる役割があります。
この記事では、**7つ全てを実際にZenn記事執筆リポジトリに導入しながら**、
その違いと使い方を解説します。

## この記事のゴール

- ✅ 7つの拡張機能の違いを実装を通じて理解
- ✅ コピペで使えるサンプルコードを入手
- ✅ 自分のプロジェクトにすぐ適用できる知識を獲得

## 前提知識

- GitHub Copilotの基本的な使い方
- GitとGitHubの基礎知識
- コマンドラインの基本操作

---

## 7つの拡張機能 一覧

まず全体像を把握しましょう。

| 拡張機能 | 役割 | 自動実行 | 用途 |
| -------- | ---- | -------- | ---- |
| **Instructions** | プロジェクトルール | ○ | 常に守るべき規約 |
| **Prompts** | 質問テンプレート | × | 定型作業の効率化 |
| **Skills** | 機能パック | △ | 複雑なタスク自動化 |
| **Agents** | 自律アシスタント | ○ | ワークフロー全体 |
| **Hooks** | イベントトリガー | ○ | 品質チェック自動化 |
| **Plugins** | 機能セット | - | チーム共有 |
| **Recipes** | サンプルコード集 | × | 学習・参照 |

---

## 1. Instructions（必須ルール）

### 概要

**常に有効なプロジェクトルール・コーディング規約**

GitHub Copilotが自動的に読み込み、全ての提案に反映します。

### 特徴

- ✅ 自動読み込み
- ✅ 常時有効
- ✅ ファイルパターンで条件分岐可能
- ✅ GitHub Copilot & Claude両方で使える

### 実装例

`.github/copilot-instructions.md`を作成：

```markdown
# GitHub Copilot Instructions

## ブランチ運用ルール

このリポジトリはFeature Branch Workflowを採用しています。

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
- Markdownlintのルールに従う
```

### 使用例

**Before（Instructionsなし）**：

```text
あなた: 「新しい記事を書きたい」
AI: 記事ファイルを作成します
```

**After（Instructionsあり）**：

```text
あなた: 「新しい記事を書きたい」
AI: [自動的に]
    1. article/記事名 ブランチを作成
    2. articles/ディレクトリに記事ファイル作成
    3. images/記事名/ ディレクトリ作成
    4. Lint実行を提案
```

---

## 2. Prompts（テンプレート集）

### 概要

**コピペして使う定型質問テンプレート**

頻繁に行う作業を効率化します。

### 特徴

- 🟡 手動でコピペまたは `@workspace` で参照
- 🟡 シンプルで導入しやすい
- 🟡 チーム内で標準化しやすい

### 実装例 1: 記事レビュー用

`.github/copilot-prompts/article-review.md`：

```markdown
# Zenn記事レビュープロンプト

以下の観点で記事をレビューしてください：

## チェック項目

### 1. 技術的正確性

- [ ] コードサンプルは動作するか
- [ ] 技術用語は正しく使われているか
- [ ] 非推奨の機能を使っていないか

### 2. 文章品質

- [ ] 誤字脱字はないか
- [ ] わかりやすい表現か
- [ ] 段落構成は適切か

### 3. Zenn記法

- [ ] メタデータ（title, emoji, type, topics）は正しいか
- [ ] 画像パスは正しいか（`/images/[slug]/`）
- [ ] コードブロックに言語指定があるか

### 4. Markdown品質

- [ ] Markdownlintルールに準拠しているか
- [ ] 見出しレベルは適切か（H1は使わない）
- [ ] リンクは正しく設定されているか
```

### 実装例 2: 新規記事作成用

`.github/copilot-prompts/new-article.md`：

```markdown
# 新規Zenn記事作成プロンプト

以下の手順で新しいZenn記事を作成してください：

1. **ブランチ作成**
   - `article/[記事タイトルの要約]` で新しいブランチを作成

2. **記事ファイル作成**
   - `articles/` ディレクトリに `.md` ファイルを作成
   - スラッグは英数字とハイフンのみ使用

3. **メタデータ設定**

   ```yaml
   ---
   title: "記事タイトル"
   emoji: "📝"
   type: "tech" # または "idea"
   topics: ["トピック1", "トピック2"]
   published: false
   ---
   ```

1. **画像ディレクトリ作成**
   - `images/[記事スラッグ]/` ディレクトリを作成

2. **初期構成**
   - はじめに
   - 目次（自動生成されるので書かない）
   - 本文
   - まとめ
   - 参考リンク

### 使用方法

```bash
# VS Codeで使う場合
# 1. プロンプトファイルを開く
# 2. 内容をコピー
# 3. GitHub Copilot Chatに貼り付け
# 4. 記事内容を追加して実行
```

---

## 3. Skills（機能パック）

### 概要

**指示書+スクリプト+リファレンスのセット**

複雑なタスクを自動化する再利用可能なパッケージです。

### 特徴

- ✅ リソース同梱（スクリプト、テンプレート、ドキュメント）
- ✅ [Agent Skills仕様](https://agentskills.io/)準拠
- ✅ MCPと連携可能

### ディレクトリ構造

```text
.github/copilot-skills/
└── zenn-article-lint/
    ├── SKILL.md              # スキルの説明と使い方
    ├── references/
    │   └── common-errors.md  # よくあるエラーと解決策
    └── templates/
        └── article-template.md  # 記事テンプレート
```

### 実装例: Zenn記事Lintスキル

`.github/copilot-skills/zenn-article-lint/SKILL.md`：

````markdown
---
name: zenn-article-lint
description: Zenn記事のMarkdownLintチェックと自動修正を行う
version: 1.0.0
triggers:
  - "lint"
  - "記事をチェック"
  - "Markdownlint"
---

# Zenn Article Lint Skill

Zenn記事のMarkdownLintチェックと自動修正を実行します。

## 使い方

ユーザーが以下のように依頼したときにこのSkillを使用：

- 「記事をlintして」
- 「Markdownをチェックして」
- 「記事の品質をチェック」

## 実行手順

1. **Lintチェック実行**

   ```bash
   npm run lint:md
   ```

2. **エラーがある場合**
   - エラー内容を確認
   - `references/common-errors.md` を参照して解決策を提示
   - 自動修正可能なら `npm run lint:md:fix` を実行

3. **修正後の確認**
   - 再度lintを実行して全てのエラーが解消されたか確認

## よくあるエラーと解決策

詳細は `references/common-errors.md` を参照してください。

### MD013: 行が長すぎる

**解決策**: 80文字以内に改行を入れる

### MD040: コードブロックに言語指定がない

**解決策**: コードブロックの開始に言語を指定

```markdown
\```javascript
// コード
\```
```
````

### 使用例

```text
あなた: 「記事をlintして」
AI: [zenn-article-lint Skillを発動]
    1. npm run lint:md を実行
    2. エラーを検出
    3. common-errors.mdを参照して解決策を提示
    4. 自動修正コマンドを提案
```

---

## 4. Agents（自律アシスタント）

### 概要

**複数ステップを自律実行する専門家AI**

ワークフロー全体を担当し、判断も行います。

### 特徴

- ✅ 自律的に複数ステップ実行
- ✅ MCP（Model Context Protocol）必須
- ✅ 状況に応じた判断が可能

### Zennリポジトリでの適用例

Zenn記事執筆リポジトリでAgentを使うなら：

```text
Article Publisher Agent（記事公開エージェント）

あなた: 「記事を公開して」
Agent: [自動的に]
  1. 記事の完成度をチェック
  2. Lintエラーがないか確認
  3. 画像リンク切れチェック
  4. プレビューで確認
  5. mainブランチにマージ
  6. published: true に変更
  7. GitHubにプッシュ
```

### 注意点

Agentの実装はMCPサーバーとの連携が必要で、
現時点ではGitHub Copilot for個人利用では制限があります。
エンタープライズ環境での活用が主となります。

---

## 5. Hooks（自動トリガー）

### 概要

**イベント発生時に自動実行される処理**

git commitやpushなどのイベントで自動的に品質チェックを実行します。

### 特徴

- ✅ 自動実行なので忘れない
- ✅ git hooksやGitHub Actionsと連携
- ✅ チーム全体で品質を担保

### 実装例: Pre-commit Hook

`.github/hooks/pre-commit`：

```bash
#!/bin/sh
# Zenn記事のMarkdownLintチェック（pre-commit hook）

echo "🔍 Markdownlintチェック中..."

# articlesディレクトリに変更があるかチェック
if git diff --cached --name-only | grep -q "^articles/.*\.md$"; then
    # Lintを実行
    npm run lint:md
    
    LINT_RESULT=$?
    
    if [ $LINT_RESULT -ne 0 ]; then
        echo ""
        echo "❌ Markdownlintエラーが見つかりました"
        echo ""
        echo "以下のコマンドで自動修正を試してください："
        echo "  npm run lint:md:fix"
        echo ""
        echo "修正後、再度コミットしてください。"
        exit 1
    fi
    
    echo "✅ Markdownlintチェック完了"
fi

exit 0
```

### セットアップ方法

`.github/hooks/README.md`：

```markdown
# Git Hooksセットアップ

## インストール方法

\```bash
# フックスクリプトを.git/hooksにコピー
cp .github/hooks/pre-commit .git/hooks/pre-commit

# 実行権限を付与
chmod +x .git/hooks/pre-commit
\```

## 動作確認

\```bash
# 記事を編集
echo "test" >> articles/test-article.md

# コミットを試みる（hookが自動実行される）
git add articles/test-article.md
git commit -m "test"
\```

## 一時的に無効化したい場合

\```bash
# --no-verifyオプションを使用
git commit --no-verify -m "commit message"
\```
```

### 使用例

```text
# 記事を編集
vim articles/new-article.md

# コミット実行
git add articles/new-article.md
git commit -m "記事追加"

→ [pre-commit hookが自動実行]
  🔍 Markdownlintチェック中...
  ❌ Markdownlintエラーが見つかりました
  
  npm run lint:md:fix を実行してください
  
→ コミットが中断される（品質保証）
```

---

## 6. Plugins（テーマ別セット）

### 概要

**関連するPrompts + Agents + Skillsのバンドル**

複数の機能をまとめたスターターキットです。

### 特徴

- ✅ テーマごとに機能をまとめる
- ✅ チーム全体で共有しやすい
- ✅ 新メンバーのオンボーディングに最適

### ディレクトリ構造

```text
.github/plugins/
└── zenn-workflow/
    ├── README.md          # プラグインの説明
    ├── prompts/
    │   ├── new-article.md
    │   └── article-review.md
    ├── skills/
    │   └── zenn-article-lint/
    └── hooks/
        └── pre-commit
```

### 実装例

`.github/plugins/zenn-workflow/README.md`：

```markdown
# Zenn Workflow Plugin

Zenn記事執筆に必要な全ての機能をまとめたプラグインです。

## 含まれる機能

### Prompts（テンプレート）

- `prompts/new-article.md` - 新規記事作成ガイド
- `prompts/article-review.md` - 記事レビューチェックリスト

### Skills（自動化）

- `skills/zenn-article-lint/` - Lint + 修正スキル

### Hooks（品質保証）

- `hooks/pre-commit` - commit前の自動Lintチェック

## セットアップ方法

### 1. Promptsを配置

\```bash
cp prompts/* ../.github/copilot-prompts/
\```

### 2. Skillsを配置

\```bash
cp -r skills/* ../.github/copilot-skills/
\```

### 3. Hooksをインストール

\```bash
cp hooks/pre-commit ../../../.git/hooks/
chmod +x ../../../.git/hooks/pre-commit
\```

## 使い方

### 新規記事作成

1. `prompts/new-article.md` をCopilot Chatに貼り付け
2. 記事テーマを伝える
3. 自動的にブランチ作成・ファイル生成

### 記事レビュー

1. `prompts/article-review.md` をCopilot Chatに貼り付け
2. 記事ファイルを指定
3. チェックリストに沿ってレビュー実行

### 品質チェック

- コミット時に自動でLint実行（hook）
- 手動でlintしたい場合は「記事をlintして」と依頼（skill）
```

---

## 7. Cookbook Recipes（サンプル集）

### 概要

**すぐ使えるコードスニペット集**

コピペして即使える実用的なサンプルコード集です。

### 特徴

- ✅ コピペで即使える
- ✅ 学習・参照用
- ✅ ベストプラクティス集

### 実装例

`.github/recipes/zenn-cli.md`：

````markdown
# Zenn CLI レシピ集

## 新規記事作成

\```bash
# スラッグ指定で記事作成
npx zenn new:article --slug my-awesome-article

# エディタで開く
code articles/my-awesome-article.md
\```

## 画像の追加

\```bash
# 記事用の画像ディレクトリ作成
mkdir -p images/my-awesome-article

# 画像をコピー
cp ~/Downloads/screenshot.png images/my-awesome-article/

# 記事から参照
# ![説明](/images/my-awesome-article/screenshot.png)
\```

## プレビュー

\```bash
# ローカルサーバー起動
npm run preview

# ブラウザで確認
# http://localhost:8000
\```

## Lintチェック

\```bash
# 全記事をチェック
npm run lint:md

# 自動修正
npm run lint:md:fix

# 特定のファイルだけチェック
npx markdownlint-cli2 articles/specific-article.md
\```

## ブランチ運用

\```bash
# 新規記事用ブランチ作成
git checkout -b article/my-awesome-article

# 記事執筆後
git add articles/my-awesome-article.md images/my-awesome-article/
git commit -m "記事追加: すごい記事のタイトル"

# リモートにプッシュ
git push -u origin article/my-awesome-article

# GitHub上でPull Request作成
# マージ後、ブランチ削除
git checkout main
git pull
git branch -d article/my-awesome-article
\```

## メタデータテンプレート

\```yaml
---
title: "記事のタイトル（60文字以内推奨）"
emoji: "📝"  # https://getemoji.com/ で探す
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["javascript", "react", "nextjs"] # 最大5つ、小文字のみ
published: false  # true: 公開 / false: 下書き
---
\```

## トピックの選び方

\```yaml
# 良い例（具体的な技術名）
topics: ["react", "typescript", "vite", "tailwindcss"]

# 避けるべき例（抽象的すぎる）
topics: ["プログラミング", "フロントエンド", "初心者"]
\```

## 絵文字の選び方

\```yaml
# 記事の内容に合わせて選ぶ
"🎯" # 目標・ベストプラクティス
"📝" # 記事・ドキュメント
"🚀" # パフォーマンス・デプロイ
"🔧" # ツール・設定
"💡" # アイデア・ヒント
"⚠️" # 注意・トラブルシューティング
"🎨" # デザイン・UI
"📊" # データ・分析
\```
````

---

## 全体のディレクトリ構成

7つ全てを導入した最終的なディレクトリ構成：

```text
.github/
├── copilot-instructions.md       # 1. Instructions
├── copilot-prompts/               # 2. Prompts
│   ├── new-article.md
│   └── article-review.md
├── copilot-skills/                # 3. Skills
│   └── zenn-article-lint/
│       ├── SKILL.md
│       └── references/
│           └── common-errors.md
├── hooks/                         # 5. Hooks
│   ├── pre-commit
│   └── README.md
├── plugins/                       # 6. Plugins
│   └── zenn-workflow/
│       ├── README.md
│       ├── prompts/ → symlink
│       ├── skills/ → symlink
│       └── hooks/ → symlink
└── recipes/                       # 7. Recipes
    └── zenn-cli.md

# 4. Agents は将来的に追加（MCP対応後）
```

---

## 使い分けガイド

### どれを使えばいい？

| やりたいこと | 使うべき機能 |
| ------------ | ------------ |
| ブランチ命名規則を統一したい | Instructions |
| 記事レビューを効率化したい | Prompts |
| Lintを自動化したい | Skills |
| コミット前にチェックしたい | Hooks |
| チーム全体で共有したい | Plugins |
| よく使うコマンドを記録したい | Recipes |
| ワークフロー全体を自動化したい | Agents |

### 導入の優先順位

プロジェクトの規模や目的に応じて：

#### 個人プロジェクト（最小構成）

```text
1. Instructions  # ブランチ運用ルール
2. Recipes       # コマンド早見表
3. Hooks         # コミット前チェック
```

#### チームプロジェクト（推奨構成）

```text
1. Instructions  # プロジェクトルール
2. Prompts       # 定型作業テンプレート
3. Skills        # 複雑なタスク自動化
4. Hooks         # 品質保証
5. Plugins       # 全てをセットで共有
6. Recipes       # オンボーディング資料
```

#### エンタープライズ（フル構成）

```text
1-6. 上記全て
7. Agents        # ワークフロー全自動化
```

---

## まとめ

この記事では、GitHub Copilotの7つの拡張機能を
実際にZenn記事執筆リポジトリに導入しました。

### 7つの違い おさらい

1. **Instructions** - AIが常に従うルール
2. **Prompts** - コピペで使うテンプレート
3. **Skills** - 複雑なタスクの自動化パッケージ
4. **Agents** - 自律的に動くアシスタント
5. **Hooks** - イベント駆動の自動実行
6. **Plugins** - 機能をまとめたスターターキット
7. **Recipes** - すぐ使えるサンプルコード集

### 次のステップ

1. この記事のコードをコピペして自分のリポジトリに実装
2. プロジェクトに合わせてカスタマイズ
3. チームメンバーと共有
4. 定期的に見直して改善

GitHub Copilotの真価は、これらの機能を組み合わせることで発揮されます。
まずは小さく始めて、徐々に拡張していきましょう！

---

## 参考リンク

- [GitHub Copilot Awesome - Skills](https://github.com/github/awesome-copilot/blob/main/docs/README.skills.md)
- [Agent Skills Specification](https://agentskills.io/specification)
- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [Zenn CLI Guide](https://zenn.dev/zenn/articles/zenn-cli-guide)

---

この記事が、GitHub Copilotエコシステムの理解と活用の助けになれば幸いです！
