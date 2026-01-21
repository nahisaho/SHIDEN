/**
 * theories コマンド実装
 * TSK-007: CLIコマンド実装
 * @module cli/commands/theories
 */

import { Command } from 'commander';
import chalk from 'chalk';
import * as TheoryService from '../../theories/index.js';
import type { Theory, RelatedTheory } from '../../theories/index.js';

/**
 * 理論を整形して表示
 */
function formatTheory(theory: Theory, verbose = false): string {
  const lines: string[] = [];
  
  lines.push(chalk.cyan(`${theory.id}: ${theory.name}`));
  if (theory.name_ja) {
    lines.push(chalk.gray(`  ${theory.name_ja}`));
  }
  lines.push(chalk.yellow(`  Category: ${theory.category}`));
  
  if (verbose) {
    if (theory.description) {
      lines.push(chalk.white(`  Description: ${theory.description.substring(0, 200)}...`));
    }
    if (theory.key_principles.length > 0) {
      lines.push(chalk.green(`  Principles: ${theory.key_principles.slice(0, 3).join(', ')}`));
    }
  }
  
  return lines.join('\n');
}

/**
 * 関連理論をツリー形式で表示
 */
function formatRelatedTree(theories: RelatedTheory[]): string {
  const lines: string[] = [];
  
  for (const theory of theories) {
    const indent = '  '.repeat(theory.depth);
    const prefix = theory.depth === 1 ? '└─' : '└─';
    lines.push(
      `${indent}${prefix} ${chalk.cyan(theory.id)}: ${theory.name} ` +
      chalk.gray(`(${theory.relation_type})`)
    );
  }
  
  return lines.join('\n');
}

/**
 * theories コマンドを作成
 */
export function createTheoriesCommand(): Command {
  const theories = new Command('theories')
    .description('教育理論データベースの操作');

  // theories list
  theories
    .command('list')
    .description('理論一覧を表示')
    .option('-c, --category <category>', 'カテゴリでフィルタ')
    .option('-l, --limit <number>', '表示件数', '20')
    .option('-o, --offset <number>', 'オフセット', '0')
    .action((options) => {
      const limit = parseInt(options.limit, 10);
      const offset = parseInt(options.offset, 10);
      const category = options.category;
      
      const theories = TheoryService.list({ category, limit, offset });
      const total = TheoryService.count();
      
      console.log(chalk.bold(`\n📚 教育理論一覧 (${theories.length}/${total}件)\n`));
      
      for (const theory of theories) {
        console.log(formatTheory(theory));
        console.log('');
      }
      
      if (category) {
        console.log(chalk.gray(`フィルタ: category=${category}`));
      }
    });

  // theories search
  theories
    .command('search <query>')
    .description('理論を検索（FTS5 trigram）')
    .option('-c, --category <category>', 'カテゴリでフィルタ')
    .option('-l, --limit <number>', '表示件数', '10')
    .option('-v, --verbose', '詳細表示')
    .action((query, options) => {
      const limit = parseInt(options.limit, 10);
      const result = TheoryService.search(query, {
        category: options.category,
        limit,
      });
      
      console.log(chalk.bold(`\n🔍 検索結果: "${query}" (${result.total}件, ${result.durationMs}ms)\n`));
      
      if (result.theories.length === 0) {
        console.log(chalk.yellow('  該当する理論が見つかりませんでした。'));
        console.log(chalk.gray('  ヒント: 3文字以上のクエリを使用してください（trigramインデックス）'));
      } else {
        for (const theory of result.theories) {
          console.log(formatTheory(theory, options.verbose));
          console.log('');
        }
      }
    });

  // theories get
  theories
    .command('get <id>')
    .description('理論の詳細を取得')
    .action((id) => {
      const theory = TheoryService.get(id);
      
      if (!theory) {
        console.log(chalk.red(`\n❌ 理論が見つかりません: ${id}`));
        return;
      }
      
      console.log(chalk.bold(`\n📖 ${theory.name}\n`));
      
      if (theory.name_ja) {
        console.log(chalk.cyan(`日本語名: ${theory.name_ja}`));
      }
      console.log(chalk.yellow(`カテゴリ: ${theory.category}`));
      console.log(chalk.gray(`ID: ${theory.id}`));
      console.log('');
      
      if (theory.description) {
        console.log(chalk.bold('説明:'));
        console.log(`  ${theory.description}`);
        console.log('');
      }
      
      if (theory.description_ja) {
        console.log(chalk.bold('説明（日本語）:'));
        console.log(`  ${theory.description_ja}`);
        console.log('');
      }
      
      if (theory.key_principles.length > 0) {
        console.log(chalk.bold('主要原則:'));
        for (const p of theory.key_principles) {
          console.log(chalk.green(`  • ${p}`));
        }
        console.log('');
      }
      
      if (theory.applications.length > 0) {
        console.log(chalk.bold('応用分野:'));
        for (const a of theory.applications) {
          console.log(chalk.blue(`  • ${a}`));
        }
        console.log('');
      }
      
      if (theory.strengths.length > 0) {
        console.log(chalk.bold('強み:'));
        for (const s of theory.strengths) {
          console.log(chalk.green(`  ✓ ${s}`));
        }
        console.log('');
      }
      
      if (theory.limitations.length > 0) {
        console.log(chalk.bold('限界・制約:'));
        for (const l of theory.limitations) {
          console.log(chalk.red(`  ✗ ${l}`));
        }
      }
    });

  // theories categories
  theories
    .command('categories')
    .description('カテゴリ一覧を表示')
    .action(() => {
      const categories = TheoryService.categories();
      const total = categories.reduce((sum, c) => sum + c.count, 0);
      
      console.log(chalk.bold(`\n📁 カテゴリ一覧 (${categories.length}カテゴリ, ${total}理論)\n`));
      
      for (const cat of categories) {
        const bar = '█'.repeat(Math.ceil(cat.count / 5));
        console.log(`  ${chalk.cyan(cat.name.padEnd(25))} ${chalk.yellow(String(cat.count).padStart(3))}件 ${chalk.gray(bar)}`);
      }
    });

  // theories related
  theories
    .command('related <id>')
    .description('関連理論を取得（グラフ走査）')
    .option('-d, --depth <number>', '走査深さ (1-3)', '2')
    .action((id, options) => {
      const depth = Math.min(Math.max(parseInt(options.depth, 10), 1), 3);
      
      const theory = TheoryService.get(id);
      if (!theory) {
        console.log(chalk.red(`\n❌ 理論が見つかりません: ${id}`));
        return;
      }
      
      const related = TheoryService.related(id, { depth });
      
      console.log(chalk.bold(`\n🔗 関連理論: ${theory.name}\n`));
      console.log(chalk.gray(`   起点: ${id} (深さ: ${depth})`));
      console.log('');
      
      if (related.length === 0) {
        console.log(chalk.yellow('  関連理論が見つかりませんでした。'));
      } else {
        console.log(formatRelatedTree(related));
        console.log('');
        console.log(chalk.gray(`  ${related.length}件の関連理論`));
      }
    });

  return theories;
}

export default createTheoriesCommand;
