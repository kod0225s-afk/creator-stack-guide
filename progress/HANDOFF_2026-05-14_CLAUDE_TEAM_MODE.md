# Claude Code → Codex 引き継ぎメモ 2026-05-14（チームモード整備）

確認時刻: 2026-05-14 JST
担当: Claude Code（秘書役）
対象: Codex 次回起動時の引き継ぎ

## 概要

このセッションでは affiliate-quickstart 本体の中身は触っていない。**Claude Code 側を Codex と同じ秘書/チーム制で動かすための整備**だけを行った。動画制作（shorts-factory）側で実作業があり、そちらは `C:\Users\kodai\shorts-factory\docs\PROGRESS_2026-05-14.md` を参照。

## 今回触ったファイル

| ファイル | 変更内容 |
|---|---|
| `CLAUDE.md` | 新規作成。Claude Code が起動時に `docs\TEAM_OPERATIONS.md` / `docs\TICKET_BOARD.md` / `progress\README.md` を読み、秘書フォーマットで報告するよう指定 |
| `progress/HANDOFF_2026-05-14_CLAUDE_TEAM_MODE.md` | このファイル（新規） |

`data/products.json` / `dist/*` / `scripts/generate-site.mjs` などサイト本体は **一切触っていない**。

## Codex 側でやってほしいこと

1. 次回 Codex を起動するときに、新規 `CLAUDE.md` が `progress/CLAUDE_CODE_HANDOFF.md` や `docs/TEAM_OPERATIONS.md` と矛盾していないか確認。矛盾があれば Codex 側の正本を優先して Claude Code 側を修正。
2. `docs\TICKET_BOARD.md` の運用は変えていない。`HEARTBEAT_2026-05-14.md` の P0-1 / P0-2 / P0-3（Search Console sitemap、ASP 承認、Hypernatural 実測）はそのまま残っている。

## 親プロジェクト連携の現状

- shorts-factory 側に `ai_tools_affiliate` チャンネルを追加済み（前セッションで作成）
- 1本目（`shorts_free_method.json` ベース）を生成済み・投稿待ち
- shorts-factory `docs\TICKET_BOARD.md` に SF-017〜SF-020 を追加
- creator-stack-guide サイトと YouTube `Creator Stack` チャンネルの連携が動き出した状態
- `SF-012`（shorts-factory 側）: アフィリエイトプロジェクトとの部分統合設計が Todo のまま

## 触っていないこと（重要）

- git: status 未確認・commit/push なし
- `.env` 系: ハードdeny 維持
- ASP / Search Console / 外部アカウントの操作
- `data/products.json` / `dist/` / `scripts/`
- 既存 `progress/*.md` の状態書き換え（HEARTBEAT/PRIORITY_QUEUE 等の正本を保持）
