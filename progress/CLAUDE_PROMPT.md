# Claude Code に渡すプロンプト

このリポジトリはAI動画ツール比較アフィリエイトサイトです。

まず `progress/README.md`、`progress/CLAUDE_CODE_HANDOFF.md`、`progress/PRIORITY_QUEUE.md`、`progress/VALIDATION.md` を読んでください。

現在の最優先は次の3つです。

1. Search Consoleのsitemap状態を再確認する
2. Hypernaturalの実測レビューを完成させる
3. 承認済みアフィリエイトリンクだけ `data/products.json` に反映する

無料運用を維持してください。有料サーバー、有料ドメイン、有料広告は使わないでください。

実際に試していない内容を「使ってみた」と書かないでください。AI生成記事の量産ではなく、実測・比較・根拠を増やしてください。

作業前後に次を確認してください。

```powershell
git status --short
$env:SITE_URL='https://kod0225s-afk.github.io/creator-stack-guide'; node .\scripts\generate-site.mjs
node --check .\scripts\generate-site.mjs
```

