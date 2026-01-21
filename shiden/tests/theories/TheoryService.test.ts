/**
 * TheoryService テスト
 * TSK-009: テスト作成
 */

import { describe, it, expect, afterAll } from 'vitest';
import {
  search,
  get,
  list,
  categories,
  related,
  count,
  searchMultiple,
  closeDatabase,
} from '../../src/theories/index.js';

describe('TheoryService', () => {
  afterAll(() => {
    closeDatabase();
  });

  describe('search', () => {
    it('should return SearchResult with timing info', () => {
      const result = search('constructivism');
      
      expect(result).toHaveProperty('theories');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('durationMs');
      expect(Array.isArray(result.theories)).toBe(true);
      expect(typeof result.durationMs).toBe('number');
    });

    it('should filter by category', () => {
      const result = search('learning', { category: 'social_learning' });
      
      result.theories.forEach(t => {
        expect(t.category).toBe('social_learning');
      });
    });

    it('should respect limit option', () => {
      const result = search('theory', { limit: 3 });
      expect(result.theories.length).toBeLessThanOrEqual(3);
    });
  });

  describe('get', () => {
    it('should return theory by id', () => {
      const theory = get('theory-001');
      expect(theory).not.toBeNull();
      expect(theory?.id).toBe('theory-001');
    });

    it('should return null for non-existent id', () => {
      const theory = get('non-existent-id');
      expect(theory).toBeNull();
    });
  });

  describe('list', () => {
    it('should return theories with default options', () => {
      const theories = list({});
      expect(theories.length).toBeGreaterThan(0);
    });

    it('should filter by category', () => {
      const theories = list({ category: 'motivation' });
      theories.forEach(t => {
        expect(t.category).toBe('motivation');
      });
    });

    it('should paginate correctly', () => {
      const page1 = list({ limit: 5, offset: 0 });
      const page2 = list({ limit: 5, offset: 5 });
      
      expect(page1.length).toBe(5);
      expect(page2.length).toBe(5);
      expect(page1[0].id).not.toBe(page2[0].id);
    });
  });

  describe('categories', () => {
    it('should return category list', () => {
      const cats = categories();
      expect(cats.length).toBeGreaterThan(0);
    });

    it('should include count for each category', () => {
      const cats = categories();
      cats.forEach(c => {
        expect(c).toHaveProperty('name');
        expect(c).toHaveProperty('count');
        expect(typeof c.count).toBe('number');
        expect(c.count).toBeGreaterThan(0);
      });
    });

    it('should sum to 175 total theories', () => {
      const cats = categories();
      const total = cats.reduce((sum, c) => sum + c.count, 0);
      expect(total).toBe(175);
    });
  });

  describe('related', () => {
    it('should return related theories', () => {
      const rel = related('theory-003');
      expect(Array.isArray(rel)).toBe(true);
    });

    it('should include depth and relation type', () => {
      const rel = related('theory-003', { depth: 2 });
      if (rel.length > 0) {
        expect(rel[0]).toHaveProperty('depth');
        expect(rel[0]).toHaveProperty('relation_type');
      }
    });

    it('should respect depth option', () => {
      const depth1 = related('theory-001', { depth: 1 });
      const depth3 = related('theory-001', { depth: 3 });
      
      // 深い探索ほど多くの結果を返す可能性がある
      depth1.forEach(r => expect(r.depth).toBe(1));
      depth3.forEach(r => expect(r.depth).toBeLessThanOrEqual(3));
    });
  });

  describe('count', () => {
    it('should return total theory count', () => {
      const total = count();
      expect(total).toBe(175);
    });
  });

  describe('searchMultiple', () => {
    it('should search for multiple queries (OR)', () => {
      const result = searchMultiple(['constructivism', 'behaviorism'], { limit: 10 });
      
      expect(result.theories.length).toBeGreaterThan(0);
      // 少なくとも1つはどちらかに関連するはず
    });

    it('should respect limit for combined results', () => {
      const result = searchMultiple(['learning', 'theory'], { limit: 5 });
      expect(result.theories.length).toBeLessThanOrEqual(5);
    });

    it('should remove duplicates', () => {
      const result = searchMultiple(['social learning', 'social'], { limit: 20 });
      const ids = result.theories.map(t => t.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });
  });
});
