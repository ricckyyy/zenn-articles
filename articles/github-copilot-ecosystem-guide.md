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

| 拡張機能 | 役割 | 自動実行 | 用途 | 使い分け |
| -------- | ---- | -------- | ---- | -------- |
| **Instructions** | プロジェクトルール | ○ | 常に守るべき規約 | ブランチ命名規則の統一などプロジェクトルールを定義する場合 |
| **Prompts** | 質問テンプレート | × | 定型作業の効率化 | 記事レビューや定型入力を効率化したい場合 |
| **Skills** | 機能パック | △ | 複雑なタスク自動化 | Lintや自動修正など複雑な自動化が必要な場合 |
| **Agents** | 自律アシスタント | ○ | ワークフロー全体 | 記事公開などワークフロー全体を自動化したい場合 |
| **Hooks** | イベントトリガー | ○ | 品質チェック自動化 | コミット時やCIで自動チェックを実行したい場合 |
| **Plugins** | 機能セット | - | チーム共有 | Prompts/Skills/Hooksをまとめて共有したい場合 |
| **Recipes** | サンプルコード集 | × | 学習・参照 | よく使うコマンドやスニペットを記録・共有したい場合 |

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

### 使用例

Instructionsを導入すると、AIの振る舞いが自動的に変わります。

**Before（Instructionsなし）**：

1. 「新しい記事を書きたい」と依頼
2. 単に記事ファイルを作成するだけ

**After（Instructionsあり）**：

1. 「新しい記事を書きたい」と依頼
2. AIが自動的に `article/記事名` ブランチを作成
3. `articles/` ディレクトリに記事ファイルを作成
4. `images/記事名/` ディレクトリを作成
5. Lint実行を提案

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

### 実装例 2: 新規記事作成用

`.github/copilot-prompts/new-article.md`：

1. **画像ディレクトリ作成**
   - `images/[記事スラッグ]/` ディレクトリを作成

2. **初期構成**
   - はじめに
   - 目次（自動生成されるので書かない）
   - 本文
   - まとめ
   - 参考リンク

### 使用方法

1. GitHub Copilot Chatを開く
2. チャットに `/` と入力してファイルを検索
3. `.github/copilot-prompts/new-article.md` を選択
4. 記事の詳細（テーマ、タイトルなど）を入力して実行

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

### 使用例

Skillを使うと、複雑なタスクが自動化されます。

1. 「記事をlintして」と依頼（`triggers` に近い表現を推奨）
2. AIが依頼内容を解釈し、zenn-article-lint Skillを選択
3. `npm run lint:md` を自動実行
4. エラーを検出
5. `common-errors.md` を参照して解決策を提示
6. 自動修正コマンド (`npm run lint:md:fix`) を提案

**Skillの発動について**

- Skillは `SKILL.md` の `triggers` フィールドに基づいて発動
- 完全一致でなくても、意味的に類似していれば発動することもある
- 例: 「lint実行して」「記事チェックして」なども発動する可能性あり
- より確実に発動させたい場合は、triggersに記載された表現を使う

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

Article Publisher Agent（記事公開エージェント）の動作イメージ：

1. 「記事を公開して」と依頼
2. Agentが記事の完成度をチェック
3. Lintエラーがないか確認
4. 画像リンク切れチェック
5. プレビューで確認
6. mainブランチにマージ
7. `published: true` に変更
8. GitHubにプッシュ

### 注意点

Agentの実装はMCPサーバーとの連携が必要で、
現時点ではGitHub Copilot for個人利用では制限があります。
エンタープライズ環境での活用が主となります。

---

## 5. Hooks（自動トリガー）

### 概要

**イベント発生時に自動実行される処理**

git commitやpushなどのイベントで自動的に品質チェックを実行します。

> **⚠️ 重要：HooksはAI機能ではありません**
>
> Hooksは通常のGit hooksスクリプトで、GitHub CopilotやAIとは無関係です。
> この記事では、GitHub Copilot環境と組み合わせて使える開発ツールとして紹介しています。

### 特徴

- ✅ 自動実行なので忘れない
- ✅ git hooksやGitHub Actionsと連携
- ✅ チーム全体で品質を担保
- ⚠️ AIは使わず、シェルスクリプトで動作

### 実装例: Pre-commit Hook

`.github/hooks/pre-commit`：

### セットアップ方法

`.github/hooks/README.md`：

### 使用例

Hooksによる自動品質チェックの流れ：

1. 記事を編集（例: `vim articles/new-article.md`）
2. 変更をステージング（`git add articles/new-article.md`）
3. コミットを実行（`git commit -m "記事追加"`）
4. **pre-commit hookが自動実行される**
5. 🔍 Markdownlintチェックが走る
6. エラーが見つかった場合：
   - ❌ エラーメッセージが表示される
   - `npm run lint:md:fix` を実行するよう促される
   - コミットが中断される（品質保証）
7. エラーがない場合：
   - ✅ チェック完了
   - コミットが正常に完了

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

### 使用方法

Recipesはリファレンスとして活用します。

1. `.github/recipes/zenn-cli.md` をエディタで開く
2. 必要なコマンドやコードを探す
3. コピーしてターミナルやエディタに貼り付け
4. 必要に応じてパラメータを変更して実行

> **⚠️ 重要：RecipesはAI機能ではありません**
>
> Recipesは人間が参照するためのコードスニペット／コマンド集です。Copilotが自動的に実行・解釈したり、判断を行ったりすることはありません。`.github/recipes/` 内のファイルは手動で開いて必要な部分をコピーして使ってください。

> **💡 Recipesの活用シーン**
>
> - 「あのコマンド何だっけ？」というときの早見表
> - 新メンバーへのオンボーディング資料
> - コマンド実行のベストプラクティス集
> - プロジェクト固有の運用ルールの記録

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
