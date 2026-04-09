---
name: lesson-plan
description: >
  Generate evidence-based lesson plans with learning goals, lesson flow, and
  curriculum alignment. Use when the user asks for a lesson plan, teaching plan,
  unit lesson flow, or class activity sequence.
metadata:
  author: nahisaho
  version: "0.5.0"
---

# Lesson Plan

教育理論と学習指導要領に基づく授業計画を作成する。

## Use This Prompt When

- 指導案、本時案、授業展開、単元の一部計画を求められたとき。
- 目標、時間配分、評価規準をセットで設計したいとき。
- 教材や評価を作る前に授業の骨格を固めたいとき。

## Required Inputs

- 学年、教科、単元またはトピック。
- 授業時間。
- 本時で達成したい学習目標または到達イメージ。

## Workflow

1. 条件不足があれば、まずmeta-promptを使って補完する。
2. 小中高が対象ならreferences/common-curriculum.mdを読み、学習指導要領を必ず参照する。
3. references/common-theory-selection.mdを読み、目標・活動・評価に合う理論を2件以上選ぶ。
4. assets/lesson-plan-template.mdを再利用し、導入・展開・まとめ・評価を一貫して設計する。
5. 後続で教材や評価を作る可能性があるため、学習目標と観点を明示する。
6. プロセス全体（指導要領検索結果、理論選定理由、設計判断）を表示し、成果物とともにファイルへ保存する。

## Conditional References

- Read references/common-curriculum.md when the target is Japanese elementary, junior high, or high school.
- Read references/common-theory-selection.md when selecting or justifying instructional theories.
- Reuse assets/lesson-plan-template.md when drafting the final answer.

## Deliverables

- 基本情報つき授業計画。
- Bloom's Taxonomyを意識した学習目標。
- 学習指導要領との関連。
- 参照理論と適用理由。
- プロセスログ（指導要領参照結果、理論比較、設計判断の根拠）。

## Quality Gates

- [ ] 目標、活動、評価が相互に整合している。
- [ ] 小中高では学習指導要領の参照箇所が明記されている。
- [ ] 時間配分が授業時間の合計と一致している。
- [ ] 特別な配慮がある場合は活動と評価の両方に反映されている。
- [ ] プロセスが表示され、ファイルに保存されている。

## Data Handling & Safety

- 実在生徒名は使わず、必要なら匿名の学習者像に置き換える。
- 特別支援や配慮事項はラベル化せず、必要な支援行動として記述する。
- 専門職連携が必要なケースは、教師単独対応と断定しない。

## Gotchas

- 学習指導要領の引用なしで小中高の指導案を出すと、SHIDENの差別化要件を満たさない。
- 目標が「理解する」だけで終わると、評価規準が曖昧になりやすいので観察可能な行動に言い換える。
- 教材先行で計画を書くと整合性が崩れるため、必ず授業目標と活動順序を先に固定する。

## Validation Loop

1. 授業計画を生成する。
2. 確認する。
   - 目標と評価規準が一致しているか。
   - 学習指導要領の参照が必要な対象で漏れていないか。
   - 活動が授業時間内に収まっているか。
3. 不合格なら、目標文・時間配分・参照理論を修正して再生成する。
4. 全ゲート通過後のみ完了とする。