export { CurriculumRepository } from './CurriculumRepository.js';
export { CurriculumService } from './CurriculumService.js';
export {
  getCurriculumDb,
  closeCurriculumDb,
  isCurriculumDbAvailable,
} from './database.js';
export type {
  CurriculumSection,
  SectionRelation,
  CurriculumSearchResult,
  CurriculumStats,
} from './types.js';
