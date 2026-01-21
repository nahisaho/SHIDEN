# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
