import { describe, it, expect, beforeAll } from 'vitest';
import { CurriculumRepository } from '../../src/curriculum/CurriculumRepository.js';
import { CurriculumService } from '../../src/curriculum/CurriculumService.js';
import { isCurriculumDbAvailable } from '../../src/curriculum/database.js';

// カリキュラムDBが存在する場合のみテストを実行
const runCurriculumTests = isCurriculumDbAvailable();

describe.skipIf(!runCurriculumTests)('CurriculumRepository', () => {
  let repository: CurriculumRepository;

  beforeAll(() => {
    repository = new CurriculumRepository();
  });

  describe('search', () => {
    it('should search for curriculum sections by keyword', () => {
      const results = repository.search('算数', 5);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].section).toHaveProperty('id');
      expect(results[0].section).toHaveProperty('title');
      expect(results[0].section).toHaveProperty('content');
    });

    it('should return empty array for non-matching query', () => {
      const results = repository.search('存在しないキーワード12345xyz', 5);
      expect(results.length).toBe(0);
    });
  });

  describe('getStats', () => {
    it('should return curriculum statistics', () => {
      const stats = repository.getStats();
      expect(stats.totalSections).toBeGreaterThan(0);
      expect(stats.totalRelations).toBeGreaterThan(0);
      expect(stats.byDocumentType).toBeDefined();
    });
  });

  describe('getAll', () => {
    it('should return paginated sections', () => {
      const sections = repository.getAll(0, 10);
      expect(sections.length).toBeLessThanOrEqual(10);
      expect(sections.length).toBeGreaterThan(0);
    });
  });
});

describe.skipIf(!runCurriculumTests)('CurriculumService', () => {
  let service: CurriculumService;

  beforeAll(() => {
    service = new CurriculumService();
  });

  describe('search', () => {
    it('should search for curriculum sections', () => {
      const results = service.search('国語');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('searchBySubject', () => {
    it('should search by subject name', () => {
      const results = service.searchBySubject('算数');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('formatResults', () => {
    it('should format search results for CLI', () => {
      const results = service.search('理科', 3);
      const formatted = service.formatResults(results);
      expect(formatted).toContain('検索結果');
    });

    it('should return message for empty results', () => {
      const formatted = service.formatResults([]);
      expect(formatted).toContain('見つかりませんでした');
    });
  });

  describe('formatStats', () => {
    it('should format statistics for CLI', () => {
      const stats = service.getStats();
      const formatted = service.formatStats(stats);
      expect(formatted).toContain('統計');
      expect(formatted).toContain('セクション');
    });
  });
});
