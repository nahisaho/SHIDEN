# タスク分解書: SHIDEN - 教育者向けGitHub Copilot Agent Skills

## メタデータ

| 項目 | 値 |
|------|----|
| **ID** | TASKS-001 |
| **Version** | 1.0.0 |
| **Created** | 2026-01-21 |
| **Updated** | 2026-01-21 |
| **Status** | 📝 Draft → Review Required |
| **Author** | AI Assistant |
| **Phase** | Phase 3: タスク分解 |
| **Traces To** | DES-001, REQ-001 |

### MUSUBIX憲法準拠状況

| 条項 | 準拠状況 | 備考 |
|------|---------|------|
| I. Library-First | ✅ 準拠 | npm パッケージとしてタスク設計 |
| II. CLI Interface | ✅ 準拠 | CLI実装タスクを定義 |
| III. Test-First | ✅ 準拠 | 各タスクにテストを含む |
| IV. EARS Format | ✅ 準拠 | 要件からトレース |
| V. Traceability | ✅ 準拠 | TSK → DES → REQ マッピング |
| VI. Project Memory | ✅ 参照 | AGENTS.md参照 |
| VII. Design Patterns | ✅ 適用 | 設計パターンに基づくタスク |
| VIII. Decision Records | ✅ 準拠 | ADRに基づく実装 |
| IX. Quality Gates | ✅ 準拠 | 各タスクに完了基準 |
| X. Implementation Prerequisites | ✅ 準拠 | 要件→設計→タスク→実装の順序 |

### トレーサビリティマトリクス（DES → TSK）

| 設計要素 | タスク |
|---------|--------|
| DES-ORCH | TSK-2.1〜2.3 |
| DES-SKILL-LP | TSK-3.1 |
| DES-SKILL-MAT | TSK-3.2 |
| DES-SKILL-ASSESS | TSK-3.3 |
| DES-SKILL-IEP | TSK-3.4 |
| DES-SKILL-FB | TSK-3.5 |
| DES-SKILL-GUID | TSK-3.6 |
| DES-GRAPH | TSK-4.1〜4.2 |
| DES-DIST | TSK-1.1〜1.3 |
| DES-CLI | TSK-5.1〜5.3 |

---

## 1. タスク概要

### 1.1 フェーズ構成

| フェーズ | 説明 | タスク数 | 優先度 |
|---------|------|---------|--------|
| **Phase 1** | プロジェクト基盤構築 | 3 | P0 |
| **Phase 2** | オーケストレーション層 | 3 | P0 |
| **Phase 3** | スキル層（6ユースケース） | 6 | P0/P1 |
| **Phase 4** | 統合層（TENJIN連携） | 2 | P0 |
| **Phase 5** | CLI実装 | 3 | P0 |
| **Phase 6** | テスト・ドキュメント | 3 | P0 |
| **合計** | | **20** | |

### 1.2 工数見積もり

| フェーズ | 見積もり時間 |
|---------|-------------|
| Phase 1 | 2-3時間 |
| Phase 2 | 3-4時間 |
| Phase 3 | 6-8時間 |
| Phase 4 | 2-3時間 |
| Phase 5 | 2-3時間 |
| Phase 6 | 3-4時間 |
| **合計** | **18-25時間** |

---

## 2. Phase 1: プロジェクト基盤構築

### TSK-1.1: npm パッケージ初期化 【P0】

**Traces**: DES-DIST → REQ-NFR-001, REQ-NFR-001a

**説明**: SHIDENのnpmパッケージ基盤を構築する

**成果物**:
- `shiden/package.json`
- `shiden/tsconfig.json`
- `shiden/README.md`
- `shiden/LICENSE`

**サブタスク**:
```
□ TSK-1.1.1: package.json作成
   - name: "shiden"
   - version: "1.0.0"
   - description, keywords, repository設定
   - bin: { "shiden": "./bin/shiden.js" }
   - files: ["dist/", "bin/", "templates/", "AGENTS.md", ".github/"]

□ TSK-1.1.2: tsconfig.json作成
   - target: ES2022
   - module: NodeNext
   - outDir: dist/

□ TSK-1.1.3: README.md作成
   - クイックスタート（3ステップ）
   - 機能一覧
   - 使用例

□ TSK-1.1.4: LICENSE作成（MIT）
```

