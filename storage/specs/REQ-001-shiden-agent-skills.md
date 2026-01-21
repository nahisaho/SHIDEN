# 要件仕様書: SHIDEN - 教育者向けGitHub Copilot Agent Skills

## メタデータ

| 項目 | 値 |
|------|----|
| **ID** | REQ-001 |
| **Version** | 1.0.0 |
| **Created** | 2026-01-21 |
| **Updated** | 2026-01-21 |
| **Status** | 📝 Draft → Review Required |
| **Author** | AI Assistant |
| **Phase** | Phase 1: 要件定義 |

### MUSUBIX憲法準拠状況

| 条項 | 準拠状況 | 備考 |
|------|---------|------|
| I. Library-First | ✅ 準拠 | npm パッケージとして設計 |
| II. CLI Interface | ✅ 準拠 | `npx shiden init` コマンド定義 |
| III. Test-First | ⏳ 次フェーズ | テスト要件を受入基準として定義 |
| IV. EARS Format | ✅ 準拠 | 全58要件がEARS形式 |
| V. Traceability | ✅ 準拠 | REQ-ID体系を定義 |
| VI. Project Memory | ✅ 参照 | AGENTS.md参照 |
| VII. Design Patterns | ⏳ 次フェーズ | 設計フェーズで適用 |
| VIII. Decision Records | ⏳ 次フェーズ | 設計決定時にADR作成 |
| IX. Quality Gates | ✅ 準拠 | Phase 1完了時にレビュー |
| X. Implementation Prerequisites | ✅ 準拠 | 要件→設計→タスク→実装の順序 |

### 要件サマリー

| カテゴリ | P0 | P1 | P2 | 合計 |
|---------|----|----|----|----- |
| オーケストレーション | 2 | 3 | 0 | 5 |
| メタプロンプト生成 | 6 | 0 | 0 | 6 |
| 授業計画（UC-001） | 2 | 1 | 0 | 3 |
| 教材作成（UC-002） | 2 | 1 | 1 | 4 |
| 評価設計（UC-003） | 2 | 2 | 0 | 4 |
| 個別指導（UC-004） | 0 | 1 | 3 | 4 |
| フィードバック（UC-005） | 2 | 2 | 0 | 4 |
| 生活指導（UC-006） | 2 | 2 | 1 | 5 |
| GraphRAG連携 | 3 | 1 | 0 | 4 |
| 非機能（配布・性能・保守） | 9 | 2 | 1 | 12 |
| 制約条件 | 6 | 0 | 0 | 6 |
| **合計** | **36** | **15** | **6** | **57** |

---

## 1. 概要

### 1.1 プロジェクト概要

**SHIDEN**は、教育者（小中高教員・大学教員）向けのGitHub Copilot Agent Skillsパッケージです。TENJIN（教育理論GraphRAG MCPサーバー）と連携し、エビデンスに基づいた高品質な教育コンテンツ作成を支援します。

### 1.2 目的

| 項目 | 内容 |
|------|------|
| **主目的** | エビデンス（教育理論）に基づいた教育コンテンツ作成のハードルを下げる |
| **副次目的** | 学習者への個別最適化された教育指導を実現する |
| **ビジョン** | これまでの教育とは次元の異なる教育の実現 |

### 1.3 ターゲットユーザー

| ユーザー種別 | 説明 | 技術レベル |
|-------------|------|-----------|
| 小中高教員 | 日常的に授業・生活指導を行う教員 | 初級〜中級 |
| 大学教員 | 講義・研究指導を行う教員 | 中級〜上級 |

### 1.4 関連システム

| システム | 役割 |
|---------|------|
| **TENJIN** | 175件の教育理論を提供するGraphRAG MCPサーバー |
| **GitHub Copilot** | Agent Skills実行環境 |
| **VS Code** | 開発・利用環境 |

### 1.5 技術的実装方針

#### 実装優先順位

| 優先度 | 実装方式 | 用途 |
|--------|---------|------|
| **1st** | **Markdown（Agent Skills）** | プロンプト定義、スキル定義、オーケストレーション |
| **2nd** | TypeScript | Markdownで実現困難な複雑なロジック、ユーティリティ関数 |

#### 実装構成

```
shiden/
├── AGENTS.md                    # オーケストレーター定義
├── .github/
│   ├── prompts/                 # プロンプトファイル（Markdown）
│   │   ├── lesson-plan.md       # 授業計画作成プロンプト
│   │   ├── materials.md         # 教材作成プロンプト
│   │   ├── assessment.md        # 評価設計プロンプト
│   │   ├── feedback.md          # フィードバックプロンプト
│   │   ├── guidance.md          # 生活指導プロンプト
│   │   └── individual.md        # 個別指導プロンプト
│   └── skills/                  # スキル定義（Markdown）
│       ├── orchestrator.md      # オーケストレーションスキル
│       ├── theory-lookup.md     # 教育理論検索スキル
│       └── ...
├── src/                         # TypeScript（必要な場合のみ）
│   ├── utils/                   # ユーティリティ関数
│   └── types/                   # 型定義
└── package.json                 # npm パッケージ定義
```

