/**
 * SHIDEN - 教育者向けGitHub Copilot Agent Skills
 * 型定義
 */

/**
 * スキルタイプ
 */
export type SkillType =
  | 'lesson-plan'
  | 'materials'
  | 'assessment'
  | 'individual'
  | 'feedback'
  | 'guidance';

/**
 * 教材フォーマット
 */
export type MaterialFormat = 'worksheet' | 'slide' | 'quiz' | 'handout';

/**
 * 評価タイプ
 */
export type AssessmentType = 'rubric' | 'test' | 'formative';

/**
 * 指導タイプ
 */
export type GuidanceType = 'preventive' | 'responsive' | 'crisis';

/**
 * Bloom's Taxonomy 認知レベル
 */
export type BloomLevel =
  | 'remember'
  | 'understand'
  | 'apply'
  | 'analyze'
  | 'evaluate'
  | 'create';

/**
 * メタプロンプトコンテキスト
 */
export interface MetaPromptContext {
  /** 学年（例: "中学2年", "小学4年", "高校1年"） */
  grade?: string;
  /** 教科（例: "数学", "英語", "理科"） */
  subject?: string;
  /** 単元・トピック */
  topic?: string;
  /** 学習目標 */
  learningObjective?: string;
  /** 授業時間（分） */
  duration?: number;
  /** 特別な配慮事項 */
  specialConsiderations?: string[];
  /** 学習者レベル */
  learnerLevel?: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  /** 評価基準 */
  assessmentCriteria?: string;
}

/**
 * 学習者プロファイル
 */
export interface LearnerProfile {
  /** 学習スタイル */
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  /** 現在の習熟度（1-5） */
  proficiencyLevel?: 1 | 2 | 3 | 4 | 5;
  /** 特別な配慮事項 */
  specialNeeds?: string[];
  /** 強み */
  strengths?: string[];
  /** 改善点 */
  areasForImprovement?: string[];
}

/**
 * TENJIN理論参照
 */
export interface TENJINTheory {
  /** 理論ID */
  id: string;
  /** 理論名 */
  name: string;
  /** 理論家名 */
  theorist?: string;
  /** 概要 */
  summary?: string;
  /** カテゴリ */
  category?: string;
  /** 関連理論ID */
  relatedTheories?: string[];
}

/**
 * 初期化オプション
 */
export interface InitOptions {
  /** 上書き確認をスキップ */
  force?: boolean;
  /** プレビューのみ（実際のコピーは行わない） */
  dryRun?: boolean;
  /** 出力先ディレクトリ */
  targetDir?: string;
}

/**
 * 初期化結果
 */
export interface InitResult {
  /** 成功したかどうか */
  success: boolean;
  /** コピーされたファイル */
  copiedFiles: string[];
  /** スキップされたファイル */
  skippedFiles: string[];
  /** エラーメッセージ */
  errors: string[];
}

/**
 * CLIコマンド
 */
export type CLICommand = 'init' | 'help' | 'version';

/**
 * スキルルーティングマップ
 */
export const SKILL_ROUTING: Record<string, SkillType> = {
  '授業計画': 'lesson-plan',
  '指導案': 'lesson-plan',
  'lesson plan': 'lesson-plan',
  '教材': 'materials',
  'ワークシート': 'materials',
  'スライド': 'materials',
  'worksheet': 'materials',
  '評価': 'assessment',
  'ルーブリック': 'assessment',
  'テスト': 'assessment',
  'rubric': 'assessment',
  '個別指導': 'individual',
  '配慮': 'individual',
  'individual': 'individual',
  'フィードバック': 'feedback',
  '振り返り': 'feedback',
  'feedback': 'feedback',
  '生活指導': 'guidance',
  '行動': 'guidance',
  'guidance': 'guidance',
};

/**
 * Bloom's Taxonomy レベルマップ
 */
export const BLOOM_LEVELS: Record<BloomLevel, { name: string; verbs: string[] }> = {
  remember: {
    name: '記憶',
    verbs: ['定義する', '列挙する', '識別する', '再現する'],
  },
  understand: {
    name: '理解',
    verbs: ['説明する', '要約する', '言い換える', '分類する'],
  },
  apply: {
    name: '応用',
    verbs: ['適用する', '実行する', '使用する', '実演する'],
  },
  analyze: {
    name: '分析',
    verbs: ['比較する', '対照する', '区別する', '組織する'],
  },
  evaluate: {
    name: '評価',
    verbs: ['批評する', '判断する', '正当化する', '評価する'],
  },
  create: {
    name: '創造',
    verbs: ['設計する', '構築する', '開発する', '創作する'],
  },
};
