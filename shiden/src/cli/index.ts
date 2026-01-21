/**
 * SHIDEN CLI
 * @module cli
 */

import { Command } from 'commander';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createTheoriesCommand } from './commands/theories.js';

// ESM でのディレクトリパス取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// パッケージバージョンを取得
function getVersion(): string {
  const packageJsonPath = path.resolve(__dirname, '../../package.json');
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version || '1.0.0';
  } catch {
    return '1.0.0';
  }
}

// 成功メッセージ
function getSuccessMessage(targetDir: string): string {
  return `
✅ SHIDEN Agent Skills を初期化しました！

📁 作成されたファイル:
  ${targetDir}/AGENTS.md              - Agent Skills エントリーポイント
  ${targetDir}/.github/prompts/       - 教育スキルプロンプト
  ${targetDir}/.github/skills/        - 統合スキル
  ${targetDir}/.vscode/mcp.json       - TENJIN MCP設定

🚀 次のステップ:
  1. VS Code で ${targetDir} を開く
  2. GitHub Copilot Chat を起動
  3. @workspace に質問する（例: 「中学2年の数学の授業計画を作成して」）

💡 TENJIN GraphRAG 連携（推奨）:
  175+の教育理論を活用するには、以下のセットアップが必要です：
  1. Docker で Neo4j + ChromaDB を起動
  2. uvx または pip で TENJIN をインストール
  3. .vscode/mcp.json の環境変数を調整
  詳細: https://github.com/nahisaho/TENJIN

📖 ドキュメント: https://github.com/nahisaho/SHIDEN
`;
}

// テンプレートディレクトリのパス
function getTemplatesDir(): string {
  return path.resolve(__dirname, '../../templates');
}

// ディレクトリを再帰的にコピー
function copyDirRecursive(src: string, dest: string): void {
  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 単一ファイルをコピー
function copyFile(src: string, dest: string): void {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

// init コマンド
function initCommand(targetPath: string = '.'): void {
  const targetDir = path.resolve(process.cwd(), targetPath);
  const templatesDir = getTemplatesDir();

  console.log(`\n🎓 SHIDEN Agent Skills を ${targetDir} に初期化します...\n`);

  // テンプレートディレクトリの存在確認
  if (!fs.existsSync(templatesDir)) {
    console.error(`❌ テンプレートディレクトリが見つかりません: ${templatesDir}`);
    console.error(`   パッケージが正しくインストールされているか確認してください。`);
    process.exit(1);
  }

  try {
    // AGENTS.md をコピー
    const agentsSrc = path.join(templatesDir, 'AGENTS.md');
    const agentsDest = path.join(targetDir, 'AGENTS.md');
    if (fs.existsSync(agentsSrc)) {
      copyFile(agentsSrc, agentsDest);
      console.log(`  ✓ AGENTS.md`);
    }

    // .github/prompts/ をコピー
    const promptsSrc = path.join(templatesDir, '.github', 'prompts');
    const promptsDest = path.join(targetDir, '.github', 'prompts');
    if (fs.existsSync(promptsSrc)) {
      copyDirRecursive(promptsSrc, promptsDest);
      console.log(`  ✓ .github/prompts/`);
    }

    // .github/skills/ をコピー
    const skillsSrc = path.join(templatesDir, '.github', 'skills');
    const skillsDest = path.join(targetDir, '.github', 'skills');
    if (fs.existsSync(skillsSrc)) {
      copyDirRecursive(skillsSrc, skillsDest);
      console.log(`  ✓ .github/skills/`);
    }

    // .vscode/mcp.json をコピー（TENJIN MCP設定）
    const mcpSrc = path.join(templatesDir, '.vscode', 'mcp.json');
    const mcpDest = path.join(targetDir, '.vscode', 'mcp.json');
    if (fs.existsSync(mcpSrc)) {
      copyFile(mcpSrc, mcpDest);
      console.log(`  ✓ .vscode/mcp.json`);
    }

    console.log(getSuccessMessage(targetDir));
  } catch (error) {
    console.error(`\n❌ 初期化中にエラーが発生しました:`, error);
    process.exit(1);
  }
}

// メイン処理
function main(): void {
  const program = new Command();
  
  program
    .name('shiden')
    .description('🎓 SHIDEN - 教育者向けGitHub Copilot Agent Skills')
    .version(getVersion(), '-v, --version', 'バージョンを表示');

  // init コマンド
  program
    .command('init [path]')
    .description('プロジェクトにSHIDEN Agent Skillsを初期化')
    .action((targetPath) => {
      initCommand(targetPath);
    });

  // theories サブコマンドを追加
  program.addCommand(createTheoriesCommand());

  program.parse();
}

main();