#### Markdown実装の原則

1. **プロンプトファーストアプローチ**: スキルのロジックは可能な限りMarkdownプロンプトで表現
2. **宣言的記述**: 手続き的なコードよりも宣言的なプロンプト記述を優先
3. **TypeScript使用条件**:
   - 複雑な文字列処理・データ変換が必要な場合
   - 外部API連携のラッパーが必要な場合
   - 型安全性が特に重要な共有ユーティリティ

---

## 2. 機能要件（EARS形式）

### 優先度定義

| 優先度 | 説明 | リリース |
|--------|------|---------|
| **P0** | 必須機能。初回リリースに含める | v1.0 |
| **P1** | 重要機能。早期リリースで対応 | v1.1 |
| **P2** | 任意機能。将来リリースで検討 | v1.2+ |

---

### 2.1 オーケストレーション機能

#### REQ-ORCH-001: スキルルーティング（Ubiquitous）【P0】
THE system SHALL analyze user intent and route requests to the appropriate skill based on the detected use case category.

**受入基準:**
- [ ] 6つのユースケース（授業計画、教材、評価、個別指導、フィードバック、生活指導）を正しく識別
- [ ] 意図不明な場合はユーザーに確認を求める
- [ ] ルーティング精度90%以上（テストケースで検証）

---

### 2.2 プロンプト強化・メタプロンプト生成機能

#### REQ-META-001: プロンプト強化（Event-driven）【P0】
WHEN a user provides an initial request, THE system SHALL analyze, enhance, and restructure the prompt to clarify the true intent.

**受入基準:**
- [ ] ユーザーの曖昧な入力を構造化された形式に変換
- [ ] 暗黙の前提条件を明示化
- [ ] 欠落している重要な要素を特定

#### REQ-META-002: 強化プロンプト確認（Event-driven）【P0】
WHEN the system enhances a user prompt, THE system SHALL present the enhanced prompt to the user for confirmation before proceeding.

**受入基準:**
- [ ] 強化されたプロンプトをユーザーに提示
- [ ] 元のプロンプトと強化版の差分を説明
- [ ] ユーザーが修正・承認できるインターフェース

**確認フォーマット例:**
```
📝 あなたのリクエストを以下のように理解しました：

【元のリクエスト】
「中学2年生向けの数学の授業計画を作って」

【強化されたリクエスト】
- 対象: 中学2年生
- 教科: 数学
- 単元: （未指定 → 確認が必要）
- 授業時間: （未指定 → 50分と仮定）
- 学習目標: （未指定 → 確認が必要）

👉 この理解で正しいですか？修正があればお知らせください。
```

#### REQ-META-003: コンテキスト収集（Event-driven）【P0】
WHEN additional context is needed for optimal response generation, THE system SHALL collect context through a series of focused single questions (1問1答形式).

**受入基準:**
- [ ] 1度に1つの質問のみを提示
- [ ] 質問は具体的かつ回答しやすい形式
- [ ] 収集した回答を累積的に保持
- [ ] 必要最小限の質問数（最大5問を目安）

**質問フロー例:**
```
Q1: 「この授業で生徒に最も身につけてほしい力は何ですか？」
    → ユーザー回答

Q2: 「生徒の現在の理解度はどの程度ですか？（初学者/基礎習得済み/応用可能）」
    → ユーザー回答

Q3: 「特に配慮が必要な生徒はいますか？」
    → ユーザー回答
    
（コンテキスト十分と判断したら終了）
```

#### REQ-META-004: メタプロンプト生成（Event-driven）【P0】
WHEN sufficient context is collected, THE system SHALL generate an optimized meta-prompt that enables the AI to produce higher quality responses.

**受入基準:**
- [ ] 収集したコンテキストを統合したメタプロンプトを生成
- [ ] メタプロンプトに教育理論の参照指示を含む
- [ ] 出力形式・品質基準を明示
- [ ] メタプロンプトをユーザーに表示（透明性確保）

