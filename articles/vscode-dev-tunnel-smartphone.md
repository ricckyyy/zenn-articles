---
title: "VS Code のポートタブだけでスマホ実機テスト環境が整う【Dev Tunnel】"
emoji: "📱"
type: "tech"
topics: ["vscode", "devtunnel", "javascript", "frontend"]
published: true
---

## 課題

スマホの実機でローカルの開発サーバーを確認したいとき、意外と面倒だと感じたことはないでしょうか。

- 同一 Wi-Fi に繋がっていないとアクセスできない
- mkcert で HTTPS を用意しようとすると、スマホ側に証明書をインストールする手間がある
- ngrok は無料プランだと接続数やセッション時間に制限がある

そんなときに便利なのが、VS Code に内蔵されている **Dev Tunnel** です。

## Dev Tunnel とは

Dev Tunnel は Microsoft が提供するトンネリングサービスです。
VS Code に標準搭載されているため、CLI のインストールは不要です。
ローカルのポートを `https://xxx.devtunnels.ms` という URL に転送してくれるので、
HTTPS も自動で付与されます。

## 手順

### 1. ポートタブを開く

VS Code 下部のパネルから「ポート」タブを選択します。ターミナルの隣にあります。

### 2. ポートを転送する

「ポートの転送」ボタン（または `+` アイコン）をクリックし、転送したいポート番号を入力します。

```text
例: 3000
```

### 3. 生成された URL をスマホで開く

「転送されたアドレス」列に `https://xxx.devtunnels.ms` 形式の URL が表示されます。
この URL をそのままスマホのブラウザで開くだけです。

![alt text](/images/vscode-dev-tunnel-smartphone/image.png)

Public の場合は Microsoft の警告画面が表示されるので「続行」を押せばアクセスできます。
サインインは不要です。

## Public / Private の使い分け

ポートタブの「可視性」列から切り替えられます。

- **Private（デフォルト）**：スマホ側で GitHub または Microsoft アカウントへのサインインが必要。
  トンネルを作成した PC 側と同じアカウントでサインインしてください。
  チーム内での確認に向いています。
- **Public**：警告画面を経由するだけで誰でもアクセス可能。手軽ですが、
  開発中のアプリが外部に公開される点は注意してください。

## ngrok / mkcert との比較

| | Dev Tunnel | ngrok（無料） | mkcert |
| --- | --- | --- | --- |
| インストール | 不要（VS Code 内蔵） | CLI が必要 | CLI が必要 |
| HTTPS | 自動 | 自動 | 自己署名証明書 |
| スマホ側の設定 | Private: 同アカウントでログイン / Public: 警告画面のみ | なし | 証明書のインストールが必要 |
| アクセス制御 | Private: 作成者と同アカウントのみ（デフォルト） | デフォルトで認証なし（要別途設定） | ローカルのみ |
| 制限 | 特になし | セッション数・時間制限あり | なし |

VS Code を普段使いしているなら、Dev Tunnel が一番セットアップコストが低いと思います。

## まとめ

- CLI のインストール不要、VS Code のポートタブから数クリックで使えます
- HTTPS が自動で付与されるので、カメラ・マイクなど HTTPS が必須な API の動作確認にも使えます
- スマホ実機テストのファーストチョイスとして重宝しています

## 参考

- [Port forwarding with dev tunnels - Visual Studio Code](https://code.visualstudio.com/docs/debugtest/port-forwarding)
- [Dev tunnels security - Microsoft Learn](https://learn.microsoft.com/azure/developer/dev-tunnels/security)
- [Dev tunnels FAQ - Microsoft Learn](https://learn.microsoft.com/azure/developer/dev-tunnels/faq)
