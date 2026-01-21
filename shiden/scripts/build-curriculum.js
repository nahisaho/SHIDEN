#!/usr/bin/env node

/**
 * build-curriculum.js
 *
 * 学習指導要領MarkdownファイルからSQLite GraphRAG DBを構築するスクリプト
 *
 * 使用法:
 *   node scripts/build-curriculum.js [input-dir] [output-db]
 *
 * 例:
 *   node scripts/build-curriculum.js ../CurricurlumGuideline ./src/data/curriculum.db
 */

import Database from 'better-sqlite3';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// デフォルトパス
const DEFAULT_INPUT_DIR = join(__dirname, '../../CurricurlumGuideline');
const DEFAULT_OUTPUT_DB = join(__dirname, '../src/data/curriculum.db');

/**
 * セクション情報を表す型
 * @typedef {Object} Section
 * @property {string} id - セクションID (例: "CURR-ES-CH01-SEC01-001")
 * @property {string} document_type - ドキュメント種別 (elementary_school, middle_school, etc.)
 * @property {string} chapter - 章名
 * @property {string} section - 節名
 * @property {string} title - タイトル
 * @property {string} content - 本文内容
 * @property {number} level - 見出しレベル (1-6)
 * @property {number} order_index - 順序インデックス
 * @property {string} source_file - ソースファイル名
 */

/**
 * Markdownファイルをセクションに分割
 * @param {string} content - Markdownコンテンツ
 * @param {string} sourceFile - ソースファイル名
 * @returns {Section[]}
 */
function parseMarkdown(content, sourceFile) {
  const sections = [];
  const lines = content.split('\n');

  // ドキュメント種別を判定（ファイル名で判定）
  // ファイル名: _01.md = 小学校, _02.md = 中学校, _03.md = 高等学校
  let documentType = 'unknown';
  const fileMatch = sourceFile.match(/_(\d+)\.md$/);
  if (fileMatch) {
    const fileNum = fileMatch[1];
    documentType = {
      '01': 'elementary_school',
      '02': 'middle_school',
      '03': 'high_school',
    }[fileNum] || 'unknown';
  }

  // ファイル名で判定できない場合はコンテンツで判定
  if (documentType === 'unknown') {
    const firstLines = content.split('\n').slice(0, 50).join('\n');
    if (firstLines.includes('⾼等学校') || firstLines.includes('高等学校')) {
      documentType = 'high_school';
    } else if (firstLines.includes('中学校')) {
      documentType = 'middle_school';
    } else if (firstLines.includes('⼩学校') || firstLines.includes('小学校')) {
      documentType = 'elementary_school';
    }
  }

  // 現在のコンテキスト
  let currentChapter = '';
  let currentSection = '';
  let currentContent = [];
  let currentTitle = '';
  let currentLevel = 0;
  let orderIndex = 0;

  // 見出しパターン
  const headerPattern = /^(#{1,6})\s+(.+)$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headerMatch = line.match(headerPattern);

    if (headerMatch) {
      // 前のセクションを保存
      if (currentTitle && currentContent.length > 0) {
        const contentText = currentContent
          .join('\n')
          .trim()
          .replace(/!\[Image\]\(data:image[^)]+\)/g, '') // Base64画像を除去
          .replace(/\|[^|]+\|[^|]+\|/g, '') // テーブル構文を簡略化
          .trim();

        if (contentText.length > 50) {
          // 短すぎるセクションは除外
          const id = generateSectionId(
            documentType,
            currentChapter,
            currentSection,
            sourceFile
          );

          sections.push({
            id,
            document_type: documentType,
            chapter: currentChapter,
            section: currentSection,
            title: currentTitle,
            content: contentText,
            level: currentLevel,
            order_index: orderIndex++,
            source_file: sourceFile,
          });
        }
      }

      // 新しいセクションを開始
      const level = headerMatch[1].length;
      const title = headerMatch[2].trim();
      currentLevel = level;
      currentTitle = title;
      currentContent = [];

      // 章・節の更新
      if (level === 1 || (level === 2 && title.includes('章'))) {
        currentChapter = title;
        currentSection = '';
      } else if (level === 2 || level === 3) {
        if (title.includes('節') || title.includes('項')) {
          currentSection = title;
        }
      }
    } else {
      // コンテンツを追加
      currentContent.push(line);
    }
  }

  // 最後のセクションを保存
  if (currentTitle && currentContent.length > 0) {
    const contentText = currentContent
      .join('\n')
      .trim()
      .replace(/!\[Image\]\(data:image[^)]+\)/g, '')
      .replace(/\|[^|]+\|[^|]+\|/g, '')
      .trim();

    if (contentText.length > 50) {
      const id = generateSectionId(
        documentType,
        currentChapter,
        currentSection,
        sourceFile
      );

      sections.push({
        id,
        document_type: documentType,
        chapter: currentChapter,
        section: currentSection,
        title: currentTitle,
        content: contentText,
        level: currentLevel,
        order_index: orderIndex++,
        source_file: sourceFile,
      });
    }
  }

  return sections;
}