**メタプロンプト構造:**
```
【コンテキスト】
- 対象学年: 中学2年生
- 教科・単元: 数学・一次関数
- 学習目標: グラフから関数の式を読み取る力
- 生徒の状況: 基礎習得済み、視覚的支援が有効な生徒あり
- 授業時間: 50分

【参照すべき教育理論】
- 認知負荷理論（段階的な難易度設定）
- UDL（多様な表現方法）

【出力要件】
- 導入・展開・まとめの時間配分を含む
- 各活動に対応する教育理論の根拠を明記
- 差別化のポイントを含む

【品質基準】
- Bloom's Taxonomyの「応用」レベル以上の活動を含む
- 形成的評価のポイントを3箇所以上含む
```

#### REQ-META-005: 真の目的探索（Event-driven）【P0】
WHEN analyzing user input, THE system SHALL identify potential gaps between stated goals and underlying true objectives.

**受入基準:**
- [ ] 表面的な要求と潜在的なニーズを区別
- [ ] 「なぜその授業を行うのか」等の本質的な問いを含む
- [ ] 真の目的が異なる可能性がある場合は確認を促す

**探索質問例:**
```
「授業計画を作成」という要求に対して：
→ 「この単元を通じて、生徒にどのような変化を期待していますか？」
→ 「この授業の成功をどのように判断しますか？」
```

#### REQ-META-006: プロンプト強化フロー制御（Ubiquitous）【P0】
THE system SHALL follow the prompt enhancement workflow:
1. 初期プロンプト受信
2. プロンプト強化・構造化
3. ユーザー確認
4. 1問1答によるコンテキスト収集
5. メタプロンプト生成
6. スキル実行

**受入基準:**
- [ ] 上記フローが順序通りに実行される
- [ ] 各ステップでユーザーがスキップ可能（急ぎの場合）
- [ ] フロー全体の所要時間が妥当（目安: 2-3分以内）

---

### 2.3 コンテキスト管理機能

#### REQ-ORCH-002: コンテキスト管理（Ubiquitous）【P1】
THE system SHALL maintain conversation context across multiple skill invocations within a single session.

**受入基準:**
- [ ] セッション内で前回の入力情報を保持
- [ ] 「前の授業計画を基に」等の参照が可能
- [ ] コンテキストクリア機能が存在

#### REQ-ORCH-003: 教育理論参照（Event-driven）【P0】
WHEN generating educational content, THE system SHALL query TENJIN GraphRAG to retrieve relevant educational theories as evidence.

**受入基準:**
- [ ] TENJINへのクエリが正常に実行される
- [ ] 取得した理論が生成コンテンツに反映される
- [ ] TENJIN接続エラー時の適切なエラーハンドリング

#### REQ-ORCH-004: マルチスキル連携（Event-driven）【P1】
WHEN a user request requires multiple skills, THE system SHALL orchestrate skill execution in the optimal sequence.

**受入基準:**
- [ ] 「授業計画と教材を作成」等の複合リクエストに対応
- [ ] スキル間でデータを適切に受け渡し
- [ ] 実行順序の最適化（依存関係を考慮）

#### REQ-ORCH-005: フォールバック処理（Event-driven）【P1】
WHEN the primary skill fails or returns insufficient results, THE system SHALL attempt alternative skills or request clarification from the user.

**受入基準:**
- [ ] スキル失敗時にエラーメッセージを表示
- [ ] 代替アプローチの提案を行う
- [ ] ユーザーへの確認プロンプトを生成

---

### 2.2 授業計画作成スキル（Use Case 1）

#### REQ-LP-001: 指導案生成（Event-driven）【P0】
WHEN a user requests a lesson plan, THE system SHALL generate a structured lesson plan including:
- 学習目標（Bloom's Taxonomyに基づく）
- 導入・展開・まとめの時間配分
- 学習活動と教師の働きかけ
- 評価規準
- 参照した教育理論

**受入基準:**
- [ ] 上記5項目がすべて含まれる
- [ ] 学習目標がBloom's Taxonomy（または同等）に基づいている
- [ ] 参照した教育理論が1件以上明記されている

#### REQ-LP-002: 学習目標設定支援（Event-driven）【P0】
WHEN defining learning objectives, THE system SHALL suggest objectives aligned with Bloom's Taxonomy or other pedagogical frameworks from TENJIN.

**受入基準:**
- [ ] Bloom's Taxonomyの6段階（記憶〜創造）を活用
- [ ] TENJINから取得した理論フレームワークを適用
- [ ] 目標動詞（understand, apply, analyze等）を適切に使用

#### REQ-LP-003: 教科・学年対応（State-driven）【P1】
WHILE creating a lesson plan for a specific subject and grade level, THE system SHALL adapt content complexity and teaching strategies accordingly.

**受入基準:**
- [ ] 小学校・中学校・高校・大学で異なる複雑さの出力
- [ ] 教科特性に応じた指導法の提案
- [ ] 学習指導要領のレベルに準拠

