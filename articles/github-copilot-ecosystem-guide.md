---
title: "GitHub Copilot & Claude Code 拡張機能を比較して理解する完全ガイド"
emoji: "🎯"
type: "tech"
topics: ["githubcopilot", "claudecode", "ai", "vscode", "開発効率化"]
published: true
---

## はじめに

GitHub Copilotには、**Instructions、Prompts、Skills、Agents、Hooks、Plugins、
Cookbook Recipes**という7つのカスタマイズ機能があります。

一見似ているようで、それぞれ異なる役割があります。
この記事では、**7つ全てを実際にZenn記事執筆リポジトリに導入しながら**、その違いと使い方を解説します。

さらに、各機能について **Claude Code（Anthropic製CLIエージェント）でも使えるか**を比較します。
GitHub CopilotとClaude Codeを併用している方、あるいはどちらを使うか検討中の方の参考になれば幸いです。

## この記事のゴール

- ✅ 7つの拡張機能の違いを実装を通じて理解
- ✅ コピペで使えるサンプルコードを入手
- ✅ 自分のプロジェクトにすぐ適用できる知識を獲得
- ✅ GitHub Copilot / Claude Code それぞれでの使い方を把握

## 前提知識

- GitHub CopilotまたはClaude Codeの基本的な使い方
- GitとGitHubの基礎知識
- コマンドラインの基本操作

## サンプルリポジトリ

この記事の実装例は、以下のリポジトリで実際に動作しています。（zennを管理しているリポジトリです）