**完了基準**:
- [ ] `npm pack` でパッケージ作成成功
- [ ] package.json が semver 準拠
- [ ] README に3ステップのクイックスタート記載

**依存タスク**: なし

**見積もり**: 1時間

---

### TSK-1.2: ディレクトリ構造作成 【P0】

**Traces**: DES-DIST → REQ-NFR-001b

**説明**: Markdown-first原則に基づくディレクトリ構造を作成

**成果物**:
```
shiden/
├── AGENTS.md                    # エントリーポイント（空テンプレート）
├── .github/
│   ├── prompts/                 # プロンプトディレクトリ
│   └── skills/                  # スキルディレクトリ
├── bin/
│   └── shiden.js                # CLI エントリーポイント（スタブ）
├── templates/                   # コピー対象テンプレート
│   ├── AGENTS.md
│   ├── .github/
│   │   ├── prompts/
│   │   └── skills/
│   └── README-SHIDEN.md
└── src/
    ├── cli/
    ├── utils/
    └── types/
```

**サブタスク**:
```
□ TSK-1.2.1: shiden/ディレクトリ作成
□ TSK-1.2.2: .github/prompts/, .github/skills/ 作成
□ TSK-1.2.3: bin/, templates/, src/ 作成
□ TSK-1.2.4: 各ディレクトリに .gitkeep または初期ファイル配置
```

**完了基準**:
- [ ] 設計書のディレクトリ構造と一致
- [ ] templates/ 内に必要なサブディレクトリが存在

**依存タスク**: TSK-1.1

**見積もり**: 30分

---

### TSK-1.3: 型定義作成 【P0】

**Traces**: DES-DIST

**説明**: TypeScriptの型定義を作成

**成果物**:
- `shiden/src/types/index.ts`

**サブタスク**:
```
□ TSK-1.3.1: SkillType型定義
   type SkillType = 'lesson-plan' | 'materials' | 'assessment' | 
                    'individual' | 'feedback' | 'guidance';

□ TSK-1.3.2: MetaPromptContext型定義
   interface MetaPromptContext {
     grade?: string;
     subject?: string;
     topic?: string;
     learningObjective?: string;
     duration?: number;
     specialConsiderations?: string[];
   }

□ TSK-1.3.3: InitOptions型定義
   interface InitOptions {
     force?: boolean;
     dryRun?: boolean;
   }

□ TSK-1.3.4: TENJINTheory型定義（連携用）
```

**完了基準**:
- [ ] 型定義がエクスポートされている
- [ ] TypeScriptコンパイルエラーなし

**依存タスク**: TSK-1.1

**見積もり**: 30分

---

## 3. Phase 2: オーケストレーション層

### TSK-2.1: AGENTS.md作成 【P0】

**Traces**: DES-ORCH → REQ-ORCH-001

**説明**: GitHub Copilot Agent Skillsのエントリーポイントを作成

**成果物**:
- `shiden/AGENTS.md`
- `shiden/templates/AGENTS.md`

**サブタスク**:
```
□ TSK-2.1.1: システム概要セクション
   - SHIDENの説明
   - TENJIN GraphRAG連携の説明
   - 6つのユースケースの概要

□ TSK-2.1.2: ワークフロー定義
   - Phase 1: メタプロンプト生成
   - Phase 2: スキル実行
   - Phase 3: 理論引用・エビデンス付与

□ TSK-2.1.3: スキルルーティング定義
   - キーワード → スキルのマッピング
   - 意図不明時の確認フロー

□ TSK-2.1.4: 利用可能スキル一覧
   - 各スキルへのパス参照
   - 簡易説明
```

**完了基準**:
- [ ] GitHub Copilotがスキルを認識できる形式
- [ ] 6つのユースケースへのルーティングが定義
- [ ] TENJIN連携の指示が含まれる

