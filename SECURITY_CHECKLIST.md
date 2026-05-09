# 公開前セキュリティチェック

静的サイトとして無料公開する前提のチェックリストです。

## 実装済み

- [x] `Content-Security-Policy` をHTMLメタタグに追加
- [x] Cloudflare Pages / Netlify向け `_headers` にCSPを追加
- [x] `X-Content-Type-Options: nosniff`
- [x] `Referrer-Policy: strict-origin-when-cross-origin`
- [x] `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- [x] `base-uri 'self'`
- [x] `object-src 'none'`
- [x] `frame-ancestors 'none'`
- [x] `form-action 'self'`
- [x] 外部/広告リンクに `noopener` を追加
- [x] 動的HTML挿入箇所は `escapeHtml` を通す

## 公開前に確認

- [ ] 成果リンクに個人情報や不要なトラッキング値を入れない
- [ ] 公開URLを `SITE_URL` に入れて再生成する
- [ ] `https://` の公開URLで表示されることを確認する
- [ ] ブラウザのConsoleにCSP違反が大量に出ていないことを確認する
- [ ] GitHub / Cloudflare / Netlifyの自動課金設定をオンにしない

## 注意

GitHub Pagesでは `_headers` は適用されません。そのため、最低限のCSPはHTMLのメタタグにも入れています。

JSON-LDをHTML内に埋め込むため、`script-src` に `'unsafe-inline'` が残っています。より厳密にする場合は構造化データを外部ファイル化します。
