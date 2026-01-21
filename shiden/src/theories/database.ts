/**
 * SQLiteデータベース接続管理
 * TSK-004: データベース接続
 * @module theories/database
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db: Database.Database | null = null;

/**
 * データベースファイルのパスを取得
 * npm パッケージとしてインストールされた場合と開発時の両方に対応
 */
function getDatabasePath(): string {
  // 1. まず dist/ 配下の data/ を探す（npm pack 後）
  const distDataPath = path.join(__dirname, '..', 'data', 'theories.db');
  if (fs.existsSync(distDataPath)) {
    return distDataPath;
  }
  
  // 2. src/data/ を探す（開発時）
  const srcDataPath = path.join(__dirname, '..', '..', 'src', 'data', 'theories.db');
  if (fs.existsSync(srcDataPath)) {
    return srcDataPath;
  }
  
  // 3. パッケージルートの src/data/ を探す（npm link 時）
  const packageRootPath = path.join(__dirname, '..', '..', '..', 'src', 'data', 'theories.db');
  if (fs.existsSync(packageRootPath)) {
    return packageRootPath;
  }
  
  throw new Error(`Database file not found. Searched paths:\n- ${distDataPath}\n- ${srcDataPath}\n- ${packageRootPath}`);
}

/**
 * SQLiteデータベース接続を取得（シングルトン）
 * @returns Database instance
 */
export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = getDatabasePath();
    db = new Database(dbPath, { readonly: true });
    db.pragma('journal_mode = WAL');
  }
  return db;
}

/**
 * データベース接続を閉じる
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * データベースパスを取得（テスト用）
 */
export function getDatabasePathForTest(): string {
  return getDatabasePath();
}
