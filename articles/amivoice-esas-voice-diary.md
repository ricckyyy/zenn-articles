---
title: "AmiVoice ESASで作る感情音声日記 ─ ハマりポイントと2フェーズ設計"
emoji: "🎙"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["amivoice", "nextjs", "prisma", "vercel"]
published: false
---

## 作ったもの

毎日30秒話しかけるだけで、文字起こしと感情スコアが記録される「感情音声日記」を作りました。

**デモ：** <https://emotion-voice-diary.vercel.app>
（「デモでログイン」ボタンで認証なしで試せます）

録音を止めると3秒でテキストが表示され、50秒ほどで感情の20本バーが入ってきます。

**技術スタック：**

- Next.js 16（App Router）
- AmiVoice API（音声認識 + ESAS感情解析）
- Neon PostgreSQL + Prisma v7
- Vercel

---

## AmiVoice ESASとは

AmiVoiceの感情解析（ESAS）は、声の音響特徴から20種類の心理状態をスコア化します。

<!-- markdownlint-disable MD013 -->
| パラメータ | 日本語 | 範囲 |
| --- | --- | --- |
| `stress` | ストレス | 0–100 |
| `energy` | エネルギー | 0–100 |
| `confidence` | 自信 | 0–30 |
| `excitement` | 興奮 | 0–30 |
| `hesitation` | 躊躇 | 0–30 |
| `anticipation` | 期待 | 0–100 |
| … | （全20項目） | |
<!-- markdownlint-enable MD013 -->

日記アプリとの相性が良く、「今日の自分の状態を声から可視化する」というコンセプトで実装しました。

---

## ハマりポイント3選

### 1. パラメータ名が違った

最初、ドキュメントを読まずに推測で実装したら全スコアが0になりました。

```typescript
// ❌ 間違い（推測で書いた）
joy: avg("p_joy", 30),
stress: avg("p_stress", 100),
```

正しいキー名はパラメータ定義エンドポイントで確認できます。

<!-- markdownlint-disable MD013 -->
```bash
curl https://acp-dsrpp.amivoice.com/v1/sentiment-analysis/ja/result-parameters.json \
  -H "Authorization: Bearer YOUR_API_KEY"
```
<!-- markdownlint-enable MD013 -->

```typescript
// ✅ 正しい
joy: avg("content", 30),      // 喜び
stress: avg("stress", 100),   // ストレス
confidence: avg("confidence", 30),
hesitation: avg("hesitation", 30),
```

さらに、値の最大値がパラメータによって異なります（`stress` は100、`confidence` は30）。0〜1に正規化するには個別に割る必要があります。

```typescript
const ESAS_MAX: Record<string, number> = {
  energy: 100, stress: 100, emo_cog: 500,
  concentration: 100, anticipation: 100,
  excitement: 30, hesitation: 30, confidence: 30,
  // ...
};
```

---

### 2. 同期APIでは感情解析が取れない

<!-- markdownlint-disable MD013 -->
AmiVoiceには同期APIと非同期APIがあります。最初は同期API（即座にレスポンスが返る）を使っていましたが、`sentiment_analysis` フィールドが返ってきませんでした。
<!-- markdownlint-enable MD013 -->

```bash
# 同期API → sentiment_analysis が null
curl -X POST https://acp-api.amivoice.com/v1/recognize \
  -F "d=grammarFileNames=-a-general sentimentAnalysis=True" ...
# → { "text": "...", "sentiment_analysis": null }
```

ドキュメントを確認したところ、こう書いてありました：

> 感情分析は、非同期 HTTP インタフェース のみに対応

つまり感情解析を使うには **非同期API一択** です。

---

### 3. 非同期APIは50秒かかる

非同期APIはジョブをキューに入れて処理する方式なので、完了まで50秒ほどかかります。ユーザーを50秒待たせるのは論外なので、**2フェーズ方式**で解決しました。

---

## 2フェーズ設計

```text
フェーズ1（3秒）: 同期API → 文字起こし → 日記カード表示
フェーズ2（50秒）: 非同期API → ESAS → 感情バーをアニメーションで更新
```

クライアントは録音停止後すぐに2つのリクエストを並行して投げます。

