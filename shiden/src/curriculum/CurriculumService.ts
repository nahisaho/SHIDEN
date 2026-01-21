import { CurriculumRepository } from './CurriculumRepository.js';
import type { CurriculumSearchResult, CurriculumStats } from './types.js';

/**
 * カリキュラム検索のビジネスロジックを提供するサービス
 */
export class CurriculumService {
  private repository: CurriculumRepository;

  constructor(repository?: CurriculumRepository) {
    this.repository = repository || new CurriculumRepository();
  }

  /**
   * キーワードで学習指導要領を検索
   * @param query - 検索キーワード
   * @param options - 検索オプション
   */
  search(
    query: string,
    options: {
      limit?: number;
      includeRelated?: boolean;
    } = {}
  ): CurriculumSearchResult[] {
    const { limit = 10, includeRelated = false } = options;

    const results = this.repository.search(query, limit);

    if (includeRelated && results.length > 0) {
      // 最初の結果に関連セクションを追加
      const relatedSections = this.repository.getRelatedSections(
        results[0].section.id,
        'RELATED_SUBJECT',
        5
      );

      // 重複を除いて追加
      const existingIds = new Set(results.map((r) => r.section.id));
      for (const related of relatedSections) {
        if (!existingIds.has(related.section.id)) {
          results.push({
            section: related.section,
            score: -related.relation.weight, // 負のスコアで関連セクションであることを示す
            highlight: `[関連: ${related.relation.relation_type}]`,
          });
          existingIds.add(related.section.id);
        }
      }
    }

    return results;
  }

  /**
   * 教科別に学習指導要領を検索
   * @param subject - 教科名
   */
  searchBySubject(subject: string): CurriculumSearchResult[] {
    // 教科名でフィルタリングしながら検索
    // 単一キーワードで検索
    return this.search(subject, { limit: 20 });
  }

  /**
   * 学年別に学習指導要領を検索
   * @param grade - 学年（例: "1年", "2年", "小学校1年"）
   */
  searchByGrade(grade: string): CurriculumSearchResult[] {
    // 学年に関連するキーワードで検索
    return this.search(grade, { limit: 20 });
  }

  /**
   * 統計情報を取得
   */
  getStats(): CurriculumStats {
    return this.repository.getStats();
  }

  /**
   * 検索結果をフォーマット（CLI表示用）
   * @param results - 検索結果
   */
  formatResults(results: CurriculumSearchResult[]): string {
    if (results.length === 0) {
      return '検索結果が見つかりませんでした。';
    }

    const lines: string[] = [];
    lines.push(`\n📚 検索結果: ${results.length}件\n`);
    lines.push('─'.repeat(60));

    for (const result of results) {
      const { section, highlight } = result;

      lines.push(`\n📖 ${section.title}`);
      lines.push(`   ID: ${section.id}`);
      lines.push(`   章: ${section.chapter || '(なし)'}`);
      lines.push(`   節: ${section.section || '(なし)'}`);

      if (highlight) {
        lines.push(`   📝 ${highlight}`);
      }

      // コンテンツのプレビュー（最初の150文字）
      const preview = section.content.slice(0, 150).replace(/\n/g, ' ');
      lines.push(`   ${preview}...`);

      lines.push('─'.repeat(60));
    }

    return lines.join('\n');
  }

  /**
   * 統計情報をフォーマット（CLI表示用）
   */
  formatStats(stats: CurriculumStats): string {
    const lines: string[] = [];

    lines.push('\n📊 学習指導要領データベース統計\n');
    lines.push('─'.repeat(40));
    lines.push(`総セクション数: ${stats.totalSections.toLocaleString()}`);
    lines.push(`総リレーション数: ${stats.totalRelations.toLocaleString()}`);

    lines.push('\n📑 ドキュメント種別:');
    const docTypeNames: Record<string, string> = {
      elementary_school: '小学校',
      middle_school: '中学校',
      high_school: '高等学校',
      unknown: 'その他',
    };
    for (const [type, count] of Object.entries(stats.byDocumentType)) {
      const name = docTypeNames[type] || type;
      lines.push(`   ${name}: ${count.toLocaleString()}件`);
    }

    lines.push('\n🔗 リレーション種別:');
    for (const [type, count] of Object.entries(stats.byRelationType)) {
      lines.push(`   ${type}: ${count.toLocaleString()}件`);
    }

    return lines.join('\n');
  }
}