**依存タスク**: TSK-1.2

**見積もり**: 1.5時間

---

### TSK-2.2: meta-prompt.md作成 【P0】

**Traces**: DES-ORCH → REQ-META-001〜006

**説明**: メタプロンプト生成機能を実装

**成果物**:
- `shiden/.github/prompts/meta-prompt.md`
- `shiden/templates/.github/prompts/meta-prompt.md`

**サブタスク**:
```
□ TSK-2.2.1: プロンプト強化ロジック (REQ-META-001)
   - 曖昧な入力を構造化
   - 暗黙の前提を明示化
   - 欠落要素を特定

□ TSK-2.2.2: 強化プロンプト確認テンプレート (REQ-META-002)
   - 「📝 あなたのリクエストを以下のように理解しました」形式
   - 元のリクエストと強化版の対比表示

□ TSK-2.2.3: コンテキスト収集質問バンク (REQ-META-003)
   - Q1: 学習目標
   - Q2: 学習者レベル
   - Q3: 配慮事項
   - Q4: 時間・リソース
   - Q5: 評価基準
   - 1問1答フロー制御

□ TSK-2.2.4: メタプロンプト生成テンプレート (REQ-META-004)
   - 【コンテキスト】セクション
   - 【参照すべき教育理論】セクション
   - 【出力要件】セクション
   - 【品質基準】セクション

□ TSK-2.2.5: 真の目的探索質問 (REQ-META-005)
   - 「この単元で生徒にどのような変化を期待していますか？」
   - 「この授業の成功をどのように判断しますか？」

□ TSK-2.2.6: フロー制御ロジック (REQ-META-006)
   - スキップオプション
   - 所要時間目安（2-3分）
```

**完了基準**:
- [ ] REQ-META-001〜006の全受入基準を満たす
- [ ] 1問1答形式のコンテキスト収集が機能
- [ ] メタプロンプトにTENJIN理論参照指示が含まれる

**依存タスク**: TSK-2.1

**見積もり**: 2時間

---

### TSK-2.3: orchestrator.md作成 【P0】

**Traces**: DES-ORCH → REQ-ORCH-001, REQ-ORCH-004, REQ-ORCH-005

**説明**: スキルオーケストレーションロジックを実装

**成果物**:
- `shiden/.github/skills/orchestrator.md`
- `shiden/templates/.github/skills/orchestrator.md`

**サブタスク**:
```
□ TSK-2.3.1: 意図分析ロジック
   - キーワードベースの意図検出
   - 曖昧な場合の確認フロー

□ TSK-2.3.2: スキルルーティングテーブル
   | キーワード | スキル |
   |-----------|--------|
   | 授業計画, 指導案 | lesson-plan.md |
   | 教材, ワークシート | materials.md |
   | 評価, ルーブリック | assessment.md |
   | 個別指導, 配慮 | individual.md |
   | フィードバック, 振り返り | feedback.md |
   | 生活指導, 行動 | guidance.md |

□ TSK-2.3.3: マルチスキル連携ロジック (REQ-ORCH-004)
   - 複合リクエストの分解
   - 実行順序の最適化

□ TSK-2.3.4: フォールバック処理 (REQ-ORCH-005)
   - スキル失敗時のエラーメッセージ
   - 代替アプローチの提案
```

**完了基準**:
- [ ] 6つのユースケースへの正確なルーティング
- [ ] 意図不明時の確認フロー動作
- [ ] マルチスキル連携が定義

**依存タスク**: TSK-2.1

**見積もり**: 1時間

---

## 4. Phase 3: スキル層（6ユースケース）

### TSK-3.1: lesson-plan.md作成 【P0】

**Traces**: DES-SKILL-LP → REQ-LP-001〜003

**説明**: 授業計画作成スキルを実装

**成果物**:
- `shiden/.github/prompts/lesson-plan.md`
- `shiden/templates/.github/prompts/lesson-plan.md`