<!-- markdownlint-disable MD013 -->
```typescript
// record/page.tsx（抜粋）
recorder.onstop = async () => {
  const wav = await blobToWav(raw);

  // フェーズ1: 同期APIで文字起こし（3秒）
  const fd1 = new FormData();
  fd1.append("audio", wav, "audio.wav");
  const { transcript } = await fetch("/api/record", { method: "POST", body: fd1 }).then(r => r.json());

  // 日記を即保存・表示
  const { entry } = await fetch("/api/diary", {
    method: "POST",
    body: JSON.stringify({ transcript, esas: null, esasRaw: {}, recordedAt: new Date().toISOString() }),
  }).then(r => r.json());
  setEntry(entry);
  setEsasLoading(true); // バーをパルスアニメーションに

  // フェーズ2: 非同期APIで感情解析（バックグラウンド）
  const fd2 = new FormData();
  fd2.append("audio", wav, "audio.wav");
  const { esas, esasRaw } = await fetch("/api/esas", { method: "POST", body: fd2 }).then(r => r.json());

  // エントリを感情スコアで更新
  await fetch(`/api/entries/${entry.id}`, {
    method: "PATCH",
    body: JSON.stringify({ esasStress: esas.stress, esasRaw }),
  });
  setEntry(prev => ({ ...prev, esasRaw }));
  setEsasLoading(false);
};
```
<!-- markdownlint-enable MD013 -->

`/api/esas` はサーバーサイドでポーリングして完了を待ちます。クライアントからは1リクエストで済みます。

```typescript
// app/api/esas/route.ts
export const maxDuration = 150;

export async function POST(req: Request) {
  const { esas, esasAll } = await recognizeEsas(audio, apiKey);
  return NextResponse.json({ esas, esasRaw: esasAll });
}
```

<!-- markdownlint-disable MD013 -->
```typescript
// lib/amivoice.ts（サーバーサイドポーリング）
export async function recognizeEsas(wav: Buffer, apiKey: string) {
  const { sessionid } = await submitAsyncJob(wav, apiKey);

  for (let i = 0; i < 60; i++) {
    await sleep(2000);
    const data = await pollJob(sessionid, apiKey);
    if (data.status !== "completed") continue;

    // 全20パラメータを0-1に正規化して返す
    const esasAll: Record<string, number> = {};
    for (const [key, max] of Object.entries(ESAS_MAX)) {
      esasAll[key] = avgSegments(data.sentiment_analysis.segments, key, max);
    }
    return { esas: { stress: esasAll.stress, excitement: esasAll.excitement }, esasAll };
  }
}
```
<!-- markdownlint-enable MD013 -->

---

## その他の技術的な発見

### Next.js 16: middleware.ts が廃止

Next.js 16 では `middleware.ts` が廃止され、ルートに `proxy.ts` を置く方式に変わっています。

```typescript
// proxy.ts（ルート直下）
export async function proxy(request: NextRequest) {
  const session = await auth();
  if (!session && !isPublic(request)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}
```

<!-- markdownlint-disable MD013 -->
`middleware.ts` と `proxy.ts` が両方 git に存在すると Vercel がエラーになるので注意（`rm` だけでなく `git rm` が必要）。
<!-- markdownlint-enable MD013 -->

### Prisma v7: Driver Adapter 必須

Prisma v7 から `new PrismaClient()` が引数なしで動かなくなりました。pg の Driver Adapter が必須です。

```typescript
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
```

<!-- markdownlint-disable MD013 -->
また、CLI（migrate、seed）用に `prisma.config.ts` が必要で、`.env.local` は自動で読まれないため `dotenv` で明示的にロードします。
<!-- markdownlint-enable MD013 -->

```typescript
// prisma.config.ts
import { config } from "dotenv";
config({ path: ".env.local", override: true });

import { defineConfig } from "prisma/config";
export default defineConfig({ ... });
```

### NextAuth v5: Edge Runtime でPrismaが使えない

`proxy.ts`（Edge Runtime）では Prisma と bcrypt がインポートできません。設定ファイルを分割する必要があります。

```text
lib/auth.config.ts  ← Edge用（providers なし、Prisma なし）
lib/auth.ts         ← サーバー用（Credentials、Prisma、bcrypt）
```

---

## まとめ

AmiVoice ESASは声から豊かな感情情報を取れる面白いAPIですが、使いこなすにはいくつかのコツがあります。

- **パラメータ名はドキュメントAPIで確認する**（推測で書くと全部0）
- **感情解析は非同期APIのみ**（同期APIでは取れない）
- **50秒の遅延は2フェーズ設計で体感をゼロにできる**

Next.js 16 / Prisma v7 / NextAuth v5 はいずれも breaking changes が多く、古い記事が参考にならないケースがありました。この記事が同じスタックで作る方の参考になれば幸いです。

---

**ソースコード：** <https://github.com/ricckyyy/emotion-voice-diary>
