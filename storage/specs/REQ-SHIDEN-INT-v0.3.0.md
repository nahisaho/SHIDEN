# SHIDEN-TENJIN 直接統合 要件定義書

## 📋 プロジェクト概要

| 項目 | 内容 |
|------|------|
| **プロジェクト名** | SHIDEN-TENJIN Direct Integration |
| **バージョン** | 0.3.0 |
| **作成日** | 2026-01-21 |
| **更新日** | 2026-01-21 |
| **目的** | SHIDENから教育理論データベースを直接利用可能にする |
| **データベース** | SQLite (better-sqlite3) |

---

## 🎯 ビジネス要件

### BR-001: 教育理論の即時参照

**背景**: 現在SHIDENはTENJIN MCPサーバー（Neo4j + Docker）を別途起動する必要があり、教育者にとってセットアップが複雑。

**目標**: `npx shiden init`後、追加設定なしで175+の教育理論を参照できるようにする。

### BR-002: ゼロ設定での動作

**背景**: 教育現場ではDockerやデータベースサーバーの運用が困難。

**目標**: SQLiteを使用し、npm installのみで完結する軽量な構成を実現。

---

## 📐 機能要件（EARS形式）

### REQ-SHIDEN-INT-001: SQLite教育理論データベース

**Ubiquitous**:
> THE system SHALL include a bundled SQLite database containing at least 175 educational theories with graph relationships.

**優先度**: P0（必須）
**根拠**: Docker/Neo4j不要で教育者が即座に利用可能
**技術選定**: better-sqlite3（同期API、高速、ネイティブバインディング）

---

### REQ-SHIDEN-INT-002: 理論検索機能（FTS5）

**Event-driven**:
> WHEN the user requests theory lookup, THE system SHALL search the SQLite FTS5 index and return matching theories within 50ms.

**優先度**: P0（必須）
**検索対象**:
- 理論名（日英、部分一致）
- カテゴリ（完全一致）
- キーワード（FTS5全文検索）
- 説明文（FTS5全文検索）

**日本語対応**:
- トークナイザー: `trigram`（3文字N-gram）
- 理由: 日本語は単語境界がないため、形態素解析なしで検索可能
- 検索例: "認知負荷" → "認知", "知負", "負荷" でマッチ

---

### REQ-SHIDEN-INT-003: 理論詳細取得

**Event-driven**:
> WHEN the user requests theory details by ID, THE system SHALL return the complete theory information including name, description, principles, applications, and citations.

**優先度**: P0（必須）

---

### REQ-SHIDEN-INT-004: カテゴリ一覧取得

**Ubiquitous**:
> THE system SHALL provide a list of all available theory categories.

**優先度**: P1（重要）
**カテゴリ例**:
- `learning_theory` - 学習理論
- `developmental` - 発達心理学
- `instructional_design` - 授業設計
- `motivation` - 動機づけ
- `assessment` - 評価理論
- `curriculum` - カリキュラム設計

---

### REQ-SHIDEN-INT-005: グラフ走査（関連理論）

**Event-driven**:
> WHEN the user requests related theories, THE system SHALL traverse the graph using recursive CTE and return related theories up to depth 3.

**優先度**: P1（重要）
**技術**: SQLite WITH RECURSIVE CTE
**関係タイプ**:
- `related_to` - 関連理論
- `influenced_by` - 影響を受けた理論
- `influences` - 影響を与えた理論

---

### REQ-SHIDEN-INT-006: TENJIN連携（オプション）

**Optional**:
> IF TENJIN MCP Server is available, THEN THE system SHALL prefer TENJIN for advanced features (semantic search, LLM reranking).

**優先度**: P2（任意）
**高度な機能**（TENJINのみ）:
- ベクトル類似検索
- LLMリランキング
- リアルタイム更新

---

### REQ-SHIDEN-INT-007: オフライン動作

**Ubiquitous**:
> THE system SHALL function without network connectivity using the bundled SQLite database.

**優先度**: P0（必須）
**根拠**: 学校環境ではネットワーク制限がある場合がある

---

### REQ-SHIDEN-INT-008: CLIコマンド

**Event-driven**:
> WHEN the CLI command `shiden theories <subcommand>` is executed, THE system SHALL perform the requested operation on the SQLite database.