**サブタスク**:
```
□ TSK-3.1.1: 入力テンプレート定義
   - メタプロンプトからの入力受け取り
   - 必須項目: 学年, 教科, 単元, 学習目標, 時間

□ TSK-3.1.2: 出力構造定義 (REQ-LP-001)
   1. 学習目標（Bloom's Taxonomy基準）
   2. 導入（5-10分）
   3. 展開（30-35分）
   4. まとめ（5-10分）
   5. 評価規準
   6. 参照した教育理論

□ TSK-3.1.3: 学習目標設定支援 (REQ-LP-002)
   - Bloom's Taxonomy 6段階の説明
   - 目標動詞の提案

□ TSK-3.1.4: 教科・学年対応 (REQ-LP-003)
   - 小・中・高・大学での複雑さ調整
   - 教科特性に応じた指導法

□ TSK-3.1.5: TENJIN理論参照指示
   - search_theories(category="instructional_design")
   - recommend_theories_for_learner(context)
```

**完了基準**:
- [ ] REQ-LP-001〜003の全受入基準を満たす
- [ ] Bloom's Taxonomy基準の目標設定が含まれる
- [ ] TENJIN理論引用指示が含まれる

**依存タスク**: TSK-2.2

**見積もり**: 1.5時間

---

### TSK-3.2: materials.md作成 【P0】

**Traces**: DES-SKILL-MAT → REQ-MAT-001〜004

**説明**: 教材作成スキルを実装

**成果物**:
- `shiden/.github/prompts/materials.md`
- `shiden/templates/.github/prompts/materials.md`

**サブタスク**:
```
□ TSK-3.2.1: 形式オプション定義 (REQ-MAT-002)
   - worksheet: ワークシート
   - slide: スライド
   - quiz: クイズ
   - handout: 配布資料

□ TSK-3.2.2: 教授設計原則の適用 (REQ-MAT-003)
   - Gagné's Nine Events of Instruction
   - ARCS Model

□ TSK-3.2.3: 差別化対応 (REQ-MAT-004)
   - UDL原則の適用
   - 複数バージョン提案

□ TSK-3.2.4: TENJIN理論参照指示
   - get_theory(id="gagnes_nine_events")
   - get_theory(id="arcs_model")
```

**完了基準**:
- [ ] REQ-MAT-001〜004の全受入基準を満たす
- [ ] 4形式（worksheet, slide, quiz, handout）に対応
- [ ] 教授設計理論が引用される

**依存タスク**: TSK-2.2

**見積もり**: 1時間

---

### TSK-3.3: assessment.md作成 【P0】

**Traces**: DES-SKILL-ASSESS → REQ-ASSESS-001〜004

**説明**: 評価設計スキルを実装

**成果物**:
- `shiden/.github/prompts/assessment.md`
- `shiden/templates/.github/prompts/assessment.md`

**サブタスク**:
```
□ TSK-3.3.1: ルーブリック生成 (REQ-ASSESS-001)
   - 評価観点定義
   - 3-5段階のパフォーマンスレベル
   - 学習目標との対応

□ TSK-3.3.2: テスト問題生成 (REQ-ASSESS-002)
   - Bloom's Taxonomy認知レベル別
   - 解答例・解答基準

□ TSK-3.3.3: 形成的評価設計 (REQ-ASSESS-003)
   - 評価目的の明示
   - フィードバック方法

□ TSK-3.3.4: 構成的整合性チェック (REQ-ASSESS-004)
   - 学習目標↔指導↔評価の整合性
   - 不整合時の警告
```

**完了基準**:
- [ ] REQ-ASSESS-001〜004の全受入基準を満たす
- [ ] Bloom's Taxonomy認知レベルが明記される
- [ ] 構成的整合性チェックが含まれる

**依存タスク**: TSK-2.2

**見積もり**: 1時間

---

### TSK-3.4: individual.md作成 【P1】

**Traces**: DES-SKILL-IEP → REQ-IEP-001〜004

**説明**: 個別指導計画スキルを実装

**成果物**:
- `shiden/.github/prompts/individual.md`
- `shiden/templates/.github/prompts/individual.md`

