#!/usr/bin/env node
/**
 * Neo4jから教育理論データをエクスポートするスクリプト
 * TSK-001: Neo4jからデータエクスポート
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data');

// 出力ディレクトリ作成
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('📥 Neo4jから教育理論データをエクスポート中...\n');

// 理論データをエクスポート
console.log('1. 理論データを取得中...');
const theoriesQuery = `
MATCH (t:Theory) 
RETURN {
  id: t.id,
  name: t.name,
  name_ja: t.name_ja,
  category: t.category,
  description: t.description,
  description_ja: t.description_ja,
  theorists: COALESCE(t.theorists, []),
  priority: COALESCE(t.priority, 5),
  key_principles: COALESCE(t.key_principles, []),
  applications: COALESCE(t.applications, []),
  strengths: COALESCE(t.strengths, []),
  limitations: COALESCE(t.limitations, [])
} as theory
`.replace(/\n/g, ' ').trim();

try {
  const theoriesRaw = execSync(
    `docker exec tenjin-neo4j cypher-shell -u neo4j -p password "${theoriesQuery}" --format plain 2>/dev/null`,
    { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
  );

  // パース処理
  const lines = theoriesRaw.split('\n').filter(line => line.trim() && line.trim() !== 'theory');
  const theories = [];

  for (const line of lines) {
    try {
      // Neo4jの出力形式を修正
      let jsonStr = line.trim()
        .replace(/NULL/g, 'null')
        .replace(/(\w+):/g, '"$1":')  // キーをダブルクォート
        .replace(/'/g, '"');           // シングルクォートをダブルクォートに
      
      const theory = JSON.parse(jsonStr);
      theories.push(theory);
    } catch (e) {
      // 単純なJSONパースが失敗した場合、手動パース
      console.log(`  ⚠️ パースエラー (スキップ): ${line.substring(0, 50)}...`);
    }
  }

  console.log(`  ✅ ${theories.length}件の理論を取得\n`);

  // 関係データをエクスポート
  console.log('2. 関係データを取得中...');
  const relationsQuery = `
MATCH (t1:Theory)-[r]->(t2:Theory) 
RETURN {
  source_id: t1.id,
  target_id: t2.id,
  relation_type: type(r),
  weight: COALESCE(r.weight, 1.0)
} as relation
`.replace(/\n/g, ' ').trim();

  const relationsRaw = execSync(
    `docker exec tenjin-neo4j cypher-shell -u neo4j -p password "${relationsQuery}" --format plain 2>/dev/null`,
    { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
  );

  const relLines = relationsRaw.split('\n').filter(line => line.trim() && line.trim() !== 'relation');
  const relations = [];

  for (const line of relLines) {
    try {
      let jsonStr = line.trim()
        .replace(/NULL/g, 'null')
        .replace(/(\w+):/g, '"$1":')
        .replace(/'/g, '"');
      
      const relation = JSON.parse(jsonStr);
      relations.push(relation);
    } catch (e) {
      // スキップ
    }
  }

  console.log(`  ✅ ${relations.length}件の関係を取得\n`);

  // ファイル出力
  const theoriesPath = path.join(OUTPUT_DIR, 'theories.json');
  const relationsPath = path.join(OUTPUT_DIR, 'relations.json');

  fs.writeFileSync(theoriesPath, JSON.stringify(theories, null, 2));
  fs.writeFileSync(relationsPath, JSON.stringify(relations, null, 2));

  console.log('3. 出力完了:');
  console.log(`  📄 ${theoriesPath}`);
  console.log(`  📄 ${relationsPath}`);
  console.log('\n✅ エクスポート完了!');

} catch (error) {
  console.error('❌ エラー:', error.message);
  process.exit(1);
}
