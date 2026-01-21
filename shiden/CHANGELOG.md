# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.3] - 2026-01-22

### Changed

- 🔧 **学習指導要領参照を必須ワークフローに変更**
  - AGENTS.md: Phase 2として「学習指導要領参照（必須）」を追加
  - lesson-plan.md: 入力要件に学習指導要領参照を必須化、必須出力セクション追加
  - materials.md: 入力要件に学習指導要領参照を必須化、必須出力セクション追加
  - assessment.md: 入力要件に学習指導要領参照を必須化、必須出力セクション追加
  - individual.md: 入力要件に学習指導要領参照を必須化、必須出力セクション追加
  - ワークフローを3フェーズから4フェーズに拡張（メタプロンプト→学習指導要領→スキル実行→理論引用）

## [0.4.2] - 2026-01-22

### Fixed

- 🐛 バージョン再公開（npm publish修正）

## [0.4.1] - 2026-01-22

### Added

- 📚 **中学校・高等学校学習指導要領を追加**
  - 中学校学習指導要領（平成29年告示）: 560セクション
  - 高等学校学習指導要領（平成30年告示）: 1,371セクション
  - 合計2,469セクション、555,352リレーション

### Changed

- 小学校学習指導要領のセクション数を538件に修正（重複除去）

## [0.4.0] - 2026-01-22

### Added

- 📚 **学習指導要領データベースを追加**
  - 文部科学省の学習指導要領（小学校・平成29年告示）をGraphRAG DBとして内蔵
  - 2,469セクション、555,352リレーションを収録
  - FTS5 trigramで日本語全文検索対応

- 🔍 **curriculum CLIコマンドを追加**
  - `npx shiden curriculum search <query>` - キーワード検索
  - `npx shiden curriculum subject <name>` - 教科別検索
  - `npx shiden curriculum grade <grade>` - 学年別検索
  - `npx shiden curriculum stats` - 統計表示

- 📝 **スキルファイルに学習指導要領参照を追加**
  - `lesson-plan.md`: 授業計画作成時の学習指導要領参照手順
  - `materials.md`: 教材作成時の学習指導要領参照手順
  - `AGENTS.md`: 学習指導要領データベースの活用方法

### Changed

- 📦 パッケージサイズ増加（学習指導要領DB追加のため）

## [0.3.5] - 2026-01-22

### Removed

- 🗑️ **TENJIN MCP設定ファイルの削除**
  - `init`/`update`コマンドから`.vscode/mcp.json`のコピー処理を削除
  - テンプレートから`.vscode/`ディレクトリを削除
  - 教育理論は内蔵SQLiteデータベースで利用可能

### Fixed

- 📝 **initコマンドの成功メッセージを更新**
  - TENJIN GraphRAG連携の説明を内蔵教育理論データベースの説明に変更
  - CLIコマンドの使用例を追加（`npx shiden theories search`）

## [0.3.4] - 2026-01-22

### Added

- 🔄 **update/upgrade コマンドを追加**
  - `npx shiden update` - SHIDEN Agent Skillsを最新版に更新
  - `npx shiden upgrade` - updateのエイリアス
  - npm update後のスキルファイル更新が容易に
  - 更新後のバージョンと更新ファイル数を表示

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