**サブタスク**:
```
□ TSK-3.4.1: 学習者プロファイル入力 (REQ-IEP-001)
   - 学習スタイル
   - 習熟度
   - 特別な配慮事項

□ TSK-3.4.2: 戦略推薦ロジック (REQ-IEP-001)
   - 3つ以上の指導戦略
   - 各戦略の理論的根拠

□ TSK-3.4.3: 学習スタイル対応 (REQ-IEP-002)
   - 視覚/聴覚/運動感覚
   - 理論の限界説明

□ TSK-3.4.4: 特別支援対応 (REQ-IEP-003)
   - 配慮事項提案
   - 専門家相談推奨

□ TSK-3.4.5: 進捗モニタリング (REQ-IEP-004)
   - 頻度・方法
   - 計画修正トリガー
```

**完了基準**:
- [ ] REQ-IEP-001〜004の全受入基準を満たす
- [ ] ZPD（最近接発達領域）理論への参照
- [ ] 専門家相談の推奨が含まれる

**依存タスク**: TSK-2.2

**見積もり**: 1時間

---

### TSK-3.5: feedback.md作成 【P0】

**Traces**: DES-SKILL-FB → REQ-FB-001〜004

**説明**: フィードバック生成スキルを実装

**成果物**:
- `shiden/.github/prompts/feedback.md`
- `shiden/templates/.github/prompts/feedback.md`

**サブタスク**:
```
□ TSK-3.5.1: フィードバック生成 (REQ-FB-001)
   - 良い点と改善点のバランス
   - 具体的かつ行動可能な内容

□ TSK-3.5.2: 自己評価支援 (REQ-FB-002)
   - メタ認知促進の問いかけ
   - 振り返りの観点

□ TSK-3.5.3: 成長マインドセット対応 (REQ-FB-003)
   - 努力・戦略重視の表現
   - 能力固定的表現の回避

□ TSK-3.5.4: 次のステップ提案 (REQ-FB-004)
   - 具体的なアクション
   - 実行可能な難易度
```

**完了基準**:
- [ ] REQ-FB-001〜004の全受入基準を満たす
- [ ] Growth Mindset原則が反映
- [ ] 具体的な次のステップが含まれる

**依存タスク**: TSK-2.2

**見積もり**: 1時間

---

### TSK-3.6: guidance.md作成 【P0】

**Traces**: DES-SKILL-GUID → REQ-GUID-001〜005

**説明**: 生活指導案作成スキルを実装

**成果物**:
- `shiden/.github/prompts/guidance.md`
- `shiden/templates/.github/prompts/guidance.md`

**サブタスク**:
```
□ TSK-3.6.1: 生活指導案生成 (REQ-GUID-001)
   - 状況分析
   - 目標設定
   - 具体的介入
   - 評価・フォローアップ

□ TSK-3.6.2: 発達段階考慮 (REQ-GUID-002)
   - Erikson's Psychosocial Development
   - Kohlberg's Moral Development
   - Piaget's Cognitive Development

□ TSK-3.6.3: 予防的指導 (REQ-GUID-003)
   - PBIS原則
   - 学級・学校レベルの予防策

□ TSK-3.6.4: 危機対応支援 (REQ-GUID-004)
   - 危機対応フレームワーク参照
   - ⚠️ 専門家相談の強い推奨（必須）

□ TSK-3.6.5: 保護者連携 (REQ-GUID-005)
   - 連絡方法・タイミング
   - 文化的配慮
```

**完了基準**:
- [ ] REQ-GUID-001〜005の全受入基準を満たす
- [ ] 発達理論への参照が含まれる
- [ ] 危機対応時は必ず専門家相談推奨を含む

**依存タスク**: TSK-2.2

**見積もり**: 1.5時間

---

## 5. Phase 4: 統合層（TENJIN連携）

### TSK-4.1: theory-lookup.md作成 【P0】

**Traces**: DES-GRAPH → REQ-GRAPH-001〜004, REQ-ORCH-003

