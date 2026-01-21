import { Command } from 'commander';
import {
  CurriculumService,
  isCurriculumDbAvailable,
} from '../../curriculum/index.js';

/**
 * curriculum コマンドを作成
 */
export function createCurriculumCommand(): Command {
  const program = new Command('curriculum');

  program
    .description('学習指導要領の検索・参照')
    .addHelpText(
      'after',
      `
例:
  $ shiden curriculum search "プログラミング"
  $ shiden curriculum search "算数 図形"
  $ shiden curriculum subject 国語
  $ shiden curriculum grade "小学校3年"
  $ shiden curriculum stats
`
    );

  // search サブコマンド
  program
    .command('search <query>')
    .description('キーワードで学習指導要領を検索')
    .option('-l, --limit <number>', '最大結果数', '10')
    .option('-r, --related', '関連セクションも含める', false)
    .action((query, options) => {
      if (!isCurriculumDbAvailable()) {
        console.error(
          '❌ カリキュラムDBが見つかりません。\n' +
            '   node scripts/build-curriculum.js を実行してください。'
        );
        process.exit(1);
      }

      const service = new CurriculumService();
      const results = service.search(query, {
        limit: parseInt(options.limit, 10),
        includeRelated: options.related,
      });

      console.log(service.formatResults(results));
    });

  // subject サブコマンド
  program
    .command('subject <name>')
    .description('教科別に学習指導要領を検索')
    .action((name) => {
      if (!isCurriculumDbAvailable()) {
        console.error('❌ カリキュラムDBが見つかりません。');
        process.exit(1);
      }

      const service = new CurriculumService();
      const results = service.searchBySubject(name);
      console.log(service.formatResults(results));
    });

  // grade サブコマンド
  program
    .command('grade <grade>')
    .description('学年別に学習指導要領を検索')
    .action((grade) => {
      if (!isCurriculumDbAvailable()) {
        console.error('❌ カリキュラムDBが見つかりません。');
        process.exit(1);
      }

      const service = new CurriculumService();
      const results = service.searchByGrade(grade);
      console.log(service.formatResults(results));
    });

  // stats サブコマンド
  program
    .command('stats')
    .description('学習指導要領DBの統計を表示')
    .action(() => {
      if (!isCurriculumDbAvailable()) {
        console.error('❌ カリキュラムDBが見つかりません。');
        process.exit(1);
      }

      const service = new CurriculumService();
      const stats = service.getStats();
      console.log(service.formatStats(stats));
    });

  return program;
}