// グローバルカウンター（ファイル間でユニークなIDを保証）
let globalSectionCounter = 0;

/**
 * セクションIDを生成
 * @param {string} docType - ドキュメント種別
 * @param {string} chapter - 章名
 * @param {string} section - 節名
 * @param {string} sourceFile - ソースファイル名
 * @returns {string}
 */
function generateSectionId(docType, chapter, section, sourceFile) {
  globalSectionCounter++;

  const docTypeCode =
    {
      elementary_school: 'ES',
      middle_school: 'MS',
      high_school: 'HS',
      unknown: 'XX',
    }[docType] || 'XX';

  // ファイル番号を抽出（01, 02, 03）
  const fileMatch = sourceFile.match(/_(\d+)\.md$/);
  const fileNum = fileMatch ? fileMatch[1] : '00';

  return `CURR-${docTypeCode}-F${fileNum}-${String(globalSectionCounter).padStart(5, '0')}`;
}

/**
 * セクション間の関係を抽出
 * @param {Section[]} sections - セクション配列
 * @returns {Array<{source_id: string, target_id: string, relation_type: string, weight: number}>}
 */
function extractRelations(sections) {
  const relations = [];

  // 階層関係（親子関係）
  for (let i = 1; i < sections.length; i++) {
    const current = sections[i];
    const prev = sections[i - 1];

    // 同じ章内の連続セクション
    if (current.chapter === prev.chapter) {
      relations.push({
        source_id: prev.id,
        target_id: current.id,
        relation_type: 'NEXT_SECTION',
        weight: 0.8,
      });
    }

    // 章の開始セクションとその章内のセクション
    if (
      current.level > prev.level &&
      current.chapter === prev.chapter &&
      prev.level <= 2
    ) {
      relations.push({
        source_id: prev.id,
        target_id: current.id,
        relation_type: 'CONTAINS',
        weight: 0.9,
      });
    }
  }

  // キーワードベースの関連（簡易版）
  const keywords = [
    '国語',
    '算数',
    '数学',
    '理科',
    '社会',
    '英語',
    '外国語',
    '道徳',
    '体育',
    '音楽',
    '図工',
    '家庭',
    '総合',
    '特別活動',
    '情報',
    'プログラミング',
  ];

  const sectionKeywords = new Map();

  // 各セクションのキーワードを抽出
  for (const section of sections) {
    const found = keywords.filter(
      (kw) => section.title.includes(kw) || section.content.includes(kw)
    );
    sectionKeywords.set(section.id, found);
  }

  // 共通キーワードを持つセクション間の関係
  for (let i = 0; i < sections.length; i++) {
    for (let j = i + 1; j < sections.length; j++) {
      const kw1 = sectionKeywords.get(sections[i].id) || [];
      const kw2 = sectionKeywords.get(sections[j].id) || [];
      const common = kw1.filter((k) => kw2.includes(k));

      if (common.length > 0) {
        relations.push({
          source_id: sections[i].id,
          target_id: sections[j].id,
          relation_type: 'RELATED_SUBJECT',
          weight: 0.5 + common.length * 0.1,
        });
      }
    }
  }

  return relations;
}

/**
 * データベースを初期化
 * @param {string} dbPath - データベースパス
 * @returns {Database.Database}
 */
function initDatabase(dbPath) {
  const db = new Database(dbPath);

  // WALモード有効化
  db.pragma('journal_mode = WAL');

  // テーブル作成
  db.exec(`
    -- カリキュラムセクションテーブル
    CREATE TABLE IF NOT EXISTS curriculum_sections (
      id TEXT PRIMARY KEY,
      document_type TEXT NOT NULL,
      chapter TEXT,
      section TEXT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      level INTEGER NOT NULL,
      order_index INTEGER NOT NULL,
      source_file TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- セクション間リレーションテーブル
    CREATE TABLE IF NOT EXISTS section_relations (
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation_type TEXT NOT NULL,
      weight REAL DEFAULT 0.5,
      PRIMARY KEY (source_id, target_id, relation_type),
      FOREIGN KEY (source_id) REFERENCES curriculum_sections(id),
      FOREIGN KEY (target_id) REFERENCES curriculum_sections(id)
    );

    -- FTS5全文検索インデックス（日本語トライグラム対応）
    CREATE VIRTUAL TABLE IF NOT EXISTS curriculum_fts USING fts5(
      id,
      title,
      content,
      chapter,
      section,
      tokenize='trigram'
    );

    -- FTS自動同期トリガー
    CREATE TRIGGER IF NOT EXISTS curriculum_ai AFTER INSERT ON curriculum_sections BEGIN
      INSERT INTO curriculum_fts(id, title, content, chapter, section)
      VALUES (NEW.id, NEW.title, NEW.content, NEW.chapter, NEW.section);
    END;

    CREATE TRIGGER IF NOT EXISTS curriculum_ad AFTER DELETE ON curriculum_sections BEGIN
      DELETE FROM curriculum_fts WHERE id = OLD.id;
    END;

    CREATE TRIGGER IF NOT EXISTS curriculum_au AFTER UPDATE ON curriculum_sections BEGIN
      DELETE FROM curriculum_fts WHERE id = OLD.id;
      INSERT INTO curriculum_fts(id, title, content, chapter, section)
      VALUES (NEW.id, NEW.title, NEW.content, NEW.chapter, NEW.section);
    END;

    -- インデックス
    CREATE INDEX IF NOT EXISTS idx_sections_document_type ON curriculum_sections(document_type);
    CREATE INDEX IF NOT EXISTS idx_sections_chapter ON curriculum_sections(chapter);
    CREATE INDEX IF NOT EXISTS idx_relations_source ON section_relations(source_id);
    CREATE INDEX IF NOT EXISTS idx_relations_target ON section_relations(target_id);
    CREATE INDEX IF NOT EXISTS idx_relations_type ON section_relations(relation_type);
  `);

  return db;
}

