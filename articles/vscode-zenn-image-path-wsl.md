---
title: "WSL+VS CodeでZenn記事の画像パスを自動修正するmarkdownlintカスタムルール"
emoji: "🔧"
type: "tech"
topics: ["zenn", "vscode", "wsl", "markdownlint"]
published: true
---

## はじめに

Zennで記事を書く際、画像パスは `/images/` から始まる絶対パスで指定する必要があります。しかし、VS Code標準の画像貼り付け機能では相対パス `../images/` が生成されてしまい、毎回手動で修正するのは面倒。

できれば、貼り付けるときに絶対パスにしたがったのですが、WSL環境ではできなかったです。
WSL環境では、Markdown用の画像貼り付け拡張機能がクリップボードの画像を認識できないという問題もあります。

この記事では、**markdownlintのカスタムルール**を使って、ESLintのように自動でエラー検出・修正する方法を紹介します。

## 問題の詳細

### Zennの画像パス要件

Zennでは、画像は以下のように指定する必要があります：

```markdown
![alt text](/images/article-name/image.png)
```

### VS Codeの標準動作

VS Codeでスクリーンショットを貼り付けると：

```markdown
![alt text](../images/article-name/image.png)  # 相対パス
```

このままではZennで表示されません。

### WSL環境での追加問題

- Markdown Paste などの拡張機能がクリップボードの画像を認識できない
- `xclip` をインストールしてもWSL-Windows間のクリップボード共有に問題がある

## 解決策：markdownlintカスタムルール

### 1. 必要なパッケージのインストール

```bash
npm install --save-dev markdownlint-cli2 @types/markdownlint
```

VS Code拡張機能もインストール：

```
davidanson.vscode-markdownlint
```

### 2. カスタムルールの作成

`.markdownlint/rules/image-path-rule.js` を作成：

```javascript
// @ts-check

"use strict";

/**
 * @typedef {import('markdownlint').Rule} Rule
 */

/**
 * Zenn用カスタムルール: 画像パスは /images/ から始まる必要がある
 * @type {Rule}
 */
module.exports = {
  names: ["zenn-image-path"],
  description: "Images must use absolute path starting with /images/",
  tags: ["images"],
  function: function rule(params, onError) {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    
    params.lines.forEach((line, lineIndex) => {
      let match;
      imageRegex.lastIndex = 0;
      
      while ((match = imageRegex.exec(line)) !== null) {
        const imagePath = match[2];
        const lineNumber = lineIndex + 1;
        
        // 相対パス ../images/ をチェック
        if (imagePath.includes("../images/")) {
          onError({
            lineNumber: lineNumber,
            detail: `相対パス "${imagePath}" は使用できません。"/images/" から始まる絶対パスを使用してください。`,
            context: match[0],
            fixInfo: {
              lineNumber: lineNumber,
              editColumn: match.index + 1,
              deleteCount: match[0].length,
              insertText: match[0].replace("../images/", "/images/")
            }
          });
        }
        
        // images/ で始まるパスもチェック（/ がない）
        if (imagePath.startsWith("images/") && !imagePath.startsWith("/images/")) {
          onError({
            lineNumber: lineNumber,
            detail: `パス "${imagePath}" は "/images/" から始める必要があります。`,
            context: match[0],
            fixInfo: {
              lineNumber: lineNumber,
              editColumn: match.index + 1,
              deleteCount: match[0].length,
              insertText: match[0].replace(/^images\//, "/images/")
            }
          });
        }
      }
    });
  }
};
```

### 3. 設定ファイルの作成

`.markdownlintrc` をプロジェクトルートに作成：

```json
{
  "default": true,
  "MD033": false,
  "MD041": false,
  "customRules": [".markdownlint/rules/image-path-rule.js"]
}
```

`.vscode/settings.json` に追加：

```json
{
  "markdownlint.config": {
    "default": true,
    "MD033": false,
    "MD041": false
  },
  "markdownlint.customRules": [
    "${workspaceFolder}/.markdownlint/rules/image-path-rule.js"
  ]
}
```

### 4. npm scriptsの追加

`package.json` に追加：

```json
{
  "scripts": {
    "lint:md": "markdownlint-cli2 \"articles/**/*.md\"",
    "lint:md:fix": "markdownlint-cli2 --fix \"articles/**/*.md\""
  }
}
```

## 使い方

### エディタ上でのエラー表示

VS Codeウィンドウをリロード後、Markdownファイルを開くと：

- 相対パス `../images/` の箇所に赤い波線が表示される
- VS Codeの問題でエラーメッセージが確認できる
![alt text](/images/vscode-zenn-image-path-wsl/image.png)
- Quick Fix（Ctrl+. または電球アイコン）で自動修正可能

![alt text](/images/vscode-zenn-image-path-wsl/image-1.png)

### コマンドラインでの使用

```bash
# チェックのみ
npm run lint:md

# 自動修正
npm run lint:md:fix
```

## メリット

✅ **ESLintライクな開発体験**

- エディタ上でリアルタイムにエラー表示
- Quick Fixで即座に修正可能

✅ **自動化**

- コミット前にチェック可能
- CI/CDに組み込める

✅ **WSL環境でも動作**

- クリップボード問題を回避
- 拡張機能に依存しない

✅ **柔軟性**

- ルールのカスタマイズが簡単
- 他のチェックも追加可能

## まとめ

WSL+VS Code環境でZenn記事を書く際の画像パス問題を、markdownlintのカスタムルールで解決しました。

この方法なら：

1. VS Code標準機能で画像を貼り付け
2. 相対パスが自動でエラー表示される
3. Quick Fixまたはコマンドで一括修正

快適なZenn執筆環境を構築できます。

## 参考リンク

- [Zenn CLIで記事・本を管理する](https://zenn.dev/zenn/articles/zenn-cli-guide)
- [markdownlint - GitHub](https://github.com/DavidAnson/markdownlint)
- [markdownlint カスタムルール](https://github.com/DavidAnson/markdownlint/blob/main/doc/CustomRules.md)