**優先度**: P1（重要）
**サブコマンド**:
- `list` - 理論一覧表示
- `search <query>` - 理論検索
- `get <id>` - 理論詳細取得
- `categories` - カテゴリ一覧
- `related <id>` - 関連理論取得

---

## 🚫 非機能要件

### NFR-001: パフォーマンス

| 操作 | 目標 | 備考 |
|------|------|------|
| 理論検索（FTS5 trigram） | < 50ms | 日本語N-gram検索含む |
| 理論詳細取得 | < 10ms | ID直接取得 |
| グラフ走査（深さ3） | < 100ms | WITH RECURSIVE CTE |
| 起動時間 | < 200ms | SQLite接続含む |

**trigram検索の特性**:
- インデックスサイズ: 通常FTS5の約3倍
- 検索速度: 175件程度なら影響軽微
- 日本語精度: 形態素解析なしで高精度マッチ

### NFR-002: パッケージサイズ

| 項目 | 制限 |
|------|------|
| SQLiteデータベース | < 2MB |
| better-sqlite3 | 〜3MB（ネイティブ） |
| npm パッケージ全体 | < 10MB |

### NFR-003: 互換性

| 項目 | 要件 |
|------|------|
| Node.js | >= 20.0.0 |
| OS | Windows, macOS, Linux |
| SQLite | 3.x（better-sqlite3内包） |
| TENJIN連携 | オプション |

---

## 📊 データベーススキーマ

### theories テーブル

```sql
CREATE TABLE theories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_ja TEXT,
  category TEXT NOT NULL,
  description TEXT,
  description_ja TEXT,
  theorists TEXT,        -- JSON配列
  priority INTEGER DEFAULT 5,
  key_principles TEXT,   -- JSON配列
  applications TEXT,     -- JSON配列
  strengths TEXT,        -- JSON配列
  limitations TEXT       -- JSON配列
);

CREATE INDEX idx_theories_category ON theories(category);
CREATE INDEX idx_theories_name ON theories(name);
```

### theory_relations テーブル

```sql
CREATE TABLE theory_relations (
  source_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  relation_type TEXT NOT NULL DEFAULT 'related_to',
  weight REAL DEFAULT 1.0,
  PRIMARY KEY (source_id, target_id, relation_type),
  FOREIGN KEY (source_id) REFERENCES theories(id),
  FOREIGN KEY (target_id) REFERENCES theories(id)
);

CREATE INDEX idx_relations_source ON theory_relations(source_id);
CREATE INDEX idx_relations_target ON theory_relations(target_id);
```

### FTS5 全文検索インデックス（日本語対応）

```sql
-- trigram トークナイザーで日本語N-gram検索を実現
CREATE VIRTUAL TABLE theories_fts USING fts5(
  name, name_ja, description, description_ja,
  key_principles, applications,
  content='theories',
  content_rowid='rowid',
  tokenize='trigram'
);

-- トリガーで自動同期
CREATE TRIGGER theories_ai AFTER INSERT ON theories BEGIN
  INSERT INTO theories_fts(rowid, name, name_ja, description, description_ja, key_principles, applications)
  VALUES (NEW.rowid, NEW.name, NEW.name_ja, NEW.description, NEW.description_ja, NEW.key_principles, NEW.applications);
END;

CREATE TRIGGER theories_ad AFTER DELETE ON theories BEGIN
  INSERT INTO theories_fts(theories_fts, rowid, name, name_ja, description, description_ja, key_principles, applications)
  VALUES ('delete', OLD.rowid, OLD.name, OLD.name_ja, OLD.description, OLD.description_ja, OLD.key_principles, OLD.applications);
END;

CREATE TRIGGER theories_au AFTER UPDATE ON theories BEGIN
  INSERT INTO theories_fts(theories_fts, rowid, name, name_ja, description, description_ja, key_principles, applications)
  VALUES ('delete', OLD.rowid, OLD.name, OLD.name_ja, OLD.description, OLD.description_ja, OLD.key_principles, OLD.applications);
  INSERT INTO theories_fts(rowid, name, name_ja, description, description_ja, key_principles, applications)
  VALUES (NEW.rowid, NEW.name, NEW.name_ja, NEW.description, NEW.description_ja, NEW.key_principles, NEW.applications);
END;
```

### FTS5 検索クエリ例