/**
 * メイン処理
 */
async function main() {
  const inputDir = process.argv[2] || DEFAULT_INPUT_DIR;
  const outputDb = process.argv[3] || DEFAULT_OUTPUT_DB;

  console.log('📚 学習指導要領 GraphRAG DB構築');
  console.log(`   入力ディレクトリ: ${inputDir}`);
  console.log(`   出力データベース: ${outputDb}`);
  console.log('');

  // 入力ディレクトリの存在確認
  if (!existsSync(inputDir)) {
    console.error(`❌ エラー: 入力ディレクトリが見つかりません: ${inputDir}`);
    process.exit(1);
  }

  // Markdownファイルを取得
  const mdFiles = readdirSync(inputDir).filter((f) => f.endsWith('.md'));

  if (mdFiles.length === 0) {
    console.error(
      `❌ エラー: Markdownファイルが見つかりません: ${inputDir}/*.md`
    );
    process.exit(1);
  }

  console.log(`📄 ${mdFiles.length}個のMarkdownファイルを処理...`);

  // データベース初期化
  const db = initDatabase(outputDb);

  // 既存データをクリア
  db.exec('DELETE FROM section_relations');
  db.exec('DELETE FROM curriculum_sections');
  db.exec('DELETE FROM curriculum_fts');

  // すべてのセクションを収集
  /** @type {Section[]} */
  const allSections = [];

  for (const mdFile of mdFiles) {
    const filePath = join(inputDir, mdFile);
    console.log(`   処理中: ${mdFile}`);

    const content = readFileSync(filePath, 'utf-8');
    const sections = parseMarkdown(content, mdFile);
    allSections.push(...sections);
    console.log(`      → ${sections.length}セクション抽出`);
  }

  console.log(`\n📊 合計: ${allSections.length}セクション`);

  // セクションをDBに挿入
  const insertSection = db.prepare(`
    INSERT INTO curriculum_sections (id, document_type, chapter, section, title, content, level, order_index, source_file)
    VALUES (@id, @document_type, @chapter, @section, @title, @content, @level, @order_index, @source_file)
  `);

  const insertMany = db.transaction((sections) => {
    for (const section of sections) {
      insertSection.run(section);
    }
  });

  insertMany(allSections);
  console.log('✅ セクションをDBに挿入完了');

  // リレーションを抽出・挿入
  const relations = extractRelations(allSections);
  console.log(`\n🔗 ${relations.length}個のリレーションを抽出`);

  const insertRelation = db.prepare(`
    INSERT OR IGNORE INTO section_relations (source_id, target_id, relation_type, weight)
    VALUES (@source_id, @target_id, @relation_type, @weight)
  `);

  const insertRelations = db.transaction((rels) => {
    for (const rel of rels) {
      insertRelation.run(rel);
    }
  });

  insertRelations(relations);
  console.log('✅ リレーションをDBに挿入完了');

  // 統計表示
  const stats = db
    .prepare(
      `
    SELECT 
      document_type,
      COUNT(*) as count
    FROM curriculum_sections
    GROUP BY document_type
  `
    )
    .all();

  console.log('\n📈 統計:');
  for (const stat of stats) {
    const typeName =
      {
        elementary_school: '小学校',
        middle_school: '中学校',
        high_school: '高等学校',
        unknown: 'その他',
      }[stat.document_type] || stat.document_type;
    console.log(`   ${typeName}: ${stat.count}セクション`);
  }

  const relationStats = db
    .prepare(
      `
    SELECT relation_type, COUNT(*) as count
    FROM section_relations
    GROUP BY relation_type
  `
    )
    .all();

  console.log('\n🔗 リレーション統計:');
  for (const stat of relationStats) {
    console.log(`   ${stat.relation_type}: ${stat.count}件`);
  }

  db.close();
  console.log(`\n✨ 完了: ${outputDb}`);
}

main().catch(console.error);
