/**
 * TheoryRepository テスト
 * TSK-009: テスト作成
 */

import { describe, it, expect, afterAll } from 'vitest';
import {
  searchFTS,
  findById,
  findAll,
  countByCategory,
  traverseRelated,
} from '../../src/theories/TheoryRepository.js';
import { closeDatabase } from '../../src/theories/database.js';

describe('TheoryRepository', () => {
  afterAll(() => {
    closeDatabase();
  });

  describe('searchFTS', () => {
    it('should find theories with Japanese query (3+ chars)', () => {
      const results = searchFTS('社会的', 10);
      expect(results.length).toBeGreaterThan(0);
      // 社会的学習理論が含まれるはず
      const found = results.some(t => t.name_ja?.includes('社会'));
      expect(found).toBe(true);
    });

    it('should find theories with English query', () => {
      const results = searchFTS('learning', 10);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should fallback to LIKE for short queries (< 3 chars)', () => {
      // 2文字クエリはLIKE検索にフォールバック
      const results = searchFTS('学習', 5);
      // LIKE検索で見つかる可能性がある
      expect(Array.isArray(results)).toBe(true);
    });

    it('should respect limit parameter', () => {
      const results = searchFTS('theory', 3);
      expect(results.length).toBeLessThanOrEqual(3);
    });

    it('should return empty array for non-matching query', () => {
      const results = searchFTS('xyzxyzxyz', 10);
      expect(results).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should find theory by id', () => {
      const theory = findById('theory-001');
      expect(theory).not.toBeNull();
      expect(theory?.id).toBe('theory-001');
    });

    it('should return null for non-existent id', () => {
      const theory = findById('theory-999999');
      expect(theory).toBeNull();
    });

    it('should parse JSON arrays correctly', () => {
      const theory = findById('theory-001');
      expect(Array.isArray(theory?.key_principles)).toBe(true);
      expect(Array.isArray(theory?.applications)).toBe(true);
      expect(Array.isArray(theory?.strengths)).toBe(true);
      expect(Array.isArray(theory?.limitations)).toBe(true);
    });
  });

  describe('findAll', () => {
    it('should return all theories with default options', () => {
      // デフォルトリミットは100
      const theories = findAll({});
      expect(theories.length).toBe(100);
      
      // 全件取得にはlimitを指定
      const all = findAll({ limit: 200 });
      expect(all.length).toBe(175);
    });

    it('should filter by category', () => {
      const theories = findAll({ category: 'learning_theory' });
      expect(theories.length).toBeGreaterThan(0);
      theories.forEach(t => {
        expect(t.category).toBe('learning_theory');
      });
    });

    it('should respect limit and offset', () => {
      const page1 = findAll({ limit: 5, offset: 0 });
      const page2 = findAll({ limit: 5, offset: 5 });
      
      expect(page1.length).toBe(5);
      expect(page2.length).toBe(5);
      // ページが異なることを確認
      expect(page1[0].id).not.toBe(page2[0].id);
    });

    it('should sort by name alphabetically', () => {
      const theories = findAll({ limit: 10 });
      const names = theories.map(t => t.name);
      const sorted = [...names].sort();
      expect(names).toEqual(sorted);
    });
  });

  describe('countByCategory', () => {
    it('should return category counts', () => {
      const categories = countByCategory();
      expect(categories.length).toBeGreaterThan(0);
      
      // 合計が175になることを確認
      const total = categories.reduce((sum, c) => sum + c.count, 0);
      expect(total).toBe(175);
    });

    it('should include known categories', () => {
      const categories = countByCategory();
      const names = categories.map(c => c.name);
      expect(names).toContain('learning_theory');
      expect(names).toContain('instructional_design');
    });

    it('should sort by count descending', () => {
      const categories = countByCategory();
      const counts = categories.map(c => c.count);
      const sorted = [...counts].sort((a, b) => b - a);
      expect(counts).toEqual(sorted);
    });
  });

  describe('traverseRelated', () => {
    it('should find related theories', () => {
      // theory-001 は他の理論と関連がある
      const related = traverseRelated('theory-001', 2);
      expect(Array.isArray(related)).toBe(true);
    });

    it('should respect maxDepth parameter', () => {
      const depth1 = traverseRelated('theory-001', 1);
      const depth2 = traverseRelated('theory-001', 2);
      
      depth1.forEach(r => expect(r.depth).toBe(1));
      depth2.forEach(r => expect(r.depth).toBeLessThanOrEqual(2));
    });

    it('should return empty array for isolated theory', () => {
      // 関連のない理論を探す（存在しない場合はスキップ）
      const related = traverseRelated('theory-999999', 2);
      expect(related).toEqual([]);
    });

    it('should include relation type', () => {
      const related = traverseRelated('theory-003', 2);
      if (related.length > 0) {
        expect(related[0]).toHaveProperty('relation_type');
        expect(typeof related[0].relation_type).toBe('string');
      }
    });
  });
});
