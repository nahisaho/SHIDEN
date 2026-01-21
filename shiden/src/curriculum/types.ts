/**
 * カリキュラムセクションの型定義
 */
export interface CurriculumSection {
  id: string;
  document_type: string;
  chapter: string;
  section: string;
  title: string;
  content: string;
  level: number;
  order_index: number;
  source_file: string;
  created_at?: string;
}

/**
 * セクション間リレーションの型定義
 */
export interface SectionRelation {
  source_id: string;
  target_id: string;
  relation_type: string;
  weight: number;
}

/**
 * 検索結果の型定義
 */
export interface CurriculumSearchResult {
  section: CurriculumSection;
  score: number;
  highlight?: string;
}

/**
 * カリキュラム統計の型定義
 */
export interface CurriculumStats {
  totalSections: number;
  totalRelations: number;
  byDocumentType: Record<string, number>;
  byRelationType: Record<string, number>;
}
