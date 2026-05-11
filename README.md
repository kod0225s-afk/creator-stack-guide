# Affiliate Quickstart

AI動画制作ツール比較のアフィリエイト用ミニサイトです。

## 使い方

1. 各公式/ASPでアフィリエイト申請する
2. 承認されたリンクを `data/products.json` の `affiliate_url` に貼る
3. 次のコマンドでHTMLを再生成する

```powershell
node .\scripts\generate-site.mjs
```

公開URLが決まった後は、canonicalとsitemap用に `SITE_URL` を付けて再生成します。

```powershell
$env:SITE_URL="https://your-project.pages.dev"; node .\scripts\generate-site.mjs
```

4. `dist/index.html` を公開する

ローカルで確認する場合:

```powershell
node .\scripts\serve-dist.mjs
```

表示URL:

```text
http://127.0.0.1:4177
```

無料だけで始める場合は `FREE_START.md` を見てください。

無料公開と無料集客の補助資料:

- `PUBLISH_CHECKLIST.md`
- `FREE_PROMOTION_TEMPLATES.md`
- `SECURITY_CHECKLIST.md`
- `progress/README.md`
- `docs/TEAM_OPERATIONS.md`
- `docs/TICKET_BOARD.md`
- `docs/SKILL_USAGE.md`

## 最初に申請する候補

- Pictory: OpenAffiliate上では即時承認、20-50% recurring、30日cookieと掲載
- Hypernatural: 公式ページでは通常1-2日承認、初年度20% commission
- HeyGen: 公式ページではCreator/Teamの20% recurring、60日cookie
- Descript: 公式ヘルプではPartnerStack経由、承認メールは最大14日目安

## 週次更新

- 報酬率
- cookie期間
- 承認条件
- 価格
- 実際に作ったサンプル動画とスクリーンショット

条件は変更されるため、公開前と更新時に必ず公式ページで再確認してください。