**[ricckyyy/zenn-articles](https://github.com/ricckyyy/zenn-articles)**

各「実装例」セクションのリンクから、実際のファイルを参照できます。

---

## 7つの拡張機能 一覧

まず全体像を把握しましょう。

<!-- markdownlint-disable MD013 -->

| 拡張機能 | 役割 | 自動実行 | 用途 | 使い分け | Claude Code |
| -------- | ---- | -------- | ---- | -------- | ----------- |
| **Instructions** | プロジェクトルール | ○ | 常に守るべき規約 | ブランチ命名規則の統一などプロジェクトルールを定義する場合 | ✅ `CLAUDE.md` で対応 |
| **Prompts** | 質問テンプレート | × | 定型作業の効率化 | 記事レビューや定型入力を効率化したい場合 | △ Skillsで代替 |
| **Skills** | 機能パック | △ | 複雑なタスク自動化 | Lintや自動修正など複雑な自動化が必要な場合 | ✅ `.claude/skills/` または `.github/skills/` |
| **Agents** | 自律アシスタント | ○ | ワークフロー全体 | 記事公開などワークフロー全体を自動化したい場合 | △ サブエージェントで代替 |
| **Hooks** | イベントトリガー | ○ | 品質チェック自動化 | コミット時やCIで自動チェックを実行したい場合 | ✅ Git hooksはそのまま使える |
| **Plugins** | 機能セット | - | チーム共有 | Prompts/Skills/Hooksをまとめて共有したい場合 | △ 独自のPlugin機能あり |
| **Recipes** | サンプルコード集 | × | 学習・参照 | よく使うコマンドやスニペットを記録・共有したい場合 | ✅ 手動参照なのでそのまま使える |

<!-- markdownlint-enable MD013 -->

---

## 1. Instructions（必須ルール）

### 概要

**常に有効なプロジェクトルール・コーディング規約**

AIが自動的に読み込み、全ての提案に反映します。

### 特徴

- ✅ **起動時に自動読み込み・常時有効**（トリガー不要）
- ✅ 全ての会話・提案に適用される
- ✅ ファイルパターンで条件分岐可能

> **💡 InstructionsとSkillsの違い**
>
> - **Instructions** = AIが常に守るべきルール。起動時から常時有効。
> - **Skills** = 特定タスクの手順書。呼ばれた時だけ有効。
>
> 「ブランチ命名規則」はInstructions、「記事Lintの手順」はSkillsに書く。

### 実装例

<!-- markdownlint-disable MD013 -->
[`.github/copilot-instructions.md`](https://github.com/ricckyyy/zenn-articles/blob/main/.github/copilot-instructions.md)
<!-- markdownlint-enable MD013 -->

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

### Claude Codeでの使い方

> **✅ 対応（ファイル名が異なる）**

Claude Codeは `.github/copilot-instructions.md` を読みません。代わりに **`CLAUDE.md`** を使います。

| ツール | ファイル |
| ------ | -------- |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Claude Code | `CLAUDE.md`（プロジェクトルート）または `~/.claude/CLAUDE.md`（個人設定） |

内容の書き方は同じで、ファイル名だけ違います。両方に同じ内容を置けば、どちらのAIでも機能します。

---

## 2. Prompts（テンプレート集）

### 概要

**コピペして使う定型質問テンプレート**

頻繁に行う作業を効率化します。

> **💡 PromptsとSkillsの違い**
>
> - **Prompts** = ユーザーが手動でAIに渡すテキストテンプレート。AIは受け取って実行するだけ。
> - **Skills** = AIが「いつ使うか」を自分で判断できるパッケージ。自動発動・`/コマンド`呼び出しが可能。
>
> Promptsはシンプルで導入しやすい。Skillsはより高機能だが設定が必要。

### 特徴

- 🟡 手動でコピペまたは `@workspace` で参照
- 🟡 シンプルで導入しやすい
- 🟡 チーム内で標準化しやすい

### 実装例 1: 記事レビュー用

[`.github/prompts/article-review.prompt.md`](https://github.com/ricckyyy/zenn-articles/blob/main/.github/prompts/article-review.prompt.md)：

### 実装例 2: 新規記事作成用

[`.github/prompts/new-article.prompt.md`](https://github.com/ricckyyy/zenn-articles/blob/main/.github/prompts/new-article.prompt.md)：

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
3. `.github/prompts/new-article.prompt.md` を選択
4. 記事の詳細（テーマ、タイトルなど）を入力して実行

### Claude Codeでの使い方

> **△ 直接は使えないが、Skillsで代替可能**

Claude Codeは `.github/prompts/` を `/` メニューで呼び出す仕組みを持ちません。
ただし、同等の機能を **Skills** で実現できます。

<!-- markdownlint-disable MD013 -->
```text
.claude/skills/new-article/SKILL.md  → /new-article として呼び出し可能
```
<!-- markdownlint-enable MD013 -->

既存の `.github/prompts/*.prompt.md` の内容を `.claude/skills/` に移植することで、
Claude Codeでも `/` コマンドで呼び出せるようになります。

---

## 3. Skills（機能パック）

### 概要

**指示書+スクリプト+リファレンスのセット**

複雑なタスクを自動化する再利用可能なパッケージです。

Promptsとの最大の違いは「**AIが自分でいつ使うかを判断できる**」点です。`SKILL.md` の `description` を読んで、関連する依頼が来たときに自動発動します。

### 特徴

- ✅ AIが `description` を見て自動発動（Promptsにはない機能）
- ✅ `/skill-name` で直接呼び出しも可能
- ✅ リソース同梱（スクリプト、テンプレート、ドキュメント）
- ✅ [Agent Skills仕様](https://agentskills.io/)準拠（GitHub Copilot・Claude Code共通）

### ディレクトリ構造

```text
.github/skills/
└── zenn-article-lint/
    ├── SKILL.md              # スキルの説明と使い方
    ├── references/
    │   └── common-errors.md  # よくあるエラーと解決策
    └── templates/
        └── article-template.md  # 記事テンプレート
```

### 実装例: Zenn記事Lintスキル

[`.github/skills/zenn-article-lint/SKILL.md`](https://github.com/ricckyyy/zenn-articles/blob/main/.github/skills/zenn-article-lint/SKILL.md)：

### 使用例

Skillを使うと、複雑なタスクが自動化されます。

1. 「記事をlintして」と依頼
2. AIが依頼内容を解釈し、zenn-article-lint Skillを選択
3. `npm run lint:md` を自動実行
4. エラーを検出・解決策を提示
5. 自動修正コマンド (`npm run lint:md:fix`) を提案

**スキルの呼び出し方（GitHub Copilot）：**

1. **自動発動** — `description` に近い言葉で依頼するとCopilotが自動で使う

   ```text
   「記事をlintして」      → /zenn-article-lint が発動
   ```

2. **直接呼び出し** — Copilot Chatで `/` と入力するとスキル一覧が表示される

   ```text
   /zenn-article-lint
   ```

### Claude Codeでの使い方

> **✅ ネイティブ対応**

Claude CodeはAgent Skills仕様に完全対応しています。

**スキルの配置場所：**

| パス | 対象 |
| ---- | ---- |
| `.github/skills/` | GitHub Copilot・Claude Code **両方で使える**（推奨） |
| `.claude/skills/` | Claude Code専用（プロジェクト） |
| `~/.claude/skills/` | Claude Code専用（個人・全プロジェクト共通） |

**`.github/skills/` に置けば1つのSkillを両AIで共有できます。**

**スキルの呼び出し方（Claude Code）：**

1. **自動発動** — `description` に近い言葉で依頼するとAIが自動で使う

   ```text
   「記事をlintして」      → /zenn-article-lint が発動
   「新規記事作りたい」    → /new-article が発動
   「記事をレビューして」  → /article-review が発動
   ```

2. **直接呼び出し** — チャットで `/` と入力するとスキル一覧が表示される

   ```text
   /zenn-article-lint
   /new-article
   /article-review
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

### Claude Codeでの使い方

> **△ 別の仕組みで同等機能を実現**

Claude Codeには独自のサブエージェント機能があります。SkillのフロントマターにCopilot Agentsと異なるアプローチで自律実行を実現できます。

```yaml
---
name: publish-article
description: 記事を公開する
context: fork       # サブエージェントとして実行
agent: general-purpose
disable-model-invocation: true  # 手動のみ（誤爆防止）
---

記事を公開する手順を実行してください：
1. Lintエラーチェック
2. 画像リンク切れチェック
3. published: true に変更
4. mainへマージしてプッシュ
```

MCPサーバー不要で、個人利用でもすぐに使えます。

---

## 5. Hooks（自動トリガー）

### 概要

**イベント発生時に自動実行される処理**

git commitやpushなどのイベントで自動的に品質チェックを実行します。

> **⚠️ 重要：Git HooksはAI機能ではありません**
>
> Hooksは通常のGit hooksスクリプトで、GitHub CopilotやAIとは無関係です。
> この記事では、GitHub Copilot環境と組み合わせて使える開発ツールとして紹介しています。

### 特徴

- ✅ 自動実行なので忘れない
- ✅ git hooksやGitHub Actionsと連携
- ✅ チーム全体で品質を担保
- ⚠️ AIは使わず、シェルスクリプトで動作

### 実装例: Pre-commit Hook

[`.github/hooks/pre-commit`](https://github.com/ricckyyy/zenn-articles/blob/main/.github/hooks/pre-commit)：

### セットアップ方法

[`.github/hooks/README.md`](https://github.com/ricckyyy/zenn-articles/blob/main/.github/hooks/README.md)：

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

### Claude Codeでの使い方

> **✅ Git hooksはそのまま使える**

Git hooksはAI非依存のシェルスクリプトなので、Claude Codeでも完全にそのまま機能します。

加えて、Claude Code固有の **Hooks機能**（ツールイベントに反応するHooks）も別途存在します。
こちらはAIのツール実行（ファイル読み書き、コマンド実行など）をトリガーにできます。
`~/.claude/settings.json` またはプロジェクトの `.claude/settings.json` に記述します。

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write",
      "hooks": [{ "type": "command", "command": "npm run lint:md" }]
    }]
  }
}
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
    │   ├── new-article.prompt.md
    │   └── article-review.prompt.md
    ├── skills/
    │   └── zenn-article-lint/
    └── hooks/
        └── pre-commit
```

### 実装例

[`.github/plugins/zenn-workflow/README.md`](https://github.com/ricckyyy/zenn-articles/blob/main/.github/plugins/zenn-workflow/README.md)：

## 使い方

### 新規記事作成

1. `prompts/new-article.prompt.md` をCopilot Chatに貼り付け
2. 記事テーマを伝える
3. 自動的にブランチ作成・ファイル生成

### 記事レビュー

1. `prompts/article-review.prompt.md` をCopilot Chatに貼り付け
2. 記事ファイルを指定
3. チェックリストに沿ってレビュー実行

### 品質チェック

- コミット時に自動でLint実行（hook）
- 手動でlintしたい場合は「記事をlintして」と依頼（skill）

### Claude Codeでの使い方

> **△ 独自のPlugin機能がある（パスが異なる）**

Claude Codeにも独自のPlugin機能があります。SkillsをPluginとしてパッケージ化して配布できます。

| ツール | プラグインパス |
| ------ | -------------- |
| GitHub Copilot | `.github/plugins/` |
| Claude Code | `.claude/plugins/` |

`.github/plugins/` の中の Skills（`.github/skills/`）は共有できますが、
Prompts部分はClaude Code用に `.claude/skills/` へ移植が必要です。

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

- [`.github/recipes/zenn-cli-commands.md`](https://github.com/ricckyyy/zenn-articles/blob/main/.github/recipes/zenn-cli-commands.md)
- [`.github/recipes/zenn-markdown-snippets.md`](https://github.com/ricckyyy/zenn-articles/blob/main/.github/recipes/zenn-markdown-snippets.md)

### 使用方法

Recipesはリファレンスとして活用します。

1. `.github/recipes/zenn-cli.md` をエディタで開く
2. 必要なコマンドやコードを探す
3. コピーしてターミナルやエディタに貼り付け
4. 必要に応じてパラメータを変更して実行

> **⚠️ 重要：RecipesはAI機能ではありません**
>
> Recipesは人間が参照するためのコードスニペット／コマンド集です。
> Copilotが自動的に実行・解釈したり、判断を行ったりすることはありません。
> `.github/recipes/` 内のファイルは手動で開いて必要な部分をコピーして使ってください。

**💡 Recipesの活用シーン**

- 「あのコマンド何だっけ？」というときの早見表
- 新メンバーへのオンボーディング資料
- コマンド実行のベストプラクティス集
- プロジェクト固有の運用ルールの記録

### Claude Codeでの使い方

> **✅ そのまま使える**

RecipesはAI非依存の手動参照ドキュメントなので、Claude Codeでもそのまま使えます。
さらに、`CLAUDE.md` からRecipesファイルを参照させることで、Claude Codeが自動的に内容を把握して提案に活かすことも可能です。

---

## 全体のディレクトリ構成

7つ全てを導入した最終的なディレクトリ構成：

```text
.github/
├── copilot-instructions.md       # 1. Instructions（Copilot用）
├── prompts/                       # 2. Prompts（Copilot用）
│   ├── new-article.prompt.md
│   └── article-review.prompt.md
├── skills/                        # 3. Skills（Copilot・Claude Code 共通）
│   └── zenn-article-lint/
│       ├── SKILL.md
│       └── references/
│           └── common-errors.md
├── hooks/                         # 5. Hooks（Git hooks・AI非依存）
│   ├── pre-commit
│   └── README.md
├── plugins/                       # 6. Plugins（Copilot用）
│   └── zenn-workflow/
│       ├── README.md
│       ├── prompts/ → symlink
│       ├── skills/ → symlink
│       └── hooks/ → symlink
└── recipes/                       # 7. Recipes（AI非依存・共通）
    └── zenn-cli.md

CLAUDE.md                          # 1. Instructions（Claude Code用）

.claude/
├── skills/                        # 3. Skills（Claude Code専用追加分）
│   └── new-article/
│       └── SKILL.md               # Promptsの代替
└── settings.json                  # 5. Hooks（Claude Code固有）

# 4. Agents は将来的に追加（Copilot: MCP対応後 / Claude Code: context:fork で代替可）
```

---

## Claude Code対応まとめ

| 機能 | Claude Code対応 | 代替方法・備考 |
| ---- | --------------- | -------------- |
| **Instructions** | ✅ | `CLAUDE.md` を使う |
| **Prompts** | △ | `.claude/skills/` に移植すれば `/` で呼び出せる |
| **Skills** | ✅ | `.github/skills/` で両AI共有可能 |
| **Agents** | △ | Skillの `context: fork` でサブエージェント実行 |
| **Hooks（Git）** | ✅ | Git hooksはAI非依存なのでそのまま使える |
| **Hooks（AI）** | ✅ | `.claude/settings.json` でツールイベントHooksを設定 |
| **Plugins** | △ | `.claude/plugins/` で独自Plugin機能あり |
| **Recipes** | ✅ | 手動参照なのでそのまま使える |

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

この記事では、GitHub Copilotの7つの拡張機能を実際にZenn記事執筆リポジトリに導入しながら、Claude Codeでの対応状況も合わせて解説しました。

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

GitHub CopilotとClaude Code、それぞれの強みを活かしながらこれらの機能を組み合わせることで、開発体験が大きく向上します。
まずは小さく始めて、徐々に拡張していきましょう！

---

## 参考リンク

- [GitHub Copilot Awesome - Skills](https://github.com/github/awesome-copilot/blob/main/docs/README.skills.md)
- [Agent Skills Specification](https://agentskills.io/specification)
- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [Claude Code Skills](https://code.claude.com/docs/en/skills)
- [Claude Code Hooks](https://code.claude.com/docs/en/hooks)
- [Zenn CLI Guide](https://zenn.dev/zenn/articles/zenn-cli-guide)

---

この記事が、GitHub Copilot・Claude Codeエコシステムの理解と活用の助けになれば幸いです！
