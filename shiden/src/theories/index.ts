/**
 * 教育理論モジュール公開API
 * @module theories
 */

// 型エクスポート
export type {
  Theory,
  RelatedTheory,
  Category,
  SearchOptions,
  ListOptions,
  RelatedOptions,
  SearchResult,
  RelationType,
} from './types.js';

// サービスエクスポート
export {
  search,
  get,
  list,
  categories,
  related,
  count,
  searchMultiple,
} from './TheoryService.js';

// データベース管理エクスポート
export { closeDatabase } from './database.js';

// リポジトリは内部APIのため非公開
