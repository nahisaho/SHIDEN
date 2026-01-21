#!/usr/bin/env node
/**
 * SQLiteデータベースを作成するスクリプト
 * TSK-002: SQLiteスキーマ作成・データ投入
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const DB_PATH = path.join(DATA_DIR, 'theories.db');

// 既存のDBファイルがあれば削除
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
}

console.log('🗄️  SQLiteデータベースを作成中...\n');

// データベース作成
const db = new Database(DB_PATH);

// WALモード有効化
db.pragma('journal_mode = WAL');

// スキーマ作成
console.log('1. スキーマ作成中...');

db.exec(`
  -- 理論テーブル
  CREATE TABLE theories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_ja TEXT,
    category TEXT NOT NULL,
    description TEXT,
    description_ja TEXT,
    theorists TEXT,        -- JSON配列
    priority INTEGER DEFAULT 5,
    key_principles TEXT,   -- JSON配列
    applications TEXT,     -- JSON配列
    strengths TEXT,        -- JSON配列
    limitations TEXT       -- JSON配列
  );

  CREATE INDEX idx_theories_category ON theories(category);
  CREATE INDEX idx_theories_name ON theories(name);

  -- 関係テーブル
  CREATE TABLE theory_relations (
    source_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    relation_type TEXT NOT NULL DEFAULT 'related_to',
    weight REAL DEFAULT 1.0,
    PRIMARY KEY (source_id, target_id, relation_type),
    FOREIGN KEY (source_id) REFERENCES theories(id),
    FOREIGN KEY (target_id) REFERENCES theories(id)
  );

  CREATE INDEX idx_relations_source ON theory_relations(source_id);
  CREATE INDEX idx_relations_target ON theory_relations(target_id);

  -- FTS5 全文検索インデックス（trigram トークナイザーで日本語対応）
  CREATE VIRTUAL TABLE theories_fts USING fts5(
    name, name_ja, description, description_ja,
    key_principles, applications,
    content='theories',
    content_rowid='rowid',
    tokenize='trigram'
  );

  -- FTS5 自動同期トリガー
  CREATE TRIGGER theories_ai AFTER INSERT ON theories BEGIN
    INSERT INTO theories_fts(rowid, name, name_ja, description, description_ja, key_principles, applications)
    VALUES (NEW.rowid, NEW.name, NEW.name_ja, NEW.description, NEW.description_ja, NEW.key_principles, NEW.applications);
  END;

  CREATE TRIGGER theories_ad AFTER DELETE ON theories BEGIN
    INSERT INTO theories_fts(theories_fts, rowid, name, name_ja, description, description_ja, key_principles, applications)
    VALUES ('delete', OLD.rowid, OLD.name, OLD.name_ja, OLD.description, OLD.description_ja, OLD.key_principles, OLD.applications);
  END;

  CREATE TRIGGER theories_au AFTER UPDATE ON theories BEGIN
    INSERT INTO theories_fts(theories_fts, rowid, name, name_ja, description, description_ja, key_principles, applications)
    VALUES ('delete', OLD.rowid, OLD.name, OLD.name_ja, OLD.description, OLD.description_ja, OLD.key_principles, OLD.applications);
    INSERT INTO theories_fts(rowid, name, name_ja, description, description_ja, key_principles, applications)
    VALUES (NEW.rowid, NEW.name, NEW.name_ja, NEW.description, NEW.description_ja, NEW.key_principles, NEW.applications);
  END;
`);

console.log('  ✅ スキーマ作成完了\n');

// データ投入
console.log('2. 理論データを投入中...');

const theoriesData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'theories.json'), 'utf-8'));

const insertTheory = db.prepare(`
  INSERT INTO theories (
    id, name, name_ja, category, description, description_ja,
    theorists, priority, key_principles, applications, strengths, limitations
  ) VALUES (
    @id, @name, @name_ja, @category, @description, @description_ja,
    @theorists, @priority, @key_principles, @applications, @strengths, @limitations
  )
`);

const insertTheories = db.transaction((theories) => {
  for (const t of theories) {
    insertTheory.run({
      id: t.id,
      name: t.name,
      name_ja: t.name_ja,
      category: t.category,
      description: t.description,
      description_ja: t.description_ja,
      theorists: JSON.stringify(t.theorists || []),
      priority: t.priority || 5,
      key_principles: JSON.stringify(t.key_principles || []),
      applications: JSON.stringify(t.applications || []),
      strengths: JSON.stringify(t.strengths || []),
      limitations: JSON.stringify(t.limitations || [])
    });
  }
});

insertTheories(theoriesData);
console.log(`  ✅ ${theoriesData.length}件の理論を投入\n`);

// 関係データ投入
console.log('3. 関係データを投入中...');

const relationsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'relations.json'), 'utf-8'));

const insertRelation = db.prepare(`
  INSERT OR IGNORE INTO theory_relations (source_id, target_id, relation_type, weight)
  VALUES (@source_id, @target_id, @relation_type, @weight)
`);

const insertRelations = db.transaction((relations) => {
  for (const r of relations) {
    insertRelation.run({
      source_id: r.source_id,
      target_id: r.target_id,
      relation_type: r.relation_type,
      weight: r.weight || 1.0
    });
  }
});

insertRelations(relationsData);
console.log(`  ✅ ${relationsData.length}件の関係を投入\n`);

// 検証
console.log('4. 検証中...');

const theoryCount = db.prepare('SELECT COUNT(*) as count FROM theories').get();
const relationCount = db.prepare('SELECT COUNT(*) as count FROM theory_relations').get();
const categoryStats = db.prepare('SELECT category, COUNT(*) as count FROM theories GROUP BY category ORDER BY count DESC').all();

console.log(`  📊 理論数: ${theoryCount.count}`);
console.log(`  📊 関係数: ${relationCount.count}`);
console.log('  📊 カテゴリ別:');
for (const cat of categoryStats) {
  console.log(`     - ${cat.category}: ${cat.count}件`);
}

// FTS5検索テスト
console.log('\n5. FTS5検索テスト...');
const searchResult = db.prepare(`
  SELECT t.id, t.name, t.name_ja
  FROM theories_fts
  JOIN theories t ON theories_fts.rowid = t.rowid
  WHERE theories_fts MATCH '認知'
  LIMIT 5
`).all();

console.log(`  🔍 "認知" で検索: ${searchResult.length}件`);
for (const r of searchResult) {
  console.log(`     - ${r.id}: ${r.name} (${r.name_ja})`);
}

// グラフ走査テスト
console.log('\n6. グラフ走査テスト...');
const graphResult = db.prepare(`
  WITH RECURSIVE related_graph AS (
    SELECT target_id, relation_type, 1 as depth
    FROM theory_relations
    WHERE source_id = 'theory-001'
    
    UNION ALL
    
    SELECT r.target_id, r.relation_type, rg.depth + 1
    FROM theory_relations r
    INNER JOIN related_graph rg ON r.source_id = rg.target_id
    WHERE rg.depth < 3
  )
  SELECT DISTINCT t.id, t.name, rg.depth, rg.relation_type
  FROM related_graph rg
  JOIN theories t ON t.id = rg.target_id
  ORDER BY rg.depth, t.name
  LIMIT 10
`).all();

console.log(`  🔗 theory-001 の関連理論 (深さ3): ${graphResult.length}件`);
for (const r of graphResult) {
  console.log(`     ${'  '.repeat(r.depth - 1)}└─ ${r.id}: ${r.name} (${r.relation_type})`);
}

// クリーンアップ
db.close();

// ファイルサイズ確認
const stats = fs.statSync(DB_PATH);
console.log(`\n✅ データベース作成完了!`);
console.log(`  📁 ${DB_PATH}`);
console.log(`  📦 サイズ: ${(stats.size / 1024).toFixed(1)} KB`);
