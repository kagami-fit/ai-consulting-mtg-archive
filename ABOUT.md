# AI Consulting MTG Archive

## 一言で言うと

AIコンサルティングの会議動画と文字起こし要約を、クライアントごと・日付ごとに見返せる静的HTMLの会員サイト風アーカイブです。YouTube動画URLを入れると、各MTG詳細に動画・要約・アクション・図解をまとめて表示できます。

## 何ができるのか

- クライアント別のMTG記録を日付順に一覧表示
- YouTube動画の埋め込み表示
- 文字起こしから作った要約、決定事項、課題、次回アクションを表示
- AIで作成した図解画像をMTGに紐づけて表示
- クライアント共有用の調査資料・テンプレートをMTGに紐づけて表示
- 顧客名、テーマ、担当、キーワードで検索
- GitHub Pagesなどで共有用サイトとして公開

## 構成

- `public/index.html` — 閲覧画面のHTML
- `public/styles.css` — ビジネスライクな画面デザイン
- `public/app.js` — 議事録一覧、検索、詳細表示、動画埋め込み、図解拡大表示
- `public/records.json` — MTGデータ本体。今後の会議はここに追記
- `public/records/2026-06-20-ai-consulting-kickoff/diagram.png` — キックオフMTGの図解画像
- `public/reports/business-card-ocr-google-drive.html` — クライアント共有用の名刺OCR・Google Drive連携案
- `public/templates/business-card-master-template.csv` — 名刺管理シート用のCSVテンプレート
- `server/index.js` — ローカル確認用の読み取り専用Expressサーバー
- `.github/workflows/pages.yml` — GitHub Pages公開用ワークフロー

## 使い方

```bash
cd "/Users/hayatokagami/Documents/New project/ai-consulting-mtg-archive"
npm install
npm run dev
```

起動後、ブラウザで以下を開きます。

```text
http://localhost:3000
```

新しいMTGを追加するときは、`public/records.json` に1件追加し、必要に応じて `public/records/[record-id]/diagram.png` を置きます。YouTubeに動画をアップロードした後は、そのMTGの `videoUrl` にURLを入れるだけで詳細画面に埋め込まれます。

## 状態

- ルートプロジェクト — 開発中
- `public/` — 稼働中。MTG一覧、検索、詳細表示、動画枠、図解、要約表示を実装済み
- `public/records/` — 稼働中。AIコンサルティング キックオフMTGの図解画像を配置済み
- `public/reports/` — 稼働中。名刺OCR・Google Drive連携案を配置済み
- `public/templates/` — 稼働中。名刺管理シートCSVテンプレートを配置済み
- `server/` — 稼働中。ローカル確認用サーバーとして実装済み
- GitHub Pages公開 — 稼働中。`https://kagami-fit.github.io/ai-consulting-mtg-archive/` で公開
