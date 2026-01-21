import { getCurriculumDb } from './database.js';
import type {
  CurriculumSection,
  SectionRelation,
  CurriculumSearchResult,
  CurriculumStats,
} from './types.js';

/**
 * カリキュラムデータへのアクセスを提供するリポジトリ
 */
export class CurriculumRepository {
  /**
   * 全文検索でセクションを検索
   * @param query - 検索クエリ
   * @param limit - 最大結果数
   */
  search(query: string, limit: number = 10): CurriculumSearchResult[] {
    const db = getCurriculumDb();

    // まずFTS5検索を試行（trigram対応）
    try {
      const ftsStmt = db.prepare(`
        SELECT 
          cs.*,
          bm25(curriculum_fts) as score,
          snippet(curriculum_fts, 2, '【', '】', '...', 30) as highlight
        FROM curriculum_fts
        JOIN curriculum_sections cs ON curriculum_fts.id = cs.id
        WHERE curriculum_fts MATCH ?
        ORDER BY bm25(curriculum_fts)
        LIMIT ?
      `);

      const ftsResults = ftsStmt.all(query, limit) as Array<
        CurriculumSection & { score: number; highlight: string }
      >;

      if (ftsResults.length > 0) {
        return ftsResults.map((row) => ({
          section: {
            id: row.id,
            document_type: row.document_type,
            chapter: row.chapter,
            section: row.section,
            title: row.title,
            content: row.content,
            level: row.level,
            order_index: row.order_index,
            source_file: row.source_file,
            created_at: row.created_at,
          },
          score: row.score,
          highlight: row.highlight,
        }));
      }
    } catch {
      // FTS検索が失敗した場合はLIKE検索にフォールバック
    }

    // LIKE検索（フォールバック）
    const likeStmt = db.prepare(`
      SELECT 
        cs.*,
        0 as score
      FROM curriculum_sections cs
      WHERE cs.title LIKE ? OR cs.content LIKE ? OR cs.chapter LIKE ?
      ORDER BY cs.order_index
      LIMIT ?
    `);

    const pattern = `%${query}%`;
    const likeResults = likeStmt.all(pattern, pattern, pattern, limit) as Array<
      CurriculumSection & { score: number }
    >;

    return likeResults.map((row) => {
      // ハイライトを生成
      const idx = row.content.indexOf(query);
      let highlight = '';
      if (idx !== -1) {
        const start = Math.max(0, idx - 20);
        const end = Math.min(row.content.length, idx + query.length + 50);
        highlight = '...' + row.content.slice(start, end).replace(query, `【${query}】`) + '...';
      }

      return {
        section: {
          id: row.id,
          document_type: row.document_type,
          chapter: row.chapter,
          section: row.section,
          title: row.title,
          content: row.content,
          level: row.level,
          order_index: row.order_index,
          source_file: row.source_file,
          created_at: row.created_at,
        },
        score: row.score,
        highlight,
      };
    });
  }

  /**
   * IDでセクションを取得
   * @param id - セクションID
   */
  getById(id: string): CurriculumSection | null {
    const db = getCurriculumDb();
    const stmt = db.prepare('SELECT * FROM curriculum_sections WHERE id = ?');
    return (stmt.get(id) as CurriculumSection) || null;
  }

  /**
   * 章でセクションをフィルタ
   * @param chapter - 章名（部分一致）
   */
  getByChapter(chapter: string): CurriculumSection[] {
    const db = getCurriculumDb();
    const stmt = db.prepare(
      'SELECT * FROM curriculum_sections WHERE chapter LIKE ? ORDER BY order_index'
    );
    return stmt.all(`%${chapter}%`) as CurriculumSection[];
  }

  /**
   * ドキュメント種別でセクションをフィルタ
   * @param documentType - ドキュメント種別
   */
  getByDocumentType(documentType: string): CurriculumSection[] {
    const db = getCurriculumDb();
    const stmt = db.prepare(
      'SELECT * FROM curriculum_sections WHERE document_type = ? ORDER BY order_index'
    );
    return stmt.all(documentType) as CurriculumSection[];
  }

  /**
   * 関連セクションを取得（GraphRAG）
   * @param sectionId - 基点セクションID
   * @param relationType - リレーション種別（省略時は全種別）
   * @param limit - 最大結果数
   */
  getRelatedSections(
    sectionId: string,
    relationType?: string,
    limit: number = 10
  ): Array<{ relation: SectionRelation; section: CurriculumSection }> {
    const db = getCurriculumDb();

    let sql = `
      SELECT 
        sr.source_id, sr.target_id, sr.relation_type, sr.weight,
        cs.*
      FROM section_relations sr
      JOIN curriculum_sections cs ON sr.target_id = cs.id
      WHERE sr.source_id = ?
    `;

    const params: (string | number)[] = [sectionId];

    if (relationType) {
      sql += ' AND sr.relation_type = ?';
      params.push(relationType);
    }

    sql += ' ORDER BY sr.weight DESC LIMIT ?';
    params.push(limit);

    const stmt = db.prepare(sql);
    const results = stmt.all(...params) as Array<
      SectionRelation & CurriculumSection
    >;

    return results.map((row) => ({
      relation: {
        source_id: row.source_id,
        target_id: row.target_id,
        relation_type: row.relation_type,
        weight: row.weight,
      },
      section: {
        id: row.id,
        document_type: row.document_type,
        chapter: row.chapter,
        section: row.section,
        title: row.title,
        content: row.content,
        level: row.level,
        order_index: row.order_index,
        source_file: row.source_file,
        created_at: row.created_at,
      },
    }));
  }

  /**
   * 統計情報を取得
   */
  getStats(): CurriculumStats {
    const db = getCurriculumDb();

    const totalSections = (
      db
        .prepare('SELECT COUNT(*) as count FROM curriculum_sections')
        .get() as { count: number }
    ).count;

    const totalRelations = (
      db.prepare('SELECT COUNT(*) as count FROM section_relations').get() as {
        count: number;
      }
    ).count;

    const byDocType = db
      .prepare(
        `
      SELECT document_type, COUNT(*) as count 
      FROM curriculum_sections 
      GROUP BY document_type
    `
      )
      .all() as Array<{ document_type: string; count: number }>;

    const byRelType = db
      .prepare(
        `
      SELECT relation_type, COUNT(*) as count 
      FROM section_relations 
      GROUP BY relation_type
    `
      )
      .all() as Array<{ relation_type: string; count: number }>;

    return {
      totalSections,
      totalRelations,
      byDocumentType: Object.fromEntries(
        byDocType.map((r) => [r.document_type, r.count])
      ),
      byRelationType: Object.fromEntries(
        byRelType.map((r) => [r.relation_type, r.count])
      ),
    };
  }

  /**
   * すべてのセクションを取得（ページネーション付き）
   * @param offset - オフセット
   * @param limit - 最大結果数
   */
  getAll(offset: number = 0, limit: number = 100): CurriculumSection[] {
    const db = getCurriculumDb();
    const stmt = db.prepare(
      'SELECT * FROM curriculum_sections ORDER BY order_index LIMIT ? OFFSET ?'
    );
    return stmt.all(limit, offset) as CurriculumSection[];
  }
}
