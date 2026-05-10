# Claude Code 引き継ぎ

## ゴール

無料運用のまま、AI動画ツール比較サイトでアフィリエイト収益化を狙う。

短期の勝ち筋は、低競合の比較・無料・用途別キーワードで集客し、承認済みリンクのある Hypernatural へ送客しつつ、Pictory / HeyGen / Descript は承認後に差し替えること。

## 現在完了していること

- GitHub Pagesで公開済み
- Search Consoleの所有権確認済み
- Google確認ファイル追加済み: `dist/googleddaaf03f1cedf1ed.html`
- `sitemap.xml` 送信済み
- 代替の `sitemap.txt` 生成・公開・送信済み
- `robots.txt` に両方のsitemapを記載済み
- トップページのURL検査済み
- トップページは Search Console 上で「URL は Google に登録されています」と確認済み
- トップページのインデックス登録再リクエスト済み
- 週次チェック自動化作成済み
  - automation id: `ai`
  - 毎週月曜 09:00
  - Pictory / HeyGen / Descript / Hypernatural の条件確認

## Search Console の注意

2026-05-10 18時台時点で、Search Consoleのサイトマップ一覧は `/sitemap.xml` と `/sitemap.txt` の両方が `取得できませんでした` 表示。

ただし、公開URLは両方とも 200 OK。`robots.txt` も 200 OK。初回送信直後の処理遅延の可能性があるため、24から48時間後に再確認する。

もしまだ失敗していたら、次の順で対応する。

1. Search Consoleで `/sitemap.xml` を開き、詳細エラーを見る
2. `sitemap.xml` のURL数とXML構文を再確認
3. 主要ページをURL検査から個別送信する
4. 可能なら独自ドメイン化を検討する

## 主要ファイル

- `scripts/generate-site.mjs`: サイト生成の中心
- `data/products.json`: 商品データ、報酬、リンク、暫定スコア、実測枠
- `dist/`: 公開成果物
- `SEO_NEXT_STEPS.md`: SEO方針
- `SECURITY_CHECKLIST.md`: セキュリティ確認
- `FREE_PROMOTION_TEMPLATES.md`: 無料集客テンプレ

## 実行コマンド

```powershell
$env:SITE_URL='https://kod0225s-afk.github.io/creator-stack-guide'; node .\scripts\generate-site.mjs
node --check .\scripts\generate-site.mjs
node .\scripts\serve-dist.mjs
git status --short
```

ローカル確認URL:

```text
http://127.0.0.1:4177/
```

## 守ること

- AI記事の量産をしない
- 実際に試していないのに「使ってみた」と書かない
- placeholderの成果リンクを公開ページで押せる形にしない
- Search Consoleの確認ファイルを削除しない
- 無料運用方針を維持する

