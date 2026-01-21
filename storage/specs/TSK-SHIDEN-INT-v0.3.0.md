# SHIDEN-TENJIN 直接統合 タスク分解書

## 📋 ドキュメント情報

| 項目 | 内容 |
|------|------|
| **タスクID** | TSK-SHIDEN-INT-v0.3.0 |
| **対応設計** | DES-SHIDEN-INT-v0.3.0 |
| **対応要件** | REQ-SHIDEN-INT-v0.3.0 |
| **作成日** | 2026-01-21 |

---

## 📊 タスク一覧

| # | タスクID | タイトル | 工数 | 依存 | 優先度 |
|---|----------|----------|------|------|--------|
| 1 | TSK-001 | Neo4jからデータエクスポート | 30min | - | P0 |
| 2 | TSK-002 | SQLiteスキーマ作成・データ投入 | 45min | TSK-001 | P0 |
| 3 | TSK-003 | 型定義（types.ts） | 15min | - | P0 |
| 4 | TSK-004 | データベース接続（database.ts） | 20min | TSK-002 | P0 |
| 5 | TSK-005 | TheoryRepository実装 | 45min | TSK-003,004 | P0 |
| 6 | TSK-006 | TheoryService実装 | 30min | TSK-005 | P0 |
| 7 | TSK-007 | CLIコマンド実装（theories.ts） | 45min | TSK-006 | P1 |
| 8 | TSK-008 | theory-lookup.md更新 | 15min | TSK-007 | P1 |
| 9 | TSK-009 | テスト作成・実行 | 45min | TSK-005,006,007 | P0 |
| 10 | TSK-010 | package.json更新・ビルド確認 | 20min | TSK-009 | P0 |
| 11 | TSK-011 | ドキュメント更新 | 20min | TSK-010 | P1 |
| 12 | TSK-012 | バージョン0.3.0リリース | 15min | TSK-011 | P0 |

**合計工数**: 約5.5時間

---

## 📝 タスク詳細

### TSK-001: Neo4jからデータエクスポート

**対応設計**: DES-003
**工数**: 30分
**依存**: なし

#### 作業内容

1. Neo4jに接続してCypherクエリで理論データをエクスポート
2. 関係データ（RELATED_TO等）をエクスポート
3. JSON形式で保存

#### 実行コマンド

```bash
# Neo4jコンテナで実行
docker exec -it tenjin-neo4j cypher-shell -u neo4j -p password \
  "MATCH (t:Theory) RETURN t" --format plain > theories.json

docker exec -it tenjin-neo4j cypher-shell -u neo4j -p password \
  "MATCH (t1:Theory)-[r]->(t2:Theory) RETURN t1.id, type(r), t2.id" \
  --format plain > relations.json
```

#### 完了条件

- [ ] theories.json に175+件の理論データ
- [ ] relations.json に関係データ

---

### TSK-002: SQLiteスキーマ作成・データ投入

**対応設計**: DES-003
**工数**: 45分
**依存**: TSK-001

#### 作業内容

1. SQLiteデータベースファイル作成
2. スキーマ作成（theories, theory_relations, theories_fts）
3. エクスポートしたJSONからデータ投入
4. FTS5インデックス構築

#### 成果物

- `shiden/src/data/theories.db`

#### スクリプト

```typescript
// scripts/build-database.ts
import Database from 'better-sqlite3';
import theoriesData from './theories.json';
import relationsData from './relations.json';

const db = new Database('theories.db');

// スキーマ作成
db.exec(`
  CREATE TABLE theories (...);
  CREATE TABLE theory_relations (...);
  CREATE VIRTUAL TABLE theories_fts USING fts5(..., tokenize='trigram');
`);

// データ投入
const insertTheory = db.prepare(`INSERT INTO theories VALUES (...)`);
for (const theory of theoriesData) {
  insertTheory.run(...);
}
```

#### 完了条件

- [ ] theories.db が生成される
- [ ] `SELECT COUNT(*) FROM theories` が175+を返す
- [ ] FTS5検索が動作する

---

### TSK-003: 型定義（types.ts）

**対応設計**: DES-004
**工数**: 15分
**依存**: なし

#### 作業内容

1. `src/theories/types.ts` 作成
2. Theory, RelatedTheory, Category, SearchOptions, ListOptions 型定義

#### 成果物

- `shiden/src/theories/types.ts`

#### 完了条件

- [ ] 型定義ファイルが作成される
- [ ] TypeScriptコンパイルエラーなし

---

### TSK-004: データベース接続（database.ts）

**対応設計**: DES-003
**工数**: 20分
**依存**: TSK-002

#### 作業内容

1. `src/theories/database.ts` 作成
2. better-sqlite3でのシングルトン接続
3. getDatabase(), closeDatabase() 実装

#### 成果物

- `shiden/src/theories/database.ts`

#### 完了条件

- [ ] データベース接続が動作する
- [ ] 複数回呼び出しでも同一インスタンス

---

### TSK-005: TheoryRepository実装

**対応設計**: DES-002
**工数**: 45分
**依存**: TSK-003, TSK-004

#### 作業内容

1. `src/theories/TheoryRepository.ts` 作成
2. searchFTS() - FTS5 trigram検索
3. findById() - ID検索
4. findAll() - 全件取得（ページネーション）
5. countByCategory() - カテゴリ集計
6. traverseRelated() - WITH RECURSIVE CTE

#### 成果物

- `shiden/src/theories/TheoryRepository.ts`

#### 完了条件

