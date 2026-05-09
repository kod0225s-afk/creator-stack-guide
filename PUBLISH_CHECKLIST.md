# 無料公開チェックリスト

## 公開前

- [ ] `node .\scripts\generate-site.mjs` が通る
- [ ] 公開URLが決まった後、`SITE_URL` を指定して再生成する
- [ ] `node .\scripts\serve-dist.mjs` でローカル確認できる
- [ ] `http://127.0.0.1:4177/` でトップページが見える
- [ ] `free-start.html` が見える
- [ ] `affiliate-disclosure.html` が見える
- [ ] `privacy.html` が見える
- [ ] 広告表記がある
- [ ] `YOUR_AFFILIATE_ID` を成果リンクと誤認させない

## GitHub Pagesで無料公開

- [ ] GitHubで新規公開リポジトリを作る
- [ ] `affiliate-quickstart` の中身をpushする
- [ ] Repository Settings > Pages > Source を GitHub Actions にする
- [ ] Actions の `Deploy static site to GitHub Pages` が成功する
- [ ] 発行されたURLでトップページを確認する
- [ ] 発行されたURLを `SITE_URL` に入れて再生成・再デプロイする

## Cloudflare Pagesで無料公開

- [ ] Cloudflare Pagesで新規プロジェクトを作る
- [ ] GitHubリポジトリを接続する
- [ ] Build command: `node ./scripts/generate-site.mjs`
- [ ] Build output directory: `dist`
- [ ] 公開URLでトップページを確認する
- [ ] 公開URLを `SITE_URL` に入れて再生成・再デプロイする

## Netlify Freeで無料公開

- [ ] Netlifyで新規サイトを作る
- [ ] GitHubリポジトリを接続する
- [ ] Build command: `node ./scripts/generate-site.mjs`
- [ ] Publish directory: `dist`
- [ ] Auto rechargeや有料追加設定をオンにしない
- [ ] 公開URLを `SITE_URL` に入れて再生成・再デプロイする

## 公開後

- [ ] 公開URLをアフィリエイト申請時の媒体URLに使う
- [ ] 承認後、`data/products.json` の `affiliate_url` を差し替える
- [ ] 再生成して再公開する
- [ ] Shorts / X / note から無料で送客する
