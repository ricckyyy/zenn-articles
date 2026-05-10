---
title: "Spec KitでAI駆動開発を始める：Claude CodeとGitHub Copilot両対応ガイド"
emoji: "📋"
type: "tech"
topics: ["speckit", "claudecode", "githubcopilot", "ai", "開発効率化"]
published: true
---

## はじめに

[Spec Kit](https://github.com/github/spec-kit) は、AIエージェントと協調しながら「仕様 → 計画 → 実装」を体系的に進めるオープンソースのフレームワークです。

**Claude Code**（Anthropicが提供するCLIエージェント）と **GitHub Copilot**（VS Code拡張）の両方で使えるのが大きな特徴で、チーム内でツールが混在していても同じワークフローを共有できます。

この記事では、Spec Kitのセットアップから実際の使い方まで、ゼロから解説します。

## Spec Kitとは

Spec Kitは次の流れでAIに開発を支援させるためのスキャフォールディングです。

```text
仕様化（specify）→ 明確化（clarify）→ 計画（plan）→ タスク生成（tasks）→ 実装（implement）
```

各ステップでMarkdownのドキュメント（`spec.md` / `plan.md` / `tasks.md`）が生成され、AIがそれを参照しながら作業を進めます。ドキュメントがそのままAIへのコンテキストになるため、**会話が長くなっても意図がブレにくい**のがメリットです。

## セットアップ

### 前提条件

- [uv](https://docs.astral.sh/uv/)（Pythonパッケージ管理ツール）
- Claude Code または GitHub Copilot（VS Code拡張）

### 新規プロジェクトへの導入

```bash
# uv 未導入の場合
curl -LsSf https://astral.sh/uv/install.sh | sh

# プロジェクトを初期化（新規ディレクトリ作成）
uvx --from git+https://github.com/github/spec-kit.git specify init <project-name>

# 既存ディレクトリで初期化する場合
cd /path/to/existing-project
uvx --from git+https://github.com/github/spec-kit.git specify init --here
```

初期化時に使用するAIエージェントを選択します。後から追加することも可能です。

```bash
# どちらか一方で初期化してから、もう一方を追加する
uvx --from git+https://github.com/github/spec-kit.git specify init <project-name>
uvx --from git+https://github.com/github/spec-kit.git specify add claude
uvx --from git+https://github.com/github/spec-kit.git specify add copilot
```

### 生成されるファイル構成

```text
.specify/
  integration.json          # 統合設定（使用するAIエージェント）
  integrations/
    claude.manifest.json    # Claude Code 用マニフェスト
    copilot.manifest.json   # Copilot 用マニフェスト
  scripts/                  # セットアップスクリプト
  templates/                # ドキュメントテンプレート
.claude/skills/             # Claude Code 用スキル定義
.github/
  agents/                   # Copilot 用エージェント定義（*.agent.md）
  prompts/                  # Copilot 用プロンプト定義（*.prompt.md）
  copilot-instructions.md   # Copilot 全体の指示
CLAUDE.md                   # Claude Code 用プロジェクト指示
```

## 使い方

### スラッシュコマンドの対応表

<!-- markdownlint-disable MD013 -->
| ワークフロー | Claude Code | GitHub Copilot |
| ------------ | ----------- | -------------- |
| プロジェクト原則の定義 | `/speckit-constitution` | `/speckit.constitution` |
| 仕様書の作成 | `/speckit-specify` | `/speckit.specify` |
| 仕様の明確化 | `/speckit-clarify` | `/speckit.clarify` |
| 実装計画の作成 | `/speckit-plan` | `/speckit.plan` |
| タスク一覧の生成 | `/speckit-tasks` | `/speckit.tasks` |
| 整合性チェック | `/speckit-analyze` | `/speckit.analyze` |
| 実装の実行 | `/speckit-implement` | `/speckit.implement` |
| チェックリスト生成 | `/speckit-checklist` | `/speckit.checklist` |
| GitHub Issue への変換 | `/speckit-taskstoissues` | `/speckit.taskstoissues` |
<!-- markdownlint-enable MD013 -->

Claude Code はハイフン区切り（`speckit-xxx`）、Copilot はドット区切り（`speckit.xxx`）です。

### ステップ1: プロジェクト原則を定義する

まず `/speckit-constitution` を実行して、プロジェクトのコーディング規約・品質基準・技術的な制約を定義します。

```text
/speckit-constitution
```

対話形式で質問に答えると、プロジェクトの原則がドキュメントに記録されます。一度設定すれば、以降のすべてのステップでAIがこの原則を参照します。

### ステップ2: 機能仕様を作成する

```text
/speckit-specify ユーザーがメールアドレスとパスワードでログインできる認証機能を追加する
```

このコマンドで `spec.md` が生成されます。自然言語で機能の概要を伝えるだけで、AIが構造化された仕様書に変換します。

### ステップ3: 仕様を明確化する（任意）

```text
/speckit-clarify
```

仕様の曖昧な部分をAIが最大5つの質問で洗い出します。回答内容は `spec.md` に自動的に反映されます。

### ステップ4: 実装計画を立てる

```text
/speckit-plan
```

`spec.md` をもとに、使用技術・アーキテクチャ・実装方針を決めた `plan.md` が生成されます。

### ステップ5: タスク一覧を生成する

```text
/speckit-tasks
```

`plan.md` から依存順に並んだ `tasks.md` が生成されます。各タスクは具体的な実装単位になっています。

### ステップ6: 整合性をチェックする（任意）

```text
/speckit-analyze
```

`spec.md`・`plan.md`・`tasks.md` の3ドキュメント間の矛盾や抜け漏れを非破壊でチェックします。実装前の最終確認として使うのがおすすめです。

### ステップ7: 実装する

```text
/speckit-implement
```

`tasks.md` のタスクを順番に実行します。各タスクが完了するたびにチェックが入り、進捗が可視化されます。

## Claude Code と Copilot を共存させる

<!-- markdownlint-disable MD013 -->
`integration.json` で両方を `installed_integrations` に登録すれば、同じリポジトリでどちらのツールからでも Spec Kit を使えます。
<!-- markdownlint-enable MD013 -->

```json
{
  "installed_integrations": ["claude", "copilot"],
  "integration_settings": {
    "claude": { "script": "sh", "invoke_separator": "-" },
    "copilot": { "script": "sh", "invoke_separator": "." }
  }
}
```

同じ `spec.md` / `plan.md` / `tasks.md` を共有するので、**Claude Code で仕様を書いて、Copilot で実装する**といった使い分けも自然にできます。

## まとめ

<!-- markdownlint-disable MD013 -->
| 項目 | 内容 |
| ---- | ---- |
| セットアップ | `uvx specify init` で数分 |
| 対応ツール | Claude Code / GitHub Copilot（同一リポジトリで共存可） |
| ワークフロー | constitution → specify → clarify → plan → tasks → analyze → implement |
| ドキュメント | `spec.md` / `plan.md` / `tasks.md` が自動生成・更新 |
<!-- markdownlint-enable MD013 -->

仕様駆動でAIに実装させることで、**「何を作るか」と「どう作るか」を明確に分離**できます。チームやプロジェクトの複雑さが増すほど、その恩恵が大きくなります。

Spec Kitの詳細は公式リポジトリ [github/spec-kit](https://github.com/github/spec-kit) を参照してください。
