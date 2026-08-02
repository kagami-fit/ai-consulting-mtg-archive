# AI Consulting MTG Archive

## 一言で言うと

AIコンサルティングの会議動画と文字起こし要約を、クライアントごと・日付ごとに見返せる静的HTMLの会員サイト風アーカイブです。YouTubeまたはGoogle Driveの動画URLを入れると、各MTG詳細に動画・要約・アクション・図解をまとめて表示できます。

## 何ができるのか

- クライアント別のMTG記録を日付順に一覧表示
- YouTube / Google Drive動画の埋め込み表示
- 文字起こしから作った要約、決定事項、課題、次回アクションを表示
- 文字起こし全文をクライアント共有用ページとして表示
- アクション状態を `未着手 / 進行中 / 確認待ち / 完了` でその場切り替え
- AIで作成した図解画像をMTGに紐づけて表示
- クライアント共有用の調査資料・テンプレートをMTGに紐づけて表示
- 顧客名、テーマ、担当、キーワードで検索
- GitHub Pagesなどで共有用サイトとして公開

## 構成

- `public/index.html` — 閲覧画面のHTML
- `public/styles.css` — ビジネスライクな画面デザイン
- `public/app.js` — 議事録一覧、検索、詳細表示、動画埋め込み、図解拡大表示
- `public/records.json` — MTGデータ本体。今後の会議はここに追記
- `public/records/2026-06-05-ai-real-estate-efficiency-kickoff/diagram.png` — 初回相談・キックオフの図解画像
- `public/records/2026-06-13-ai-consulting-kickoff/diagram.png` — 第1回キックオフMTGの図解画像
- `public/records/2026-06-20-codex-data-knowledge-mtg/diagram.png` — 第2回Codex導入・データ一元管理MTGの図解画像
- `public/records/2026-06-27-knowledge-ai-content-card-mtg/diagram.png` — 第3回ナレッジ管理とAI活用MTGの図解画像
- `public/records/2026-07-04-design-ai-production-mtg/diagram.png` — 第4回デザイン方針とAI制作運用MTGの図解画像
- `public/records/2026-07-12-ai-tools-standardization-mtg/diagram.png` — 第5回AIツール統合・資料標準化MTGの図解画像
- `public/records/2026-07-19-codex-automation-coaching-mtg/diagram.png` — 第6回Codex業務自動化コーチングMTGの図解画像
- `public/records/2026-07-25-knowledge-site-sns-mtg/diagram.png` — 第7回ナレッジ基盤・サイト刷新MTGの図解画像
- `public/records/2026-08-02-knowledge-hp-sns-mtg/diagram.png` — 第8回ナレッジ整理・ホームページ刷新MTGの図解画像
- `public/reports/business-card-ocr-google-drive.html` — クライアント共有用の名刺OCR・Google Drive連携案
- `public/templates/business-card-master-template.csv` — 名刺管理シート用のCSVテンプレート
- `public/transcripts/2026-06-05-ai-real-estate-efficiency-kickoff.html` — 初回相談・キックオフの文字起こし全文ビューア
- `public/transcripts/2026-06-05-ai-real-estate-efficiency-kickoff.txt` — 初回相談・キックオフの文字起こし原文
- `public/transcripts/2026-06-13-ai-consulting-kickoff.html` — 第1回キックオフMTGの文字起こし全文ビューア
- `public/transcripts/2026-06-13-ai-consulting-kickoff.txt` — 第1回キックオフMTGの文字起こし原文
- `public/transcripts/2026-06-20-codex-data-knowledge-mtg.html` — 第2回Codex導入MTGの文字起こし全文ビューア
- `public/transcripts/2026-06-20-codex-data-knowledge-mtg.txt` — 第2回Codex導入MTGの文字起こし原文
- `public/transcripts/2026-06-27-knowledge-ai-content-card-mtg.html` — 第3回ナレッジ管理とAI活用MTGの文字起こし全文ビューア
- `public/transcripts/2026-06-27-knowledge-ai-content-card-mtg.txt` — 第3回ナレッジ管理とAI活用MTGの文字起こし原文
- `public/transcripts/2026-07-04-design-ai-production-mtg.html` — 第4回デザイン方針とAI制作運用MTGのPlaud要約メモビューア
- `public/transcripts/2026-07-04-design-ai-production-mtg.txt` — 第4回デザイン方針とAI制作運用MTGのPlaud要約メモ
- `public/transcripts/2026-07-12-ai-tools-standardization-mtg.html` — 第5回AIツール統合・資料標準化MTGのPlaud要約メモビューア
- `public/transcripts/2026-07-12-ai-tools-standardization-mtg.txt` — 第5回AIツール統合・資料標準化MTGのPlaud要約メモ
- `public/transcripts/2026-07-19-codex-automation-coaching-mtg.html` — 第6回Codex業務自動化コーチングMTGのPlaud要約メモビューア
- `public/transcripts/2026-07-19-codex-automation-coaching-mtg.txt` — 第6回Codex業務自動化コーチングMTGのPlaud要約メモ
- `public/transcripts/2026-07-25-knowledge-site-sns-mtg.html` — 第7回ナレッジ基盤・サイト刷新MTGのPlaud統合要約メモビューア
- `public/transcripts/2026-07-25-knowledge-site-sns-mtg.txt` — 第7回ナレッジ基盤・サイト刷新MTGのPlaud統合要約メモ
- `public/transcripts/2026-08-02-knowledge-hp-sns-mtg.html` — 第8回ナレッジ整理・ホームページ刷新MTGのPlaud統合要約メモビューア
- `public/transcripts/2026-08-02-knowledge-hp-sns-mtg.txt` — 第8回ナレッジ整理・ホームページ刷新MTGのPlaud統合要約メモ
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

新しいMTGを追加するときは、`public/records.json` に1件追加し、必要に応じて `public/records/[record-id]/diagram.png` を置きます。YouTubeまたはGoogle Driveに動画を置いた後は、そのMTGの `videoUrl` にURLを入れるだけで詳細画面に埋め込まれます。

Google Drive動画を使う場合は、Drive側で動画ファイルの共有権限を「リンクを知っている全員が閲覧可」または対象クライアントが閲覧できる設定にします。サイト側では `https://drive.google.com/file/d/.../view` の共有URLを自動で `/preview` 形式に変換して表示します。

アクション状態の切り替えはブラウザのローカル保存です。GitHub Pagesの静的サイトだけで動くため、同じ端末・同じブラウザではリロード後も状態が残ります。複数人で同じ状態を共有する場合は、Google SheetsやFirebaseなどの保存先を追加します。

## 状態

- ルートプロジェクト — 開発中
- `public/` — 稼働中。MTG一覧、検索、詳細表示、動画枠、図解、要約表示を実装済み
- `public/records/` — 稼働中。初回相談、第1回〜第8回MTGの図解画像を配置済み
- `public/reports/` — 稼働中。名刺OCR・Google Drive連携案を配置済み
- `public/templates/` — 稼働中。名刺管理シートCSVテンプレートを配置済み
- `public/transcripts/` — 稼働中。初回相談、第1回〜第3回MTGの文字起こし全文、第4回〜第8回MTGのPlaud要約メモを配置済み
- `server/` — 稼働中。ローカル確認用サーバーとして実装済み
- GitHub Pages公開 — 稼働中。`https://kagami-fit.github.io/ai-consulting-mtg-archive/` で公開
