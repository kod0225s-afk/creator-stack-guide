# AIチーム タスクボード

## P0

| タスク | 担当 | 状態 | メモ |
| --- | --- | --- | --- |
| 未コミット差分の確認 | Codex / Claude Code | 未着手 | `example.com` と文字化け差分を確認。勝手にコミットしない |
| Search Console sitemap状態確認 | Owner / Claude Code | 継続 | Chromeログイン画面で `/sitemap.xml` と `/sitemap.txt` を確認 |
| Hypernatural実測レビュー | Owner / Claude Code | 未着手 | 15秒縦動画、作成時間、透かし、日本語対応、スクショ3枚 |
| 承認済みリンク確認 | Owner / Research Agent | 継続 | 承認済みだけ `data/products.json` へ反映 |

## P1

| タスク | 担当 | 状態 | メモ |
| --- | --- | --- | --- |
| 実測レビュー本文の強化 | Claude Code | 待機 | Hypernatural実測後に着手 |
| 主要ページの「向かない人」追記 | Claude Code | 待機 | 信頼性と成約前フィルタの強化 |
| 無料集客投稿案 | Growth Agent | 待機 | X / note / Shorts概要欄 |
| QAチェック | QA Agent | 待機 | placeholder、文字化け、リンク切れ、広告表記 |

## P2

| タスク | 担当 | 状態 | メモ |
| --- | --- | --- | --- |
| 独自ドメイン検討 | Owner | 保留 | 無料運用優先のため急がない |
| アクセス解析導入 | Codex / Owner | 保留 | GA4やCloudflare Web Analyticsはプライバシー表記更新が必要 |
| 構造化データ強化 | Codex | 保留 | Product / Review は実測後に慎重に |

## 今日の最短ルート

1. まず未コミット差分の意図を確認
2. 文字化けと `example.com` が意図しないものなら修正
3. Search Consoleのsitemap状態を人の画面で確認
4. Hypernaturalの実測素材を作る
5. 実測値を `data/products.json` に入れて再生成

