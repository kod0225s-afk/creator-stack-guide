# Heartbeat 2026-05-14 (Codex引き継ぎ・Claude Code巻き取り)

確認時刻: 2026-05-14 JST

## 巻き取りでローカルに反映したこと

### 1. `data/products.json` の文字化け修復

文字化けしていたフィールドを公開済みサイトのHTMLから逆引きして復元しました。
内容の正本はGitHub Pagesに残っていたため、ローカル側だけを公開済みデプロイ版と一致させた形です。

修復対象（全4製品、4フィールド）:

| product | commission | approval | cookie | watchouts |
| --- | --- | --- | --- | --- |
| pictory | OpenAffiliate情報では20〜50%の継続報酬 | OpenAffiliate情報では即時承認 | OpenAffiliate情報では30日 | 承認後に報酬条件が変わる可能性があります / 生成動画は公開前に人間の確認が必要です |
| heygen | 公式ページでは12か月間20%継続報酬、OpenAffiliateでは25%継続報酬の記載 | 手動審査 | 60日 | 手動審査のため承認まで数日かかる可能性があります / アバター動画は台本の質で成果が大きく変わります |
| descript | 公式ページでは新規サブスク登録ごとに25ドル | 申請審査あり。ヘルプでは承認メールまで最大14日 | 承認後にPartnerStackで確認 | 即時承認ではありません / 固定報酬のため、継続報酬案件より伸びにくい場合があります |
| hypernatural | 初年度20%報酬 | Hypernaturalによると通常1〜2日 | 承認後に管理画面で確認 | 承認は保証されません / 実際のサンプル動画と一緒に紹介した方が伝わりやすいです |

復元の根拠HTMLは `.recovery/*.html` に一時保存しています（再生成検収後に削除可）。

### 2. 公開URL検収

`Invoke-WebRequest -Method Head` でステータスを確認。全12URLが 200 OK:

```
200 /
200 /robots.txt
200 /sitemap.xml
200 /sitemap.txt
200 /googleddaaf03f1cedf1ed.html
200 /hypernatural-review.html
200 /pictory-review.html
200 /heygen-review.html
200 /descript-review.html
200 /free-start.html
200 /ai-video-tools-free.html
200 /youtube-shorts-ai-video-howto.html
```

公開サイトには文字化けもexample.com痕跡もありません（ローカルdistだけが汚染）。

### 3. ローカルdistの汚染量（再生成で消える）

| ファイル | `?????` 出現回数 | `example.com` 出現回数 |
| --- | --- | --- |
| dist/index.html | 21 | 多数 |
| dist/heygen-review.html | 5 | 多数 |
| dist/pictory-review.html | 5 | 多数 |
| dist/descript-review.html | 4 | 多数 |
| dist/hypernatural-review.html | 3 | 多数 |
| その他 (.html) | 0 | 多数 (canonical/og:url) |

両方とも `SITE_URL` を正しく設定して `node scripts/generate-site.mjs` を実行すれば、`dist/` 配下から消える見込みです。

## まだやれていないこと（要 Node.js）

このClaude Codeセッションの環境では `node` がPATHにありませんでした。
ユーザー環境のPowerShellでは下記が動くはずです。

### 検収手順

```powershell
cd "C:\Users\kodai\OneDrive\デスクトップ\claudecode-app\affiliate-quickstart"

# 構文確認
node --check .\scripts\generate-site.mjs

# 正しい SITE_URL で再生成
$env:SITE_URL='https://kod0225s-afk.github.io/creator-stack-guide'
node .\scripts\generate-site.mjs

# 期待値: `Generated dist/index.html` などが出力される
```

### 再生成後にローカル確認

```powershell
# 文字化け箇所が消えたことを確認（0件期待）
Select-String -Path .\dist\*.html -Pattern '\?\?\?\?\?' | Measure-Object | Select-Object Count

# example.com 残置が消えたことを確認（0件期待）
Select-String -Path .\dist\*.html -Pattern 'example\.com' | Measure-Object | Select-Object Count

# プレビュー起動
node .\scripts\serve-dist.mjs
# http://127.0.0.1:4177/ で目視確認
```

問題なければ git diff で差分を確認し、ユーザー判断でコミット・push。
**今回のセッションではコミット・pushしていません。**

## ユーザー作業（Claudeから外部システムを触れないもの）

P0-1, P0-2, P0-3 は引き続き残っています。

### A. Search Console の sitemap 状態確認

タイミング: いつでも（最終確認の 2026-05-11 から3日経過）

1. Search Console を開く
2. プロパティ `https://kod0225s-afk.github.io/creator-stack-guide/`
3. 左メニュー「サイトマップ」
4. `/sitemap.xml` と `/sitemap.txt` のステータス

判断:

- 「成功しました」なら完了扱い。完了したら `progress/VALIDATION.md` に追記
- 「取得できませんでした」のままなら、詳細エラーを `progress/HEARTBEAT_2026-05-14.md` に貼って共有
- 公開URLは両方 200 OK 確認済みなので、即時の大改修はしない

### B. ASP承認状況の確認とリンク差し替え

対象: Pictory / HeyGen / Descript （Hypernatural は承認済み）

1. 各ASPまたは公式管理画面で承認状態を確認
2. 承認済みなら `data/products.json` の `affiliate_url` を実リンクに差し替え
   - 現状はすべて `YOUR_AFFILIATE_ID` 入りのプレースホルダ
   - `generate-site.mjs` は `YOUR_AFFILIATE_ID` を含むURLを「成果リンク承認待ち」表示にする仕様（成果リンク誤認防止）
3. 差し替え後、上記の再生成手順を実行

### C. Hypernatural 実測レビュー

これは実体験記事化のためユーザー作業が必須です。

最低限ほしい証拠（`data/products.json` の `hypernatural.hands_on` に反映）:

- `tested_at`: 実施日
- `time_to_first_output`: 初回出力までの時間
- `watermark`: 透かしの有無
- `japanese_support`: 日本語入出力の扱いやすさ
- スクリーンショット3枚（作成画面 / 設定 / 出力）
- `notes`: 詰まった操作・手直し量

完了後、上記の再生成手順で `dist/hypernatural-review.html` に反映されます。

## 触っていないこと

- git: status未確認・コミット未実施・push未実施
- `.env` 系: メモリのブロック設定通り、参照せず
- 既存ドキュメント (`AI_TEAM_BOARD.md` 等): タスク状態の機械的書き換えはしていません。Codex側の正の状態を保持