**説明**: TENJIN GraphRAG連携スキルを実装

**成果物**:
- `shiden/.github/skills/theory-lookup.md`
- `shiden/templates/.github/skills/theory-lookup.md`

**サブタスク**:
```
□ TSK-4.1.1: 理論検索機能 (REQ-GRAPH-001)
   - search_theories(query, category?, limit?)
   - get_theory(theory_id)
   - get_theories_by_category(category)

□ TSK-4.1.2: 理論推薦機能 (REQ-GRAPH-002)
   - recommend_theories(context, learner_profile?)
   - recommend_theories_for_learner(learner_type, learning_goal)
   - recommend_complementary_theories(theory_id)

□ TSK-4.1.3: エビデンス引用 (REQ-GRAPH-003)
   - 理論名と理論家名の明記
   - 出典情報の取得

□ TSK-4.1.4: 理論間関係活用 (REQ-GRAPH-004)
   - get_related_theories(theory_id, relation_type?)
   - find_theory_path(from_id, to_id)
   - get_influence_chain(theory_id)

□ TSK-4.1.5: エラーハンドリング
   - TENJIN接続エラー時のフォールバック
   - 理論未発見時の代替検索
```

**完了基準**:
- [ ] REQ-GRAPH-001〜004の全受入基準を満たす
- [ ] TENJIN MCP Toolsへの正しい参照
- [ ] フォールバック処理が定義

**依存タスク**: TSK-2.1

**見積もり**: 1.5時間

---

### TSK-4.2: context-manager.md作成 【P1】

**Traces**: DES-CONTEXT → REQ-ORCH-002

**説明**: セッションコンテキスト管理スキルを実装

**成果物**:
- `shiden/.github/skills/context-manager.md`
- `shiden/templates/.github/skills/context-manager.md`

**サブタスク**:
```
□ TSK-4.2.1: セッションコンテキスト定義
   - 会話履歴
   - 前回スキル実行結果
   - ユーザー設定

□ TSK-4.2.2: コンテキスト操作
   - remember: 情報記憶
   - recall: 過去情報参照
   - clear: コンテキストクリア
   - summarize: セッションサマリー

□ TSK-4.2.3: スキル間データ受け渡し
   - 前回の授業計画を参照した教材作成
   - 授業計画と評価の連携
```

**完了基準**:
- [ ] セッション内でコンテキストが保持される
- [ ] 「前の授業計画を基に」等の参照が可能
- [ ] コンテキストクリア機能が動作

**依存タスク**: TSK-2.3

**見積もり**: 1時間

---

## 6. Phase 5: CLI実装

### TSK-5.1: CLI エントリーポイント作成 【P0】

**Traces**: DES-CLI → REQ-NFR-001c, REQ-NFR-001d

**説明**: npx shiden コマンドのエントリーポイントを実装

**成果物**:
- `shiden/bin/shiden.js`
- `shiden/src/cli/index.ts`

**サブタスク**:
```
□ TSK-5.1.1: shebang付きエントリーポイント
   #!/usr/bin/env node
   require('../dist/cli/index.js');

□ TSK-5.1.2: コマンドパーサー実装
   - init: Agent Skillsファイルコピー
   - -v, --version: バージョン表示
   - -h, help: ヘルプ表示

□ TSK-5.1.3: 引数解析（最小限の実装）
   - process.argv ベースの解析
   - 外部ライブラリ依存なし
```

**完了基準**:
- [ ] `npx shiden -v` でバージョン表示
- [ ] `npx shiden --version` でバージョン表示
- [ ] 出力形式: `shiden vX.Y.Z`
- [ ] `npx shiden help` でヘルプ表示

**依存タスク**: TSK-1.1, TSK-1.3

**見積もり**: 1時間

---

### TSK-5.2: init コマンド実装 【P0】

**Traces**: DES-CLI → REQ-NFR-001c

**説明**: `npx shiden init` コマンドを実装

**成果物**:
- `shiden/src/cli/init.ts`
- `shiden/src/utils/file-copy.ts`

