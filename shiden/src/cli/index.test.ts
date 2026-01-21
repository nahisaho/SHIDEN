/**
 * SHIDEN CLI テスト
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_PATH = path.resolve(__dirname, '../../bin/shiden.js');

describe('SHIDEN CLI', () => {
  let tempDir: string;

  beforeEach(() => {
    // テスト用の一時ディレクトリを作成
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'shiden-test-'));
  });

  afterEach(() => {
    // 一時ディレクトリを削除
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('--version', () => {
    it('should display version', () => {
      const output = execSync(`node ${CLI_PATH} --version`, {
        encoding: 'utf-8',
      });
      // Commander.js outputs just the version number
      expect(output).toMatch(/\d+\.\d+\.\d+/);
    });

    it('should display version with short flag', () => {
      const output = execSync(`node ${CLI_PATH} -v`, {
        encoding: 'utf-8',
      });
      expect(output).toMatch(/\d+\.\d+\.\d+/);
    });
  });

  describe('--help', () => {
    it('should display help message', () => {
      const output = execSync(`node ${CLI_PATH} --help`, {
        encoding: 'utf-8',
      });
      expect(output).toContain('SHIDEN');
      expect(output).toContain('教育者向けGitHub Copilot Agent Skills');
      expect(output).toContain('init');
    });

    it('should display help with short flag', () => {
      const output = execSync(`node ${CLI_PATH} -h`, {
        encoding: 'utf-8',
      });
      expect(output).toContain('SHIDEN');
    });
  });

  describe('init', () => {
    it('should initialize SHIDEN in target directory', () => {
      const output = execSync(`node ${CLI_PATH} init ${tempDir}`, {
        encoding: 'utf-8',
      });

      // 成功メッセージの確認
      expect(output).toContain('SHIDEN Agent Skills を初期化しました');

      // ファイルの存在確認
      expect(fs.existsSync(path.join(tempDir, 'AGENTS.md'))).toBe(true);
      expect(fs.existsSync(path.join(tempDir, '.github', 'prompts'))).toBe(true);
      expect(fs.existsSync(path.join(tempDir, '.github', 'skills'))).toBe(true);
    });

    it('should create all prompt files', () => {
      execSync(`node ${CLI_PATH} init ${tempDir}`, { encoding: 'utf-8' });

      const promptFiles = [
        'meta-prompt.md',
        'lesson-plan.md',
        'materials.md',
        'assessment.md',
        'individual.md',
        'feedback.md',
        'guidance.md',
      ];

      for (const file of promptFiles) {
        const filePath = path.join(tempDir, '.github', 'prompts', file);
        expect(fs.existsSync(filePath)).toBe(true);
      }
    });

    it('should create all skill files', () => {
      execSync(`node ${CLI_PATH} init ${tempDir}`, { encoding: 'utf-8' });

      const skillFiles = [
        'orchestrator.md',
        'theory-lookup.md',
        'context-manager.md',
      ];

      for (const file of skillFiles) {
        const filePath = path.join(tempDir, '.github', 'skills', file);
        expect(fs.existsSync(filePath)).toBe(true);
      }
    });

    it('should create TENJIN MCP configuration', () => {
      execSync(`node ${CLI_PATH} init ${tempDir}`, { encoding: 'utf-8' });

      const mcpPath = path.join(tempDir, '.vscode', 'mcp.json');
      expect(fs.existsSync(mcpPath)).toBe(true);

      // MCP設定の内容を確認
      const mcpContent = JSON.parse(fs.readFileSync(mcpPath, 'utf-8'));
      expect(mcpContent.mcp.servers.tenjin).toBeDefined();
      expect(mcpContent.mcp.servers.tenjin.command).toBe('uvx');
    });
  });

  describe('unknown command', () => {
    it('should show error for unknown command', () => {
      try {
        execSync(`node ${CLI_PATH} unknown`, {
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'],
        });
        expect.fail('Should have thrown error');
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'status' in error) {
          expect((error as { status: number }).status).toBe(1);
        }
      }
    });
  });
});
