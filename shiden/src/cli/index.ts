/**
 * SHIDEN CLI
 * @module cli
 */

import { parseArgs } from 'node:util';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

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

// ヘルプメッセージ
const HELP_MESSAGE = `
🎓 SHIDEN - 教育者向けGitHub Copilot Agent Skills

Usage: npx shiden <command> [options]

Commands:
  init [path]    プロジェクトにSHIDEN Agent Skillsを初期化
  -v, --version  バージョンを表示
  -h, --help     このヘルプメッセージを表示

Examples:
  npx shiden init           現在のディレクトリに初期化
  npx shiden init ./myproject  指定ディレクトリに初期化

詳細: https://github.com/nahisaho/SHIDEN
`;

// 成功メッセージ
function getSuccessMessage(targetDir: string): string {
  return `
✅ SHIDEN Agent Skills を初期化しました！

📁 作成されたファイル:
  ${targetDir}/AGENTS.md              - Agent Skills エントリーポイント
  ${targetDir}/.github/prompts/       - 教育スキルプロンプト
  ${targetDir}/.github/skills/        - 統合スキル

🚀 次のステップ:
  1. VS Code で ${targetDir} を開く
  2. GitHub Copilot Chat を起動
  3. @workspace に質問する（例: 「中学2年の数学の授業計画を作成して」）

💡 TENJIN GraphRAG 連携（推奨）:
  TENJIN MCP Serverをセットアップすると、175+の教育理論を活用できます。
  https://github.com/nahisaho/TENJIN

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

    console.log(getSuccessMessage(targetDir));
  } catch (error) {
    console.error(`\n❌ 初期化中にエラーが発生しました:`, error);
    process.exit(1);
  }
}

// メイン処理
function main(): void {
  try {
    const { values, positionals } = parseArgs({
      allowPositionals: true,
      options: {
        version: {
          type: 'boolean',
          short: 'v',
        },
        help: {
          type: 'boolean',
          short: 'h',
        },
      },
    });

    // バージョン表示
    if (values.version) {
      console.log(`shiden v${getVersion()}`);
      return;
    }

    // ヘルプ表示
    if (values.help || positionals.length === 0) {
      console.log(HELP_MESSAGE);
      return;
    }

    const command = positionals[0];

    switch (command) {
      case 'init':
        initCommand(positionals[1]);
        break;
      default:
        console.error(`\n❌ 不明なコマンド: ${command}`);
        console.log(HELP_MESSAGE);
        process.exit(1);
    }
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

main();
