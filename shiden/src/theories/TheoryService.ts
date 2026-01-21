/**
 * 教育理論サービス層
 * TSK-006: TheoryService実装
 * @module theories/TheoryService
 */

import type {
  Theory,
  RelatedTheory,
  Category,
  SearchOptions,
  ListOptions,
  RelatedOptions,
  SearchResult,
} from './types.js';
import * as repo from './TheoryRepository.js';

/**
 * 理論を検索（FTS5 trigram）
 * @param query 検索クエリ
 * @param options 検索オプション
 * @returns 検索結果
 */
export function search(query: string, options?: SearchOptions): SearchResult {
  const start = performance.now();
  const { category, limit = 20 } = options || {};
  
  let theories = repo.searchFTS(query, limit * 2); // カテゴリフィルタ用に多めに取得
  
  if (category) {
    theories = theories.filter((t) => t.category === category);
  }
  
  theories = theories.slice(0, limit);
  
  const durationMs = performance.now() - start;
  
  return {
    theories,
    total: theories.length,
    query,
    durationMs: Math.round(durationMs * 100) / 100,
  };
}

/**
 * IDで理論を取得
 * @param id 理論ID
 * @returns 理論またはnull
 */
export function get(id: string): Theory | null {
  return repo.findById(id);
}

/**
 * 全理論を取得（ページネーション対応）
 * @param options 取得オプション
 * @returns 理論リスト
 */
export function list(options?: ListOptions): Theory[] {
  return repo.findAll(options);
}

/**
 * カテゴリ一覧を取得
 * @returns カテゴリと件数のリスト
 */
export function categories(): Category[] {
  return repo.countByCategory();
}

/**
 * 関連理論を取得（グラフ走査）
 * @param id 起点となる理論ID
 * @param options 走査オプション
 * @returns 関連理論リスト
 */
export function related(id: string, options?: RelatedOptions): RelatedTheory[] {
  const { depth = 2, relationTypes } = options || {};
  
  let results = repo.traverseRelated(id, depth);
  
  if (relationTypes && relationTypes.length > 0) {
    results = results.filter((r) => relationTypes.includes(r.relation_type));
  }
  
  return results;
}

/**
 * 総件数を取得
 */
export function count(): number {
  return repo.count();
}

/**
 * 複数クエリで検索（OR検索）
 * @param queries 検索クエリ配列
 * @param options 検索オプション
 */
export function searchMultiple(
  queries: string[],
  options?: SearchOptions
): SearchResult {
  const start = performance.now();
  const { category, limit = 20 } = options || {};
  
  const theoriesMap = new Map<string, Theory>();
  
  for (const query of queries) {
    const results = repo.searchFTS(query, limit);
    for (const theory of results) {
      if (!theoriesMap.has(theory.id)) {
        theoriesMap.set(theory.id, theory);
      }
    }
  }
  
  let theories = Array.from(theoriesMap.values());
  
  if (category) {
    theories = theories.filter((t) => t.category === category);
  }
  
  theories = theories.slice(0, limit);
  
  const durationMs = performance.now() - start;
  
  return {
    theories,
    total: theories.length,
    query: queries.join(' OR '),
    durationMs: Math.round(durationMs * 100) / 100,
  };
}
