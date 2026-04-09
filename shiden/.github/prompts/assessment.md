---
name: assessment
description: >
  Design assessments such as rubrics, tests, and formative checks aligned to
  learning goals and curriculum standards. Use when the user asks for a rubric,
  test, quiz scoring guide, checklist, or assessment criteria.
metadata:
  author: nahisaho
  version: "0.5.1"
---

# Assessment

目標整合性を優先して、評価ツールを作成する。

## Use This Prompt When

- ルーブリック、単元テスト、形成的評価ツールを作るとき。
- 学習目標を評価可能な観点へ分解したいとき。
- 授業計画や教材と整合した採点基準が必要なとき。

## Required Inputs

- 学年、教科、単元。
- 評価タイプ。
- 学習目標または評価したい能力。

## Workflow

1. 条件不足があればmeta-promptを使って補完する。
2. 小中高が対象ならreferences/common-curriculum.mdを読み、観点別評価との対応を確認する。
3. references/common-theory-selection.mdを読み、Constructive AlignmentとBloom's Taxonomyを中心に評価設計する。
4. assets/assessment-template.mdを再利用し、評価タイプ別の出力へ落とし込む。
5. 問題や観点ごとに、どの学習目標へ対応するか明示する。
6. プロセス全体（指導要領参照結果、認知レベル分析、設計判断）を表示する。
7. create_fileツールで `SHIDEN_assessment_{YYYYMMDD}_{topic}.md` にプロセスと成果物を保存する。保存完了をユーザーに報告する。

## Conditional References

- Read references/common-curriculum.md when the target is Japanese K-12 education.
- Read references/common-theory-selection.md when choosing evaluation theories or cognitive levels.
- Reuse assets/assessment-template.md when drafting the final output.

## Deliverables

- 評価ツール本体。
- 配点または観点別基準。
- 学習指導要領との関連。
- 目標との対応表。
- プロセスログ（指導要領参照結果、理論比較、観点設計の根拠）。

## Quality Gates

- [ ] すべての観点または設問が学習目標へ対応づいている。
- [ ] 評価タイプに応じた採点方法または判定基準が明示されている。
- [ ] 小中高では観点別評価との関係が示されている。
- [ ] 難易度配分や配点が依頼条件を満たしている。
- [ ] プロセスが表示され、ファイルに保存されている。

## Data Handling & Safety

- 個人成績や実在生徒の評価履歴は不要なら含めない。
- ラベルづけを助長する表現は避け、行動基準で記述する。
- 高リスク判断を伴う評価は、教師の最終判断が必要だと明示する。

## Gotchas

- 目標不在のまま評価だけ作ると、見た目は整っても測りたい能力がぶれる。
- ルーブリックは形容詞だけで段階差を作ると採点者間のぶれが大きくなる。
- テスト問題は難易度比率だけでなく、認知レベル分布も見ないと単調になりやすい。

## Validation Loop

1. 評価案を生成する。
2. 確認する。
   - 目標と観点の対応が明示されているか。
   - 評価方法が再現可能か。
   - 指導要領参照が必要な対象で漏れがないか。
3. 不合格なら、観点定義・設問構成・配点を修正して再生成する。
4. ファイルが保存されていなければ、create_fileで保存する。
5. 採点者がそのまま使える状態になったら完了とする。