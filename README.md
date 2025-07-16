# Hono Blog

Hono と microCMS を使用した Cloudflare Workers 上で動作するブログサイトです。

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. microCMS の設定

1. [microCMS](https://microcms.io/) でアカウントを作成
2. 新しいサービスを作成
3. "posts" という API を作成し、以下のフィールドを設定：
   - title (テキスト) - 必須
   - content (リッチエディタ) - 必須  
   - summary (テキスト) - オプション
   - slug (テキスト) - オプション

### 3. 環境変数の設定

wrangler.toml の環境変数を設定：

```toml
[env.production.vars]
MICROCMS_SERVICE_DOMAIN = "your-service-domain"
MICROCMS_API_KEY = "your-api-key"
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

### 5. デプロイ

```bash
npm run deploy
```

## 機能

- 記事一覧表示
- 記事詳細表示
- レスポンシブデザイン
- microCMS との連携

## ファイル構成

```
src/
├── index.ts        # メインアプリケーション
├── microcms.ts     # microCMS クライアント
└── types.ts        # 型定義
```

## API 仕様

### microCMS に期待する posts API の構造

```json
{
  "id": "string",
  "title": "string",
  "content": "string", 
  "publishedAt": "string",
  "updatedAt": "string",
  "createdAt": "string",
  "revisedAt": "string",
  "slug": "string (optional)",
  "summary": "string (optional)"
}
```