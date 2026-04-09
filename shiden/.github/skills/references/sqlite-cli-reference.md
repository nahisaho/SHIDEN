# SQLite CLI Reference

SHIDENの理論検索で優先するCLIパターン。

## 基本コマンド

```bash
npx shiden theories categories
npx shiden theories search "{keyword}"
npx shiden theories get {theory_id}
npx shiden theories related {theory_id} -d 2
```

## 検索語の作り方

- 成果物タイプ + 目的語で検索する。
- 例: `学習目標`, `動機づけ`, `形成的評価`, `足場かけ`

## 出力へ残す最小情報

- 理論名
- どの判断に使ったか
- 必要なら関連理論との関係