# SHIDEN インストールガイド

このガイドでは、SHIDEN（教育者向けGitHub Copilot Agent Skills）のインストールと設定方法を説明します。

## 📋 目次

1. [前提条件](#前提条件)
2. [クイックスタート](#クイックスタート)
3. [TENJIN GraphRAG連携（推奨）](#tenjin-graphrag連携推奨)
4. [設定のカスタマイズ](#設定のカスタマイズ)
5. [トラブルシューティング](#トラブルシューティング)

---

## 前提条件

### 必須要件

| 要件 | バージョン | 確認コマンド |
|------|-----------|-------------|
| Node.js | >= 20.0.0 | `node -v` |
| npm | >= 10.0.0 | `npm -v` |
| VS Code | 最新版 | - |
| GitHub Copilot | アクティブなサブスクリプション | - |

### 推奨要件（TENJIN連携用）

| 要件 | バージョン | 用途 |
|------|-----------|------|
| Docker | 最新版 | Neo4j, ChromaDB, Redis |
| Python | >= 3.11 | TENJIN MCP Server |
| uv | 最新版 | Pythonパッケージ管理 |
| Ollama | 最新版 | ローカルLLM・Embedding |

---

## クイックスタート

### Step 1: パッケージインストール

```bash
npm install shiden
```

または、npxで直接実行：

```bash
npx shiden init
```

### Step 2: プロジェクト初期化

```bash
# 現在のディレクトリに初期化
npx shiden init

# 指定したディレクトリに初期化
npx shiden init ./my-education-project
```

### Step 3: 生成されるファイル

```
your-project/
├── AGENTS.md                    # Agent Skills エントリーポイント
├── .vscode/
│   └── mcp.json                 # TENJIN MCP設定
└── .github/
    ├── prompts/                 # 教育スキルプロンプト
    │   ├── meta-prompt.md       # メタプロンプト生成
    │   ├── lesson-plan.md       # 授業計画作成
    │   ├── materials.md         # 教材作成
    │   ├── assessment.md        # 評価設計
    │   ├── individual.md        # 個別指導計画
    │   ├── feedback.md          # フィードバック
    │   └── guidance.md          # 生活指導案
    │
    └── skills/                  # 統合スキル
        ├── orchestrator.md      # スキルオーケストレーション
        ├── theory-lookup.md     # TENJIN連携
        └── context-manager.md   # コンテキスト管理
```

### Step 4: 使用開始

1. VS Codeでプロジェクトを開く
2. GitHub Copilot Chatを起動（`Ctrl+Shift+I` / `Cmd+Shift+I`）
3. 以下のように質問：

```
@workspace 中学2年生の数学で「一次関数」の授業計画を作成してください
```

---

## TENJIN GraphRAG連携（推奨）

TENJIN連携により、175+の教育理論に基づいたエビデンス引用が可能になります。

### アーキテクチャ

```
┌─────────────────────────────────────────────────────────┐
│                    VS Code                               │
│  ┌─────────────┐     ┌─────────────────────────────┐    │
│  │   Copilot   │────▶│  SHIDEN Agent Skills        │    │
│  │    Chat     │     │  (.github/prompts, skills)  │    │
│  └─────────────┘     └──────────────┬──────────────┘    │
│                                      │ MCP Protocol     │
│                      ┌───────────────▼───────────────┐  │
│                      │      TENJIN MCP Server        │  │
│                      │   (.vscode/mcp.json設定)      │  │
│                      └───────────────┬───────────────┘  │
└──────────────────────────────────────┼──────────────────┘
                                       │
     ┌─────────────┬───────────────────┼───────────────┐
     │             │                   │               │
     ▼             ▼                   ▼               ▼
┌─────────┐  ┌──────────┐      ┌────────────┐   ┌─────────┐
│  Neo4j  │  │ ChromaDB │      │   Ollama   │   │  Redis  │
│ (Graph) │  │ (Vector) │      │ (LLM/Emb)  │   │ (Cache) │
└─────────┘  └──────────┘      └────────────┘   └─────────┘
```

### セットアップ手順

#### 1. TENJINリポジトリのクローン

```bash
git clone https://github.com/nahisaho/TENJIN.git
cd TENJIN
```

#### 2. インフラ起動（Docker Compose）

```bash
# Neo4j, ChromaDB, Redisを起動
docker-compose up -d

# 起動確認
docker-compose ps
```

**起動されるサービス**:

| サービス | ポート | 用途 |
|---------|--------|------|
| Neo4j | 7474 (HTTP), 7687 (Bolt) | グラフデータベース |
| ChromaDB | 8000 | ベクトルデータベース |
| Redis | 6379 | キャッシュ |

#### 3. Ollamaのセットアップ

```bash
# Ollamaインストール（macOS/Linux）
curl -fsSL https://ollama.com/install.sh | sh

# 必要なモデルをダウンロード
ollama pull nomic-embed-text    # Embedding用
ollama pull qwen2.5:14b         # LLM用（または他のモデル）
```

#### 4. TENJINインストール

```bash
# uvx（推奨）
pip install uv
uvx --from tenjin tenjin-server

# または pip
pip install tenjin
tenjin-server
```

#### 5. MCP設定の調整

`.vscode/mcp.json`を環境に合わせて編集：

```json
{
    "mcp": {
        "servers": {
            "tenjin": {
                "command": "uvx",
                "args": ["--from", "tenjin", "tenjin-server"],
                "env": {
                    "NEO4J_URI": "bolt://localhost:7687",
                    "NEO4J_USER": "neo4j",
                    "NEO4J_PASSWORD": "your-password",
                    "CHROMA_PERSIST_DIR": "./data/chromadb",
                    "EMBEDDING_PROVIDER": "ollama",
                    "EMBEDDING_MODEL": "nomic-embed-text",
                    "LLM_PROVIDER": "ollama",
                    "LLM_MODEL": "qwen2.5:14b",
                    "OLLAMA_HOST": "http://localhost:11434"
                }
            }
        }
    }
}
```

#### 6. 教育理論データのインポート

```bash
cd TENJIN

# 理論データをNeo4jにインポート
python -m tenjin.scripts.import_theories

# ベクトルインデックスを作成
python -m tenjin.scripts.create_embeddings
```

---

## 設定のカスタマイズ

### 環境変数一覧

| 変数名 | デフォルト | 説明 |
|--------|-----------|------|
| `NEO4J_URI` | `bolt://localhost:7687` | Neo4j接続URI |
| `NEO4J_USER` | `neo4j` | Neo4jユーザー名 |
| `NEO4J_PASSWORD` | `password` | Neo4jパスワード |
| `CHROMA_PERSIST_DIR` | `./data/chromadb` | ChromaDB永続化ディレクトリ |
| `EMBEDDING_PROVIDER` | `ollama` | Embeddingプロバイダー |
| `EMBEDDING_MODEL` | `nomic-embed-text` | Embeddingモデル |
| `LLM_PROVIDER` | `ollama` | LLMプロバイダー |
| `LLM_MODEL` | `qwen2.5:14b` | LLMモデル |
| `OLLAMA_HOST` | `http://localhost:11434` | OllamaサーバーURL |
| `REDIS_URL` | `redis://localhost:6379` | Redisキャッシュ URL |

### 代替LLMプロバイダー

TENJINは[esperanto](https://github.com/lfnovo/esperanto)を使用しており、15以上のLLMプロバイダーに対応しています：

```json
{
    "env": {
        "LLM_PROVIDER": "openai",
        "LLM_MODEL": "gpt-4o",
        "OPENAI_API_KEY": "sk-..."
    }
}
```

対応プロバイダー：
- `ollama` - ローカルLLM（推奨）
- `openai` - OpenAI API
- `anthropic` - Claude API
- `google` - Gemini API
- `azure` - Azure OpenAI
- その他

### リモートサーバーへの接続

Ollama がリモートサーバーで動作している場合：

```json
{
    "env": {
        "OLLAMA_HOST": "http://192.168.1.100:11434"
    }
}
```

---

## トラブルシューティング

### よくある問題

#### 1. `npx shiden init` でエラー

```
❌ テンプレートディレクトリが見つかりません
```

**解決策**:
```bash
# パッケージを再インストール
npm install -g shiden

# または npx キャッシュをクリア
npx clear-npx-cache
npx shiden init
```

#### 2. TENJIN接続エラー

```
TENJIN MCP Server への接続に失敗しました
```

**確認事項**:
1. Docker サービスが起動しているか確認
   ```bash
   docker-compose ps
   ```
2. Neo4j が正常に動作しているか確認
   ```bash
   curl http://localhost:7474
   ```
3. `.vscode/mcp.json` の設定が正しいか確認

#### 3. Embeddingエラー

```
Embedding model not found
```

**解決策**:
```bash
# Ollamaでモデルをダウンロード
ollama pull nomic-embed-text

# モデル一覧を確認
ollama list
```

#### 4. LLMレスポンスが遅い

**推奨モデルサイズ**:
| メモリ | 推奨モデル |
|--------|-----------|
| 8GB | `qwen2.5:7b`, `llama3.2:3b` |
| 16GB | `qwen2.5:14b`, `llama3.1:8b` |
| 32GB+ | `qwen2.5:32b`, `llama3.1:70b` |

#### 5. VS Code でMCPが認識されない

1. VS Code を再起動
2. `Ctrl+Shift+P` → `Developer: Reload Window`
3. GitHub Copilot拡張機能を再インストール

### ログの確認

```bash
# TENJINサーバーログ
tail -f ~/.tenjin/logs/server.log

# Docker コンテナログ
docker-compose logs -f neo4j
docker-compose logs -f chromadb
```

---

## 次のステップ

- [README.md](../README.md) - 基本的な使い方
- [AGENTS.md](../templates/AGENTS.md) - Agent Skillsの詳細
- [theory-lookup.md](../templates/.github/skills/theory-lookup.md) - TENJIN APIリファレンス

---

## サポート

問題が解決しない場合は、[GitHub Issues](https://github.com/nahisaho/SHIDEN/issues) で報告してください。
