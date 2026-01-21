# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.3] - 2026-01-22

### Fixed

- 📝 **ドキュメントのTENJIN GraphRAG表記を修正**
  - `README.md`: TENJIN GraphRAG連携表記を内蔵SQLite教育理論データベースに更新
  - `AGENTS.md`: 同様に内蔵データベースの説明に修正
  - `templates/AGENTS.md`: テンプレートも同様に修正

## [0.3.2] - 2026-01-22

### Fixed

- 🛠️ **1問1答コンテキスト収集ワークフローの修正**
  - AIエージェントが1問1答フローを正しく実行しない問題を修正
  - `AGENTS.md`: 判定基準・絶対ルール・実行フローを明示的に追加
  - `meta-prompt.md`: 🚨絶対ルールセクションを追加
  - 質問フォーマットを`[Q1/5]`形式で統一
  - 終了判定条件を明確化

## [0.3.1] - 2026-01-21

### Changed

- 📝 **Agent Skill 教育理論参照の更新**
  - 全プロンプト・スキルからTENJINプレースホルダーを削除
  - `npx shiden theories` CLIコマンドガイドを各スキルに追加
  - 統一された「教育理論データベースの活用」セクションを導入

### Fixed

- lesson-plan.md: `{TENJIN: ...}` プレースホルダーを削除
- individual.md: `{TENJIN: ...}` プレースホルダーを削除
- orchestrator.md: TENJIN接続エラーセクションを教育理論検索ガイドに更新
- context-manager.md: 「TENJIN検索結果」を「教育理論検索結果」に名称変更

## [0.3.0] - 2026-01-21

### Added

- 🗄️ **内蔵SQLite教育理論データベース**
  - 175件の教育理論を直接パッケージに同梱
  - FTS5 trigramによる日本語全文検索対応
  - WITH RECURSIVE CTEによるグラフ走査（関連理論探索）

- 🖥️ **theories CLI コマンド**
  - `npx shiden theories categories` - カテゴリ一覧表示
  - `npx shiden theories search <query>` - 理論検索（FTS5）
  - `npx shiden theories get <id>` - 理論詳細取得
  - `npx shiden theories list` - 理論一覧表示
  - `npx shiden theories related <id>` - 関連理論取得

- 📦 **プログラマティックAPI**
  - `shiden/theories` モジュールからTypeScript APIを公開
  - `search()`, `get()`, `list()`, `categories()`, `related()`

### Changed

- **ゼロコンフィグ**: Docker/Neo4j/ChromaDB依存を排除
- CLIフレームワークをparseArgsからCommander.jsに移行
- theory-lookup.mdをSQLiteベースに更新
- TENJINをオプショナル連携に変更（高度な推薦・分析用）

### Technical

- better-sqlite3によるSQLite接続（同期API）
- FTS5 trigramトークナイザー（日本語N-gram検索）
- パッケージサイズ: SQLiteデータベース約1.5MB追加

## [0.2.0] - 2026-01-21

### Added

- 🔗 **TENJIN MCP Server 統合**
  - `.vscode/mcp.json` テンプレート追加（`npx shiden init` で自動コピー）
  - uvx / Docker両方のTENJIN起動設定に対応
  - 環境変数による設定カスタマイズ（Neo4j, ChromaDB, Ollama）

### Changed

- `npx shiden init` で `.vscode/mcp.json` も自動生成されるように変更
- 成功メッセージにTENJINセットアップ手順を追加
- README.mdにTENJINセットアップガイドを追加

## [0.1.0] - 2026-01-21

### Added

- 🎉 Initial release of SHIDEN - 教育者向けGitHub Copilot Agent Skills

#### Core Skills (`.github/prompts/`)
- `meta-prompt.md` - メタプロンプト生成（コンテキスト収集・構造化）
- `lesson-plan.md` - 授業計画作成（Bloom's Taxonomy基準）
- `materials.md` - 教材作成（ワークシート、スライド、クイズ）
- `assessment.md` - 評価設計（ルーブリック、テスト問題）
- `individual.md` - 個別指導計画（ZPD、UDL対応）
- `feedback.md` - フィードバック生成（Growth Mindset基準）
- `guidance.md` - 生活指導案（発達段階考慮）

#### Integration Skills (`.github/skills/`)
- `orchestrator.md` - スキルオーケストレーション
- `theory-lookup.md` - TENJIN GraphRAG連携（175+教育理論）
- `context-manager.md` - セッションコンテキスト管理

#### CLI
- `npx shiden init` - プロジェクト初期化コマンド
- `npx shiden --version` - バージョン表示
- `npx shiden --help` - ヘルプ表示

#### TENJIN Integration
- TENJIN MCP Server連携設定 (`.vscode/mcp.json`)
- 175+の教育理論へのアクセス
- 理論検索・推薦・比較機能

### Documentation
- `AGENTS.md` - Agent Skillsエントリーポイント
- `README.md` - パッケージドキュメント

[0.1.0]: https://github.com/nahisaho/shiden/releases/tag/v0.1.0
[0.2.0]: https://github.com/nahisaho/shiden/releases/tag/v0.2.0
[0.3.0]: https://github.com/nahisaho/shiden/releases/tag/v0.3.0