**サブタスク**:
```
□ TSK-5.2.1: テンプレートファイルコピー機能
   - templates/AGENTS.md → ./AGENTS.md
   - templates/.github/prompts/ → ./.github/prompts/
   - templates/.github/skills/ → ./.github/skills/
   - templates/README-SHIDEN.md → ./README-SHIDEN.md

□ TSK-5.2.2: 上書き確認機能
   - 既存ファイル検出
   - ユーザー確認プロンプト
   - --force オプション

□ TSK-5.2.3: --dry-run オプション
   - コピー対象ファイルの表示のみ
   - 実際のコピーは行わない

□ TSK-5.2.4: 完了メッセージ
   - コピーしたファイル一覧
   - 次のステップの案内
```

**完了基準**:
- [ ] `npx shiden init` で全ファイルがコピーされる
- [ ] 既存ファイルがある場合は上書き確認
- [ ] `--force` で上書き確認スキップ
- [ ] `--dry-run` でプレビューのみ

**依存タスク**: TSK-5.1, TSK-1.2

**見積もり**: 1.5時間

---

### TSK-5.3: CLI テスト作成 【P0】

**Traces**: DES-CLI

**説明**: CLIコマンドのテストを実装

**成果物**:
- `shiden/src/cli/__tests__/index.test.ts`
- `shiden/src/cli/__tests__/init.test.ts`

**サブタスク**:
```
□ TSK-5.3.1: バージョン表示テスト
   - `shiden -v` の出力検証
   - `shiden --version` の出力検証
   - package.json との一致確認

□ TSK-5.3.2: ヘルプ表示テスト
   - `shiden help` の出力検証
   - `shiden -h` の出力検証

□ TSK-5.3.3: init コマンドテスト
   - 新規プロジェクトへのコピー
   - 既存ファイルの上書き確認
   - --force オプション
   - --dry-run オプション
```

**完了基準**:
- [ ] 全CLIコマンドのテストがパス
- [ ] カバレッジ80%以上

**依存タスク**: TSK-5.1, TSK-5.2

**見積もり**: 1時間

---

## 7. Phase 6: テスト・ドキュメント

### TSK-6.1: 統合テスト作成 【P0】

**Traces**: REQ-NFR-003

**説明**: エンドツーエンドの統合テストを作成

**成果物**:
- `shiden/tests/integration/`

**サブタスク**:
```
□ TSK-6.1.1: npmインストールテスト
   - `npm pack` → `npm install` フロー
   - 依存関係解決確認

□ TSK-6.1.2: init → 利用フローテスト
   - `npx shiden init` 実行
   - コピーされたファイルの検証
   - Agent Skills形式の確認

□ TSK-6.1.3: TENJIN連携テスト（モック）
   - 理論検索のモックテスト
   - エラーハンドリングテスト
```

**完了基準**:
- [ ] npm install 成功率 100%
- [ ] init → 利用フローが正常動作
- [ ] TENJIN連携のモックテストがパス

**依存タスク**: TSK-5.2, TSK-4.1

**見積もり**: 1.5時間

---

### TSK-6.2: ドキュメント整備 【P0】

**Traces**: REQ-NFR-003

**説明**: ユーザー向けドキュメントを整備

**成果物**:
- `shiden/README.md`（更新）
- `shiden/docs/USAGE.md`
- `shiden/CHANGELOG.md`

**サブタスク**:
```
□ TSK-6.2.1: README.md完成
   - クイックスタート（3ステップ）
   - 機能一覧
   - スクリーンショット（任意）

□ TSK-6.2.2: USAGE.md作成
   - 各スキルの使用例
   - メタプロンプト生成の流れ
   - TENJIN連携の説明

□ TSK-6.2.3: CHANGELOG.md作成
   - v1.0.0 初版リリースノート
   - 含まれる機能一覧
```

**完了基準**:
- [ ] READMEに3ステップクイックスタート
- [ ] 各スキルの使用例が記載
- [ ] CHANGELOGが存在

**依存タスク**: TSK-3.1〜3.6

