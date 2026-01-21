import Database from 'better-sqlite3';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * カリキュラムデータベースへの接続を管理するシングルトン
 */
let curriculumDbInstance: Database.Database | null = null;

/**
 * データベースファイルのパスを検索
 */
function findCurriculumDbPath(): string | null {
  const possiblePaths = [
    // 開発環境
    join(__dirname, '../data/curriculum.db'),
    join(__dirname, '../../src/data/curriculum.db'),
    // npm パッケージとしてインストールされた場合
    join(__dirname, 'data/curriculum.db'),
    // グローバルインストール
    join(process.cwd(), 'node_modules/shiden/dist/data/curriculum.db'),
    join(process.cwd(), 'curriculum.db'),
  ];

  for (const p of possiblePaths) {
    if (existsSync(p)) {
      return p;
    }
  }

  return null;
}

/**
 * カリキュラムデータベース接続を取得
 */
export function getCurriculumDb(): Database.Database {
  if (curriculumDbInstance) {
    return curriculumDbInstance;
  }

  const dbPath = findCurriculumDbPath();
  if (!dbPath) {
    throw new Error(
      'カリキュラムデータベースが見つかりません。\n' +
        'node scripts/build-curriculum.js を実行してください。'
    );
  }

  curriculumDbInstance = new Database(dbPath, { readonly: true });
  return curriculumDbInstance;
}

/**
 * データベース接続を閉じる
 */
export function closeCurriculumDb(): void {
  if (curriculumDbInstance) {
    curriculumDbInstance.close();
    curriculumDbInstance = null;
  }
}

/**
 * データベースが利用可能かチェック
 */
export function isCurriculumDbAvailable(): boolean {
  return findCurriculumDbPath() !== null;
}
