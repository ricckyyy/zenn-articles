# Zenn Workflow Plugin

Zenn記事執筆ワークフローを効率化するための機能セットです。

## 概要

このプラグインは、Zenn記事の執筆・レビュー・公開プロセスを支援する
以下の機能をバンドルしています：

- **Prompts**: 定型作業用のテンプレート
- **Skills**: 自動化された複雑なタスク
- **Hooks**: コミット時の自動チェック
- **Recipes**: よく使うコマンド集

## 含まれる機能

### 📝 Prompts（プロンプトテンプレート）

定型作業をスムーズに実行するためのテンプレート集です。

#### 利用可能なPrompts

1. **`new-article.md`** - 新規記事作成ガイド
   - ブランチ作成〜記事執筆〜公開までの手順
   - Zenn記法のクイックリファレンス

2. **`article-review.md`** - 記事レビューチェックリスト
   - 技術的正確性チェック
   - 文章品質チェック
   - Zenn記法チェック
   - Markdown品質チェック

**使い方**:
```bash
# ファイルを開いて内容をGitHub Copilot Chatにコピペ
code .github/copilot-prompts/new-article.md
```

---

### 🎯 Skills（自動化タスク）

AI が複雑なタスクを自動実行するための機能パックです。

#### 利用可能なSkills

1. **`zenn-article-lint`** - Markdown Lintチェック & 自動修正
   - エラー検出と分類
   - 自動修正可能なものは即座に修正
   - 手動修正が必要なものは提案

**使い方**:
```
GitHub Copilot Chatで「記事をlintして」と依頼
```

**ファイル構成**:
```
.github/copilot-skills/zenn-article-lint/
├── SKILL.md                    # Skill定義
└── references/
    └── common-errors.md        # よくあるエラーと修正方法
```

---

### 🪝 Hooks（自動実行トリガー）

Git操作時に自動でチェックを実行します。

#### 利用可能なHooks

1. **`pre-commit`** - コミット前のLintチェック
   - `articles/` の変更を検出
   - Markdownlintを自動実行
   - エラーがあればコミットを中断

**セットアップ**:
```bash
# 実行権限付与
chmod +x .github/hooks/pre-commit

# Hookパス設定
git config core.hooksPath .github/hooks
```

**無効化**:
```bash
# 一時的にスキップ
git commit --no-verify

# 完全に無効化
git config --unset core.hooksPath
```

---

### 📚 Recipes（コピペ用サンプル集）

よく使うコマンドやコードスニペットのリファレンスです。

#### 利用可能なRecipes

1. **`zenn-cli-commands.md`** - Zenn CLIコマンド集
   - 記事作成
   - プレビュー
   - Lintチェック
   - ブランチワークフロー
   - 公開フロー

2. **`zenn-markdown-snippets.md`** - Zenn記法スニペット
   - メッセージ・アコーディオン
   - 画像・コードブロック
   - テーブル・リンクカード
   - フロントマター例

**使い方**:
```bash
# ファイルを開いて必要な部分をコピー
code .github/recipes/zenn-cli-commands.md
```

---

## ディレクトリ構成

```
.github/
├── copilot-instructions.md       # 常時有効なルール（Instructions）
├── copilot-prompts/              # 手動で使うテンプレート
│   ├── new-article.md
│   └── article-review.md
├── copilot-skills/               # AI自動化タスク
│   └── zenn-article-lint/
│       ├── SKILL.md
│       └── references/
│           └── common-errors.md
├── hooks/                        # Git hooks
│   ├── pre-commit
│   └── README.md
└── recipes/                      # コピペ用サンプル
    ├── zenn-cli-commands.md
    └── zenn-markdown-snippets.md
```

---

## 使い方の例

### 新規記事を書く場合

1. **Instructions（自動）**:
   ```
   Copilot: 「新しい記事を書きたい」
   → 自動的に article/トピック名 ブランチ作成
   ```

2. **Prompts（手動）**:
   ```
   new-article.md を開いて手順を確認
   ```

3. **Recipes（参照）**:
   ```
   zenn-markdown-snippets.md を見ながら執筆
   ```

4. **Skills（実行 )**:
   ```
   Copilot: 「記事をlintして」
   → 自動チェック & 修正
   ```

5. **Hooks（自動）**:
   ```
   git commit
   → 自動でLintチェック、エラーあれば中断
   ```

---

## セットアップ

### 1. Instructions（必須）

既に `.github/copilot-instructions.md` で設定済み。
GitHub CopilotとClaudeが自動的に認識します。

### 2. Hooks（推奨）

```bash
chmod +x .github/hooks/pre-commit
git config core.hooksPath .github/hooks
```

### 3. Prompts・Skills・Recipes（必要に応じて）

ファイルを開いて参照するだけで使えます。

---

## カスタマイズ

### Promptsをカスタマイズ

```bash
# 新しいプロンプトを追加
code .github/copilot-prompts/your-prompt.md
```

### Skillsを追加

```bash
# 新しいSkillディレクトリを作成
mkdir -p .github/copilot-skills/your-skill
code .github/copilot-skills/your-skill/SKILL.md
```

### Recipesを追加

```bash
# 新しいレシピを追加
code .github/recipes/your-recipe.md
```

---

## Agentについて

**Agent**は、複数ステップを自律的に実行する高度な機能です。

現在このプラグインには含まれていませんが、将来的に以下のようなAgentの追加を検討できます：

- **Article Publisher Agent**: 記事の検証・Lint・プレビュー・公開を一括実行
- **Image Optimizer Agent**: 画像の最適化とパスチェックを自動化

Agentの実装には MCP (Model Context Protocol) サーバーが必要です。

---

## トラブルシューティング

### Promptsが認識されない

GitHub Copilot Chatで `@workspace` を使って明示的に参照：
```
@workspace .github/copilot-prompts/new-article.md の内容に従って記事を作成
```

### Skillsが動作しない

Skill名またはトリガーワードで明示的に呼び出し：
```
zenn-article-lint Skillを使って記事をチェック
```

### Hooksが実行されない

```bash
# 設定確認
git config core.hooksPath

# 実行権限確認
ls -la .github/hooks/pre-commit

# 権限付与
chmod +x .github/hooks/pre-commit
```

---

## 参考リンク

- [Agent Skills Specification](https://agentskills.io/specification)
- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [Zenn CLI Guide](https://zenn.dev/zenn/articles/zenn-cli-guide)

---

## ライセンス

このプラグインはZenn記事執筆リポジトリの一部として提供されています。