**見積もり**: 1.5時間

---

### TSK-6.3: npm公開準備 【P0】

**Traces**: DES-DIST → REQ-NFR-001

**説明**: npm公開の最終準備

**成果物**:
- 公開可能な状態のパッケージ

**サブタスク**:
```
□ TSK-6.3.1: package.json最終確認
   - バージョン: 1.0.0
   - name: shiden
   - files フィールド確認
   - keywords, description確認

□ TSK-6.3.2: npm pack テスト
   - パッケージサイズ確認
   - 含まれるファイル確認

□ TSK-6.3.3: .npmignore確認
   - テストファイル除外
   - 開発用ファイル除外

□ TSK-6.3.4: ライセンス確認
   - MIT License
   - 依存パッケージのライセンス互換性
```

**完了基準**:
- [ ] `npm pack` でパッケージ作成成功
- [ ] パッケージサイズが適切（目安: 500KB以下）
- [ ] 必要なファイルのみ含まれる

**依存タスク**: TSK-6.1, TSK-6.2

**見積もり**: 1時間

---

## 8. 実行順序・依存関係図

```
Phase 1: 基盤構築
┌─────────┐
│ TSK-1.1 │ npm パッケージ初期化
└────┬────┘
     │
     ├────────────┬────────────┐
     ▼            ▼            ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│ TSK-1.2 │ │ TSK-1.3 │ │         │
│ディレクトリ│ │ 型定義  │ │         │
└────┬────┘ └────┬────┘ │         │
     │            │       │         │
     ▼            │       │         │
Phase 2: オーケストレーション層      │
┌─────────┐       │       │         │
│ TSK-2.1 │◀──────┘       │         │
│AGENTS.md│               │         │
└────┬────┘               │         │
     │                    │         │
     ├────────────┐       │         │
     ▼            ▼       │         │
┌─────────┐ ┌─────────┐   │         │
│ TSK-2.2 │ │ TSK-2.3 │   │         │
│meta-prompt│ │orchestrator│ │         │
└────┬────┘ └────┬────┘   │         │
     │            │       │         │
     ▼            │       │         │
Phase 3: スキル層（並列実行可能）     │
┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│ TSK-3.1 │ TSK-3.2 │ TSK-3.3 │ TSK-3.4 │ TSK-3.5 │ TSK-3.6 │
│lesson   │materials│assess   │individual│feedback │guidance │
└────┬────┴────┬────┴────┬────┴────┬────┴────┬────┴────┬────┘
     │         │         │         │         │         │
     └─────────┴─────────┴────┬────┴─────────┴─────────┘
                              │
                              ▼
Phase 4: 統合層
┌─────────┐ ┌─────────┐
│ TSK-4.1 │ │ TSK-4.2 │
│theory   │ │context  │
└────┬────┘ └────┬────┘
     │            │
     └─────┬──────┘
           │
           ▼
Phase 5: CLI実装
┌─────────┐
│ TSK-5.1 │◀─────── TSK-1.1, TSK-1.3
│CLI entry│
└────┬────┘
     │
     ▼
┌─────────┐
│ TSK-5.2 │◀─────── TSK-1.2
│init cmd │
└────┬────┘
     │
     ▼
┌─────────┐
│ TSK-5.3 │
│CLI test │
└────┬────┘
     │
     ▼
Phase 6: テスト・ドキュメント
┌─────────┐ ┌─────────┐ ┌─────────┐
│ TSK-6.1 │ │ TSK-6.2 │ │ TSK-6.3 │
│統合テスト│ │ドキュメント│ │npm公開 │
└─────────┘ └─────────┘ └─────────┘
```

---

## 9. 改訂履歴

| バージョン | 日付 | 変更内容 | 著者 |
|-----------|------|---------|------|
| 1.0.0 | 2026-01-21 | 初版作成（20タスク、6フェーズ） | AI Assistant |

---

## 10. 承認

| 役割 | 名前 | 日付 | 署名 |
|------|------|------|------|
| プロダクトオーナー | | | |
| 技術リード | | | |