- [ ] 全メソッドが実装される
- [ ] 日本語検索が動作する
- [ ] グラフ走査が深さ3まで動作する

---

### TSK-006: TheoryService実装

**対応設計**: DES-001
**工数**: 30分
**依存**: TSK-005

#### 作業内容

1. `src/theories/TheoryService.ts` 作成
2. search(), get(), list(), categories(), related() 実装
3. `src/theories/index.ts` で公開API作成

#### 成果物

- `shiden/src/theories/TheoryService.ts`
- `shiden/src/theories/index.ts`

#### 完了条件

- [ ] 全メソッドが実装される
- [ ] index.tsからエクスポートされる

---

### TSK-007: CLIコマンド実装（theories.ts）

**対応設計**: DES-005
**工数**: 45分
**依存**: TSK-006

#### 作業内容

1. `src/cli/commands/theories.ts` 作成
2. `theories list` コマンド
3. `theories search <query>` コマンド
4. `theories get <id>` コマンド
5. `theories categories` コマンド
6. `theories related <id>` コマンド
7. `src/cli/index.ts` にコマンド追加

#### 成果物

- `shiden/src/cli/commands/theories.ts`
- `shiden/src/cli/index.ts` 更新

#### 完了条件

- [ ] 5つのサブコマンドが動作する
- [ ] `npx shiden theories --help` でヘルプ表示

---

### TSK-008: theory-lookup.md更新

**対応設計**: DES-006
**工数**: 15分
**依存**: TSK-007

#### 作業内容

1. `templates/.github/skills/theory-lookup.md` 更新
2. SQLiteベースの使用方法に変更
3. CLIコマンド例を追加

#### 成果物

- `shiden/templates/.github/skills/theory-lookup.md` 更新

#### 完了条件

- [ ] スキルファイルが更新される
- [ ] TENJIN依存の記述を削除

---

### TSK-009: テスト作成・実行

**対応設計**: UT-001, UT-002, IT-001
**工数**: 45分
**依存**: TSK-005, TSK-006, TSK-007

#### 作業内容

1. `src/theories/__tests__/TheoryRepository.test.ts` 作成
2. `src/theories/__tests__/TheoryService.test.ts` 作成
3. CLI統合テスト
4. 全テスト実行・合格確認

#### テストケース

| ファイル | テストケース |
|----------|-------------|
| TheoryRepository.test.ts | searchFTS_japanese, searchFTS_english, findById, traverseRelated |
| TheoryService.test.ts | search_withCategory, list_pagination, categories_count |

#### 完了条件

- [ ] 全テストが合格
- [ ] カバレッジ80%以上

---

### TSK-010: package.json更新・ビルド確認

**対応設計**: NFR-002
**工数**: 20分
**依存**: TSK-009

#### 作業内容

1. `better-sqlite3` 依存追加
2. `data/theories.db` をパッケージに含める設定
3. ビルド実行・動作確認

#### 変更内容

```json
{
  "dependencies": {
    "better-sqlite3": "^11.0.0"
  },
  "files": [
    "dist",
    "templates",
    "data"
  ]
}
```

#### 完了条件

- [ ] `npm run build` 成功
- [ ] `npm pack` でパッケージサイズ < 10MB

---

### TSK-011: ドキュメント更新

**工数**: 20分
**依存**: TSK-010

#### 作業内容

1. README.md 更新（theories コマンド追加）
2. CHANGELOG.md 更新（v0.3.0）
3. docs/INSTALL-GUIDE.md 更新（TENJIN不要を明記）

#### 完了条件

- [ ] README.mdにtheoriesコマンド記載
- [ ] CHANGELOG.mdにv0.3.0追加

---

### TSK-012: バージョン0.3.0リリース

**工数**: 15分
**依存**: TSK-011

#### 作業内容

1. package.json version を 0.3.0 に更新
2. Git コミット・タグ作成
3. npm publish

#### コマンド

```bash
npm version 0.3.0
git push origin main --tags
npm publish
```

#### 完了条件

- [ ] npm に v0.3.0 が公開される
- [ ] `npx shiden@0.3.0 theories list` が動作する

---

## 📈 依存関係図

```
TSK-001 (Neo4jエクスポート)
    │
    ▼
TSK-002 (SQLite作成) ──────────┐
    │                          │
    ▼                          │
TSK-004 (database.ts)          │
    │                          │
    │    TSK-003 (types.ts) ◄──┘
    │         │
    ▼         ▼
TSK-005 (Repository)
    │
    ▼
TSK-006 (Service)
    │
    ▼
TSK-007 (CLI)
    │
    ▼
TSK-008 (Skill更新)
    │
    ▼
TSK-009 (テスト)
    │
    ▼
TSK-010 (ビルド)
    │
    ▼
TSK-011 (ドキュメント)
    │
    ▼
TSK-012 (リリース)
```

---

## 📋 レビュー結果

| 観点 | 状態 | 詳細 |
|------|------|------|
| タスク粒度 | ✅ OK | 各タスク15-45分で適切 |
| 依存関係 | ✅ OK | 明確な順序・並列可能箇所あり |
| トレーサビリティ | ✅ OK | 設計ID・要件IDとの対応明確 |
| 完了条件 | ✅ OK | 各タスクにチェックリストあり |
| 工数見積 | ✅ OK | 合計5.5時間で現実的 |

---

👉 **次のアクションを選択してください:**
- 「修正」/ 具体的な修正指示 → 修正して再提示
- 「承認」/「OK」/「進める」 → **実装フェーズへ**