---

### 2.3 教材・コンテンツ作成スキル（Use Case 2）

#### REQ-MAT-001: 教材生成（Event-driven）【P0】
WHEN a user requests educational materials, THE system SHALL generate content optimized for the specified learner level and learning objectives.

**受入基準:**
- [ ] 指定された学習者レベルに適した語彙・表現
- [ ] 学習目標との整合性
- [ ] 実際に授業で使用可能な形式

#### REQ-MAT-002: 多様な形式対応（Optional）【P1】
IF the user specifies a content format (worksheet, slide, quiz, etc.), THEN THE system SHALL generate content in the requested format.

**受入基準:**
- [ ] ワークシート、スライド、クイズ形式に対応
- [ ] 各形式に適した構造・レイアウトを提案
- [ ] Markdown形式で出力可能

#### REQ-MAT-003: 理論に基づく設計（Ubiquitous）【P0】
THE system SHALL apply instructional design principles (e.g., Gagné's Nine Events, ARCS Model) when creating educational materials.

**受入基準:**
- [ ] 使用した教授設計理論が明記される
- [ ] 理論の原則が教材構成に反映されている
- [ ] TENJINからの理論情報を活用

#### REQ-MAT-004: 差別化対応（Optional）【P2】
IF learner diversity information is provided, THEN THE system SHALL suggest differentiated materials for various learner needs.

**受入基準:**
- [ ] 学習者の多様性（習熟度、学習スタイル等）に応じた複数バージョンを提案
- [ ] UDL（Universal Design for Learning）原則を適用
- [ ] 具体的な差別化ポイントを説明

---

### 2.4 評価設計スキル（Use Case 3）

#### REQ-ASSESS-001: ルーブリック生成（Event-driven）【P0】
WHEN a user requests an assessment rubric, THE system SHALL generate criteria and performance levels aligned with learning objectives.

**受入基準:**
- [ ] 評価観点と評価基準が明確に記述される
- [ ] 3〜5段階のパフォーマンスレベルを含む
- [ ] 学習目標との対応が明示される

#### REQ-ASSESS-002: テスト問題生成（Event-driven）【P0】
WHEN a user requests test questions, THE system SHALL generate questions at appropriate cognitive levels based on Bloom's Taxonomy.

**受入基準:**
- [ ] 問題ごとに認知レベル（記憶、理解、応用等）を明記
- [ ] 解答例または解答基準を含む
- [ ] 問題形式（選択、記述、論述等）の指定に対応

#### REQ-ASSESS-003: 形成的評価設計（Event-driven）【P1】
WHEN designing formative assessments, THE system SHALL suggest assessment strategies based on formative assessment theory.

**受入基準:**
- [ ] 形成的評価の目的（診断、進捗確認等）を明示
- [ ] フィードバックの与え方の提案を含む
- [ ] 評価タイミングの推奨を含む

#### REQ-ASSESS-004: 評価の妥当性確認（Ubiquitous）【P1】
THE system SHALL ensure alignment between learning objectives, instruction, and assessment (constructive alignment).

**受入基準:**
- [ ] 学習目標・指導・評価の整合性チェック機能
- [ ] 不整合がある場合の警告表示
- [ ] 整合性を高めるための提案

---

### 2.5 個別指導計画スキル（Use Case 4）

#### REQ-IEP-001: 個別指導戦略提案（Event-driven）【P1】
WHEN learner characteristics are provided, THE system SHALL recommend personalized teaching strategies based on relevant learning theories.

**受入基準:**
- [ ] 学習者特性に基づいた理論を1件以上引用
- [ ] 具体的な指導戦略を3つ以上提案
- [ ] 各戦略の根拠となる理論を明示

#### REQ-IEP-002: 学習スタイル対応（Optional）【P2】
IF learning style preferences are specified, THEN THE system SHALL suggest activities aligned with those preferences.

**受入基準:**
- [ ] 視覚・聴覚・運動感覚等のスタイルに対応
- [ ] 各スタイルに適した活動を提案
- [ ] 学習スタイル理論の限界も併せて説明

#### REQ-IEP-003: 特別支援対応（Optional）【P2】
IF special educational needs are indicated, THEN THE system SHALL recommend evidence-based interventions and accommodations.

**受入基準:**
- [ ] 一般的な配慮事項を提案
- [ ] エビデンスに基づく介入を参照
- [ ] 専門家への相談を推奨する注記を含む

#### REQ-IEP-004: 進捗モニタリング提案（Event-driven）【P2】
WHEN creating an individualized plan, THE system SHALL include progress monitoring strategies and adjustment criteria.

**受入基準:**
- [ ] 進捗確認の頻度・方法を提案
- [ ] 目標達成基準を明示
- [ ] 計画修正のトリガー条件を定義

---

### 2.6 振り返り・フィードバックスキル（Use Case 5）

#### REQ-FB-001: フィードバック生成（Event-driven）【P0】
WHEN student work or performance data is provided, THE system SHALL generate constructive feedback based on formative assessment principles.

**受入基準:**
- [ ] 良い点と改善点の両方を含む
- [ ] 具体的かつ行動可能なフィードバック
- [ ] 批判的でなく建設的な表現

#### REQ-FB-002: 自己評価支援（Event-driven）【P1】
WHEN designing reflection activities, THE system SHALL create prompts that promote metacognitive skills.

**受入基準:**
- [ ] メタ認知を促す問いかけを含む
- [ ] 自己評価の観点を提示
- [ ] 振り返りの具体例を提供

#### REQ-FB-003: 成長マインドセット対応（Ubiquitous）【P0】
THE system SHALL frame feedback to support a growth mindset, focusing on effort and strategies rather than fixed ability.

**受入基準:**
- [ ] 「能力」ではなく「努力」「戦略」に焦点を当てた表現
- [ ] 失敗を学習機会として捉える言い回し
- [ ] 成長マインドセット理論に基づく表現チェック

#### REQ-FB-004: 次のステップ提案（Event-driven）【P1】
WHEN providing feedback, THE system SHALL suggest specific next steps for improvement.

**受入基準:**
- [ ] 具体的なアクションを1つ以上提案
- [ ] 実行可能な難易度の提案
- [ ] 次回の学習につながる提案

---

### 2.7 生活指導案作成スキル（Use Case 6）

#### REQ-GUID-001: 生活指導案生成（Event-driven）【P0】
WHEN a user requests a guidance plan, THE system SHALL generate a structured plan addressing student behavior, social-emotional development, or school life issues.

**受入基準:**
- [ ] 状況分析、目標設定、具体的介入、評価の4要素を含む
- [ ] 予防的・対応的アプローチを区別
- [ ] 参照した発達・行動理論を明記

#### REQ-GUID-002: 発達段階考慮（State-driven）【P0】
WHILE creating guidance plans, THE system SHALL consider developmental stage theories (e.g., Erikson, Kohlberg) appropriate for the student's age.

**受入基準:**
- [ ] 対象年齢に適した発達理論を引用
- [ ] 発達段階に応じた介入方法を提案
- [ ] 年齢不相応な介入に警告を表示

#### REQ-GUID-003: 予防的指導（Event-driven）【P1】
WHEN planning preventive guidance, THE system SHALL suggest proactive strategies based on positive behavioral interventions.

**受入基準:**
- [ ] ポジティブ行動介入支援（PBIS）原則を適用
- [ ] 予防的介入の具体例を3つ以上提案
- [ ] 学級・学校レベルでの予防策を含む

#### REQ-GUID-004: 危機対応支援（Event-driven）【P1】
WHEN addressing crisis situations, THE system SHALL provide evidence-based response frameworks while emphasizing the need for professional consultation.

**受入基準:**
- [ ] 危機対応フレームワーク（例: PFA）を参照
- [ ] 専門家への相談を強く推奨する注記を必ず含む
- [ ] 緊急連絡先リストの作成を推奨

#### REQ-GUID-005: 保護者連携提案（Optional）【P2】
IF family involvement is relevant, THEN THE system SHALL suggest communication strategies and collaboration approaches.

**受入基準:**
- [ ] 保護者への連絡方法・タイミングを提案
- [ ] 家庭との協力体制構築の方法を提示
- [ ] 文化的配慮に関する注記を含む

---

### 2.8 GraphRAG連携機能

#### REQ-GRAPH-001: 理論検索（Event-driven）【P0】
WHEN educational theory context is needed, THE system SHALL query TENJIN using appropriate search parameters (category, keyword, context).

**受入基準:**
- [ ] TENJINの11カテゴリから適切なカテゴリを選択
- [ ] キーワード・コンテキストに基づく検索が機能
- [ ] 検索結果が0件の場合の代替提案

#### REQ-GRAPH-002: 理論推薦（Event-driven）【P0】
WHEN generating content, THE system SHALL recommend relevant theories from TENJIN's 175+ theory database.

**受入基準:**
- [ ] 文脈に最も関連性の高い理論を3件以上提案
- [ ] 推薦理由を簡潔に説明
- [ ] 理論の優先度・重要度を考慮

#### REQ-GRAPH-003: エビデンス引用（Ubiquitous）【P0】
THE system SHALL include theory citations and references in generated content to ensure evidence-based practice.

**受入基準:**
- [ ] 理論名と理論家名を明記
- [ ] 出典情報（可能な場合）を含む
- [ ] 生成コンテンツの80%以上に理論引用を含む

#### REQ-GRAPH-004: 理論間関係活用（Event-driven）【P1】
WHEN deeper theoretical grounding is needed, THE system SHALL leverage TENJIN's graph relationships to find related theories.

**受入基準:**
- [ ] 関連理論の探索が機能
- [ ] 理論間の関係性（発展、対立、補完等）を説明
- [ ] グラフ走査による深い理論探索が可能

---

## 3. 非機能要件

### 3.1 配布・インストール

#### REQ-NFR-001: npmパッケージ（Ubiquitous）【P0】
THE system SHALL be distributed as an npm package installable via `npm install shiden`.

**受入基準:**
- [ ] `npm install shiden` でエラーなくインストール完了
- [ ] package.json に正しいメタデータ（name, version, main, types）が設定されている
- [ ] npmjs.com に公開されている

#### REQ-NFR-001a: パッケージ名予約（Ubiquitous）【P0】
THE system SHALL use the package name `shiden` on npm registry.

**受入基準:**
- [ ] npm パッケージ名 `shiden` が取得済み
- [ ] スコープなしのパッケージ名（`shiden`）でインストール可能
- [ ] パッケージ名がプロジェクト名と一致

#### REQ-NFR-001b: Agent Skills配布（Ubiquitous）【P0】
THE system SHALL distribute Agent Skills files (AGENTS.md, .github/prompts/, .github/skills/) as part of the npm package.

**受入基準:**
- [ ] AGENTS.md がパッケージに含まれる
- [ ] .github/prompts/ 配下のMarkdownファイルがパッケージに含まれる
- [ ] .github/skills/ 配下のMarkdownファイルがパッケージに含まれる
- [ ] package.json の `files` フィールドで配布対象が明示されている

#### REQ-NFR-001c: セットアップコマンド（Event-driven）【P0】
WHEN the user runs `npx shiden init`, THE system SHALL copy Agent Skills files to the user's project.

**受入基準:**
- [ ] `npx shiden init` コマンドが動作する
- [ ] AGENTS.md がプロジェクトルートにコピーされる
- [ ] .github/prompts/ がプロジェクトにコピーされる
- [ ] .github/skills/ がプロジェクトにコピーされる
- [ ] 既存ファイルがある場合は上書き確認を行う

#### REQ-NFR-001d: バージョン表示コマンド（Event-driven）【P0】
WHEN the user runs `npx shiden -v` or `npx shiden --version`, THE system SHALL display the current package version.

**受入基準:**
- [ ] `npx shiden -v` でバージョン番号が表示される
- [ ] `npx shiden --version` でバージョン番号が表示される
- [ ] 表示形式: `shiden vX.Y.Z`（例: `shiden v1.0.0`）
- [ ] package.json の version フィールドと一致する

#### REQ-NFR-001e: バージョン管理（Ubiquitous）【P0】
THE system SHALL follow semantic versioning (semver) for package releases.

**受入基準:**
- [ ] バージョン番号が semver 形式（MAJOR.MINOR.PATCH）
- [ ] CHANGELOG.md でバージョンごとの変更を記録
- [ ] 破壊的変更時は MAJOR バージョンを更新

#### REQ-NFR-002: 依存関係管理（Ubiquitous）【P0】
THE system SHALL declare all dependencies explicitly and avoid dependency conflicts.

**受入基準:**
- [ ] すべての依存パッケージが package.json に明示的に宣言されている
- [ ] peer dependency の警告が発生しない
- [ ] `npm audit` で critical/high の脆弱性がない

#### REQ-NFR-002a: 最小依存関係（Ubiquitous）【P0】
THE system SHALL minimize runtime dependencies, preferring Markdown-based implementation.

**受入基準:**
- [ ] ランタイム依存パッケージ数が5個以下
- [ ] TypeScriptコードは必要最小限
- [ ] 重い依存パッケージ（例: 大規模フレームワーク）を含まない

#### REQ-NFR-003: セットアップ簡便性（Ubiquitous）【P0】
THE system SHALL complete setup with a single command without manual configuration for basic use.

**受入基準:**
- [ ] インストール後、追加設定なしで基本機能が動作する
- [ ] README に3ステップ以内のクイックスタートが記載されている
- [ ] 設定ファイルの手動作成が不要

#### REQ-NFR-003a: クイックスタート手順（Ubiquitous）【P0】
THE system SHALL provide a quick start workflow as follows:
1. `npm install shiden`
2. `npx shiden init`
3. VS Code でAgent Skillsを使用開始

**受入基準:**
- [ ] 上記3ステップでAgent Skillsが使用可能
- [ ] 各ステップの所要時間が1分以内
- [ ] エラー発生時の対処法がREADMEに記載

### 3.2 性能

#### REQ-NFR-004: 応答時間（Ubiquitous）【P1】
THE system SHALL return initial response within 5 seconds for typical requests.

**受入基準:**
- [ ] 標準的なリクエストで初期応答が5秒以内
- [ ] TENJIN GraphRAG クエリを含むリクエストで10秒以内
- [ ] 性能テストでP95が目標値以内

#### REQ-NFR-005: GraphRAGキャッシュ（Optional）【P2】
IF frequently used theories are identified, THEN THE system SHALL cache them to improve response time.

**受入基準:**
- [ ] キャッシュヒット時の応答時間が50%以上改善
- [ ] キャッシュサイズの上限が設定可能
- [ ] キャッシュの無効化が可能

### 3.3 保守性

#### REQ-NFR-006: モジュラー設計（Ubiquitous）【P0】
THE system SHALL follow modular architecture allowing individual skill updates without affecting others.

**受入基準:**
- [ ] 各スキルが独立したモジュールとして実装されている
- [ ] 1つのスキル変更が他のスキルのテストに影響しない
- [ ] スキル単位でのバージョン管理が可能

#### REQ-NFR-007: スキル拡張性（Ubiquitous）【P1】
THE system SHALL provide extension points for adding new skills.

**受入基準:**
- [ ] 新規スキル追加のためのインターフェースが定義されている
- [ ] カスタムスキル追加のドキュメントが存在する
- [ ] サンプルスキルのテンプレートが提供されている

---

## 4. 制約条件（Unwanted Requirements）

### 4.1 コンテンツ安全性

#### REQ-CON-001: 不適切コンテンツ禁止（Unwanted）【P0】
THE system SHALL NOT generate educational content that is inappropriate, harmful, or unsuitable for educational settings.

**受入基準:**
- [ ] 暴力的、性的、差別的な内容を生成しない
- [ ] 不適切コンテンツのフィルタリングテストに100%合格
- [ ] コンテンツ安全性ガイドラインが文書化されている

#### REQ-CON-002: 年齢不適切禁止（Unwanted）【P0】
THE system SHALL NOT generate content inappropriate for the specified learner age group.

**受入基準:**
- [ ] 学年・年齢に応じた語彙・複雑さの調整が行われる
- [ ] 年齢不適切な例や比喩を使用しない
- [ ] 各学年レベルのコンテンツ検証テストに合格

### 4.2 教員専門性尊重

#### REQ-CON-003: 専門性侵害禁止（Unwanted）【P0】
THE system SHALL NOT override or dismiss teacher professional judgment in pedagogical decisions.

**受入基準:**
- [ ] 生成結果は「提案」として提示され、「指示」として提示されない
- [ ] 教員の修正・カスタマイズを前提とした出力形式
- [ ] 「最終判断は教員に委ねる」旨のメッセージを含む

#### REQ-CON-004: 自動決定禁止（Unwanted）【P0】
THE system SHALL NOT make final decisions on student assessment, placement, or disciplinary actions without teacher review.

**受入基準:**
- [ ] 評価結果を「確定」として出力しない
- [ ] 進路・配置に関する断定的な推奨をしない
- [ ] 懲戒処分の決定を支援しない

### 4.3 プライバシー

#### REQ-CON-005: 個人情報保護（Unwanted）【P0】
THE system SHALL NOT store or transmit personally identifiable student information.

**受入基準:**
- [ ] 生徒の氏名、学籍番号等を外部に送信しない
- [ ] ローカル処理で個人情報を保持しない
- [ ] プライバシーポリシーが文書化されている

#### REQ-CON-006: データ最小化（Ubiquitous）【P0】
THE system SHALL request only the minimum information necessary for the task.

**受入基準:**
- [ ] 必須入力項目が最小限に設計されている
- [ ] 任意項目と必須項目が明確に区別されている
- [ ] 不要な情報の入力を求めない

---

## 5. ユースケース詳細

### UC-001: 授業計画作成

```
Actor: 教員
Precondition: 教科、単元、学年が決まっている
Main Flow:
  1. 教員が授業計画作成を依頼
  2. システムが教科・学年・単元情報を確認
  3. システムがTENJINから関連教育理論を取得
  4. システムが指導案を生成
  5. 教員が確認・修正
Postcondition: エビデンスに基づいた指導案が完成
Alternative Flow:
  3a. 理論が見つからない場合、汎用的な教授法を適用
```

### UC-002: 教材・コンテンツ作成

```
Actor: 教員
Precondition: 学習目標が明確である
Main Flow:
  1. 教員が教材作成を依頼（形式指定可）
  2. システムが学習者レベルを確認
  3. システムがインストラクショナルデザイン理論を参照
  4. システムが教材を生成
  5. 教員が確認・カスタマイズ
Postcondition: 学習者レベルに適した教材が完成
```

### UC-003: 評価設計

```
Actor: 教員
Precondition: 学習目標と指導内容が決まっている
Main Flow:
  1. 教員が評価ツール作成を依頼
  2. システムが学習目標との整合性を確認
  3. システムが評価理論を参照
  4. システムがルーブリック/テスト問題を生成
  5. 教員が確認・調整
Postcondition: 学習目標に整合した評価ツールが完成
```

### UC-004: 個別指導計画

```
Actor: 教員
Precondition: 学習者の特性情報がある
Main Flow:
  1. 教員が個別指導の相談を依頼
  2. システムが学習者特性を確認
  3. システムが関連する学習理論・発達理論を検索
  4. システムが個別化された指導戦略を提案
  5. 教員が計画を確定
Postcondition: エビデンスに基づいた個別指導計画が完成
```

### UC-005: 振り返り・フィードバック

```
Actor: 教員
Precondition: 学習者の成果物または活動データがある
Main Flow:
  1. 教員がフィードバック作成を依頼
  2. システムが成果物/データを分析
  3. システムが形成的評価理論を参照
  4. システムが建設的フィードバックを生成
  5. 教員が確認・個別調整
Postcondition: 成長を促すフィードバックが完成
```

### UC-006: 生活指導案作成

```
Actor: 教員
Precondition: 指導が必要な状況・課題が特定されている
Main Flow:
  1. 教員が生活指導の相談を依頼
  2. システムが状況・対象生徒の発達段階を確認
  3. システムが発達理論・行動理論を検索
  4. システムが指導案を生成（予防的/対応的）
  5. 教員が確認・専門家相談の要否を判断
Postcondition: エビデンスに基づいた生活指導案が完成
Alternative Flow:
  4a. 危機的状況の場合、専門家への相談を強く推奨
```

---

## 6. 成功指標

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| 教育理論の引用率 | ≥80% | 生成コンテンツ内の理論参照数 |
| 教員による採用率 | ≥70% | ユーザーフィードバック調査 |
| ユースケースカバー率 | 6/6領域 | 機能実装状況 |
| npm install成功率 | 100% | 自動テスト |
| 初期応答時間 | ≤5秒 | 性能テスト |

---

## 7. 用語定義

| 用語 | 定義 |
|------|------|
| **SHIDEN** | 本プロジェクトの名称。教育者向けAgent Skillsパッケージ |
| **TENJIN** | 175件の教育理論を収録したGraphRAG MCPサーバー |
| **Agent Skills** | GitHub Copilotの拡張機能として動作するスキル群 |
| **GraphRAG** | グラフ構造とベクトル検索を組み合わせた検索・推論技術 |
| **EARS** | Easy Approach to Requirements Syntax（要件記述形式） |
| **オーケストレーション** | 複数スキルの連携・調整を行う機能 |

---

## 8. 参照ドキュメント

| ドキュメント | 説明 |
|-------------|------|
| [TENJIN README](https://github.com/nahisaho/TENJIN) | 教育理論GraphRAG MCPサーバー |
| [GitHub Copilot Agent Skills](https://docs.github.com/en/copilot) | Agent Skills仕様 |
| [MUSUBIX AGENTS.md](../../../AGENTS.md) | AI Agent向けガイドライン |

---

## 9. 改訂履歴

| バージョン | 日付 | 変更内容 | 著者 |
|-----------|------|---------|------|
| 1.0.0 | 2026-01-21 | 初版作成（57要件、6ユースケース定義） | AI Assistant |
| 1.0.0 | 2026-01-21 | 優先度（P0/P1/P2）、受入基準追加 | AI Assistant |
| 1.0.0 | 2026-01-21 | 実装方針（Markdown-first）追加 | AI Assistant |
| 1.0.0 | 2026-01-21 | npm配布要件（REQ-NFR-001a〜d）追加 | AI Assistant |
| 1.0.0 | 2026-01-21 | メタプロンプト生成機能（REQ-META-001〜006）追加 | AI Assistant |
| 1.0.0 | 2026-01-21 | MUSUBIX憲法準拠メタデータ追加 | AI Assistant |

---

## 10. 承認

| 役割 | 名前 | 日付 | 署名 |
|------|------|------|------|
| プロダクトオーナー | | | |
| 技術リード | | | |
