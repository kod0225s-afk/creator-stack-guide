# 次の48時間でやること

レート制限が少ない前提で、探索を増やさずに進めるための短期タスクです。

## 1. Search Consoleを再確認

タイミング: 2026-05-11から2026-05-12

見る場所:

1. Search Console
2. プロパティ `https://kod0225s-afk.github.io/creator-stack-guide/`
3. 左メニュー `サイトマップ`

確認するもの:

- `/sitemap.xml`
- `/sitemap.txt`

判断:

- `成功しました` なら完了
- `取得できませんでした` のままなら詳細エラーを見る
- sitemapが失敗でも、トップページは登録済みなので大改修はしない

## 2. Hypernatural実測レビューを作る

最低限ほしい証拠:

- 作成した動画の目的: 15秒の縦型比較Shorts
- 作成にかかった時間
- 無料範囲でできたか
- 透かしの有無
- 日本語入力の扱いやすさ
- スクリーンショット3枚

更新先:

- `data/products.json`
- `dist/hypernatural-review.html` は直接編集せず、生成スクリプト経由

生成:

```powershell
$env:SITE_URL='https://kod0225s-afk.github.io/creator-stack-guide'; node .\scripts\generate-site.mjs
```

## 3. 承認済みリンクだけ差し替える

対象:

- Pictory
- HeyGen
- Descript

やること:

- ASPまたは公式画面で承認状態を確認
- 承認済みなら `data/products.json` の `affiliate_url` を差し替える
- 未承認なら触らない

禁止:

- 仮リンクを成果リンクとして表示する
- 報酬率だけで順位を上げる

