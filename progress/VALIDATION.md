# 検収と確認

## 直近の確認結果

2026-05-10 18時台に確認。

- 公開トップ: 200 OK
- `robots.txt`: 200 OK
- `sitemap.xml`: 200 OK
- `sitemap.txt`: 200 OK
- Google確認ファイル: 200 OK
- Search Console所有権: 確認済み
- トップページURL検査: Googleに登録済み
- トップページ再クロール依頼: 送信済み

## ローカル検収

```powershell
$env:SITE_URL='https://kod0225s-afk.github.io/creator-stack-guide'; node .\scripts\generate-site.mjs
node --check .\scripts\generate-site.mjs
```

期待値:

- `Generated dist/index.html` が出る
- `node --check` が無出力で終了する

## 公開検収

```powershell
Invoke-WebRequest -Uri 'https://kod0225s-afk.github.io/creator-stack-guide/' -UseBasicParsing
Invoke-WebRequest -Uri 'https://kod0225s-afk.github.io/creator-stack-guide/robots.txt' -UseBasicParsing
Invoke-WebRequest -Uri 'https://kod0225s-afk.github.io/creator-stack-guide/sitemap.xml' -UseBasicParsing
Invoke-WebRequest -Uri 'https://kod0225s-afk.github.io/creator-stack-guide/sitemap.txt' -UseBasicParsing
Invoke-WebRequest -Uri 'https://kod0225s-afk.github.io/creator-stack-guide/googleddaaf03f1cedf1ed.html' -UseBasicParsing
```

期待値:

- すべて `StatusCode : 200`

## Search Consoleで見る場所

1. Search Consoleを開く
2. プロパティ `https://kod0225s-afk.github.io/creator-stack-guide/` を選ぶ
3. 左メニューの `サイトマップ`
4. `/sitemap.xml` と `/sitemap.txt` のステータスを確認
5. 左上のURL検査に主要URLを入れて、必要ならインデックス登録をリクエスト

## 主要URL検査の優先順

1. `https://kod0225s-afk.github.io/creator-stack-guide/`
2. `https://kod0225s-afk.github.io/creator-stack-guide/hypernatural-review.html`
3. `https://kod0225s-afk.github.io/creator-stack-guide/hypernatural-free-guide.html`
4. `https://kod0225s-afk.github.io/creator-stack-guide/ai-video-tools-free.html`
5. `https://kod0225s-afk.github.io/creator-stack-guide/youtube-shorts-ai-video-howto.html`