```sql
-- 日本語検索（trigram）
SELECT t.*, bm25(theories_fts) as score
FROM theories_fts
JOIN theories t ON theories_fts.rowid = t.rowid
WHERE theories_fts MATCH '認知負荷'
ORDER BY score;

-- 英語検索
SELECT t.*, bm25(theories_fts) as score
FROM theories_fts
JOIN theories t ON theories_fts.rowid = t.rowid
WHERE theories_fts MATCH 'cognitive load'
ORDER BY score;

-- ハイライト付き
SELECT highlight(theories_fts, 1, '<b>', '</b>') as highlighted_name_ja
FROM theories_fts
WHERE theories_fts MATCH '動機';
```

### グラフ走査クエリ（WITH RECURSIVE）

```sql
-- 関連理論を深さ3まで取得
WITH RECURSIVE related_graph AS (
  -- 起点
  SELECT target_id, relation_type, 1 as depth
  FROM theory_relations
  WHERE source_id = :theory_id
  
  UNION ALL
  
  -- 再帰
  SELECT r.target_id, r.relation_type, rg.depth + 1
  FROM theory_relations r
  INNER JOIN related_graph rg ON r.source_id = rg.target_id
  WHERE rg.depth < 3
)
SELECT DISTINCT t.*, rg.depth, rg.relation_type
FROM related_graph rg
JOIN theories t ON t.id = rg.target_id
ORDER BY rg.depth, t.name;
```

---

## 🔄 ユースケース

### UC-001: 授業計画作成時の理論参照

```
1. 教育者が「中学2年生の数学の授業計画を作成して」と依頼
2. SHIDENがlesson-plan.mdスキルを実行
3. スキルがtheory-lookup.mdを呼び出し
4. theory-lookupがSQLiteから適切な理論を検索（FTS5）
   - "Bloom's Taxonomy"（目標設定）
   - "Cognitive Load Theory"（難易度調整）
   - "Zone of Proximal Development"（個別対応）
5. 関連理論をグラフ走査で取得（WITH RECURSIVE）
6. 検索結果を授業計画に組み込み
7. エビデンス付きの授業計画を返却
```

### UC-002: CLIでの理論検索

```bash
# 理論検索
$ npx shiden theories search "動機づけ"
Found 5 theories:
  1. ARCS Model (motivation)
  2. Self-Determination Theory (learning_theory)
  3. Expectancy-Value Theory (motivation)
  ...

# 詳細取得
$ npx shiden theories get theory-029
Expectancy-Value Theory (期待価値理論)
Category: motivation
Theorists: Jacquelynne S. Eccles
...

# 関連理論
$ npx shiden theories related theory-029
Related theories (depth 2):
  └─ Self-Determination Theory (related_to)
     └─ Intrinsic Motivation Theory (influenced_by)
```

---

## ✅ 受け入れ基準

### AC-001: SQLite動作

- [ ] `npx shiden init`後、追加設定なしで理論検索が動作する
- [ ] 175+の教育理論がSQLiteにバンドルされている
- [ ] FTS5検索レスポンスが50ms以内

### AC-002: グラフ走査

- [ ] `shiden theories related <id>`で関連理論が取得できる
- [ ] 深さ3までの関連理論がWITH RECURSIVEで取得できる
- [ ] 関係タイプ（related_to, influenced_by）が正しく表示される

### AC-003: スキル連携

- [ ] lesson-plan.mdから理論検索が呼び出せる
- [ ] 検索結果が適切にフォーマットされて返却される
- [ ] 日本語での検索が動作する

### AC-004: CLIコマンド

- [ ] `npx shiden theories list` - 理論一覧表示
- [ ] `npx shiden theories search <query>` - 理論検索（FTS5）
- [ ] `npx shiden theories get <id>` - 理論詳細取得
- [ ] `npx shiden theories categories` - カテゴリ一覧
- [ ] `npx shiden theories related <id>` - 関連理論取得

---

## 📋 レビュー結果

| 観点 | 状態 | 詳細 |
|------|------|------|
| EARS形式 | ✅ OK | 全要件がEARS形式で記述 |
| 優先度設定 | ✅ OK | P0/P1/P2で分類済み |
| トレーサビリティ | ✅ OK | REQ-ID付与済み |
| 受け入れ基準 | ✅ OK | 検証可能な形式 |
| 技術選定 | ✅ OK | SQLite + better-sqlite3 |

---

👉 **次のアクションを選択してください:**
- 「修正」/ 具体的な修正指示 → 修正して再提示
- 「承認」/「OK」/「進める」 → 設計フェーズへ

