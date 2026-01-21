/**
 * 教育理論データアクセス層
 * TSK-005: TheoryRepository実装
 * @module theories/TheoryRepository
 */

import type {
  Theory,
  RelatedTheory,
  Category,
  TheoryRow,
  RelatedRow,
  RelationType,
} from './types.js';
import { getDatabase } from './database.js';

/**
 * データベース行をTheoryに変換
 */
function rowToTheory(row: TheoryRow): Theory {
  return {
    id: row.id,
    name: row.name,
    name_ja: row.name_ja,
    category: row.category,
    description: row.description,
    description_ja: row.description_ja,
    theorists: JSON.parse(row.theorists || '[]'),
    priority: row.priority,
    key_principles: JSON.parse(row.key_principles || '[]'),
    applications: JSON.parse(row.applications || '[]'),
    strengths: JSON.parse(row.strengths || '[]'),
    limitations: JSON.parse(row.limitations || '[]'),
  };
}

/**
 * 関連理論行をRelatedTheoryに変換
 */
function rowToRelatedTheory(row: RelatedRow): RelatedTheory {
  return {
    ...rowToTheory(row),
    depth: row.depth,
    relation_type: row.relation_type as RelationType,
  };
}

/**
 * FTS5 trigram検索
 * @param query 検索クエリ（3文字以上推奨）
 * @param limit 取得件数上限
 * @returns マッチした理論リスト
 */
export function searchFTS(query: string, limit = 20): Theory[] {
  const db = getDatabase();
  
  // 検索クエリが短い場合はLIKE検索にフォールバック
  if (query.length < 3) {
    const stmt = db.prepare(`
      SELECT * FROM theories 
      WHERE name LIKE ? OR name_ja LIKE ? OR description LIKE ? OR description_ja LIKE ?
      LIMIT ?
    `);
    const pattern = `%${query}%`;
    const rows = stmt.all(pattern, pattern, pattern, pattern, limit) as TheoryRow[];
    return rows.map(rowToTheory);
  }
  
  // FTS5 trigram検索
  const stmt = db.prepare(`
    SELECT t.*, bm25(theories_fts) as score
    FROM theories_fts
    JOIN theories t ON theories_fts.rowid = t.rowid
    WHERE theories_fts MATCH ?
    ORDER BY score
    LIMIT ?
  `);
  
  const rows = stmt.all(query, limit) as TheoryRow[];
  return rows.map(rowToTheory);
}

/**
 * IDで理論を取得
 * @param id 理論ID (e.g., "theory-001")
 * @returns 理論またはnull
 */
export function findById(id: string): Theory | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM theories WHERE id = ?');
  const row = stmt.get(id) as TheoryRow | undefined;
  return row ? rowToTheory(row) : null;
}

/**
 * 全理論を取得
 * @param options フィルタオプション
 * @returns 理論リスト
 */
export function findAll(options?: {
  category?: string;
  limit?: number;
  offset?: number;
}): Theory[] {
  const db = getDatabase();
  const { category, limit = 100, offset = 0 } = options || {};
  
  let sql = 'SELECT * FROM theories';
  const params: (string | number)[] = [];
  
  if (category) {
    sql += ' WHERE category = ?';
    params.push(category);
  }
  
  sql += ' ORDER BY priority DESC, name ASC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  
  const stmt = db.prepare(sql);
  const rows = stmt.all(...params) as TheoryRow[];
  return rows.map(rowToTheory);
}

/**
 * カテゴリ別件数を取得
 * @returns カテゴリと件数のリスト
 */
export function countByCategory(): Category[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT category as name, COUNT(*) as count 
    FROM theories 
    GROUP BY category 
    ORDER BY count DESC
  `);
  return stmt.all() as Category[];
}

/**
 * 総件数を取得
 */
export function count(): number {
  const db = getDatabase();
  const stmt = db.prepare('SELECT COUNT(*) as count FROM theories');
  const result = stmt.get() as { count: number };
  return result.count;
}

/**
 * WITH RECURSIVE CTEによるグラフ走査
 * @param id 起点となる理論ID
 * @param maxDepth 走査深さ（最大3）
 * @returns 関連理論リスト
 */
export function traverseRelated(id: string, maxDepth = 2): RelatedTheory[] {
  const db = getDatabase();
  const depth = Math.min(Math.max(maxDepth, 1), 3); // 1-3の範囲に制限
  
  const stmt = db.prepare(`
    WITH RECURSIVE related_graph AS (
      -- 起点
      SELECT target_id, relation_type, 1 as depth
      FROM theory_relations
      WHERE source_id = ?
      
      UNION ALL
      
      -- 再帰
      SELECT r.target_id, r.relation_type, rg.depth + 1
      FROM theory_relations r
      INNER JOIN related_graph rg ON r.source_id = rg.target_id
      WHERE rg.depth < ?
    )
    SELECT DISTINCT t.*, rg.depth, rg.relation_type
    FROM related_graph rg
    JOIN theories t ON t.id = rg.target_id
    ORDER BY rg.depth, t.name
  `);
  
  const rows = stmt.all(id, depth) as RelatedRow[];
  return rows.map(rowToRelatedTheory);
}

/**
 * 特定の関係タイプで関連する理論を取得
 * @param id 理論ID
 * @param relationType 関係タイプ
 */
export function findRelatedByType(
  id: string,
  relationType: RelationType
): Theory[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT t.* FROM theories t
    JOIN theory_relations r ON t.id = r.target_id
    WHERE r.source_id = ? AND r.relation_type = ?
    ORDER BY t.name
  `);
  const rows = stmt.all(id, relationType) as TheoryRow[];
  return rows.map(rowToTheory);
}
