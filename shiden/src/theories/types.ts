/**
 * 教育理論データの型定義
 * TSK-003: 型定義
 * @module theories/types
 */

/**
 * 教育理論
 */
export interface Theory {
  /** 理論ID (e.g., "theory-001") */
  id: string;
  /** 理論名（英語） */
  name: string;
  /** 理論名（日本語） */
  name_ja: string | null;
  /** カテゴリ (e.g., "learning_theory", "motivation") */
  category: string;
  /** 説明（英語） */
  description: string | null;
  /** 説明（日本語） */
  description_ja: string | null;
  /** 理論家・提唱者 */
  theorists: string[];
  /** 優先度 (1-10) */
  priority: number;
  /** 主要原則 */
  key_principles: string[];
  /** 応用分野 */
  applications: string[];
  /** 強み */
  strengths: string[];
  /** 限界・制約 */
  limitations: string[];
}

/**
 * 関連理論（グラフ走査結果）
 */
export interface RelatedTheory extends Theory {
  /** 走査深さ (1-3) */
  depth: number;
  /** 関係タイプ */
  relation_type: RelationType;
}

/**
 * 関係タイプ
 */
export type RelationType =
  | 'related_to'
  | 'influenced_by'
  | 'influences'
  | 'builds_upon'
  | 'derived_from'
  | 'complements'
  | 'similar_to'
  | 'contrasts_with';

/**
 * カテゴリ情報
 */
export interface Category {
  /** カテゴリ名 */
  name: string;
  /** 理論数 */
  count: number;
}

/**
 * 検索オプション
 */
export interface SearchOptions {
  /** カテゴリでフィルタ */
  category?: string;
  /** 取得件数上限 */
  limit?: number;
}

/**
 * 一覧取得オプション
 */
export interface ListOptions {
  /** カテゴリでフィルタ */
  category?: string;
  /** 取得件数上限 */
  limit?: number;
  /** オフセット */
  offset?: number;
}

/**
 * 関連理論取得オプション
 */
export interface RelatedOptions {
  /** 走査深さ (デフォルト: 2, 最大: 3) */
  depth?: number;
  /** 関係タイプでフィルタ */
  relationTypes?: RelationType[];
}

/**
 * 検索結果
 */
export interface SearchResult {
  /** マッチした理論 */
  theories: Theory[];
  /** 総件数 */
  total: number;
  /** 検索クエリ */
  query: string;
  /** 検索時間(ms) */
  durationMs: number;
}

/**
 * データベース行（内部用）
 */
export interface TheoryRow {
  id: string;
  name: string;
  name_ja: string | null;
  category: string;
  description: string | null;
  description_ja: string | null;
  theorists: string; // JSON string
  priority: number;
  key_principles: string; // JSON string
  applications: string; // JSON string
  strengths: string; // JSON string
  limitations: string; // JSON string
}

/**
 * 関係データベース行（内部用）
 */
export interface RelationRow {
  source_id: string;
  target_id: string;
  relation_type: string;
  weight: number;
}

/**
 * グラフ走査結果行（内部用）
 */
export interface RelatedRow extends TheoryRow {
  depth: number;
  relation_type: string;
}
