---
name: orchestrator
description: >
  Route education requests to the correct SHIDEN prompt, detect multi-step flows,
  and sequence supporting skills. Use when the request spans multiple artifact types,
  the target prompt is unclear, or execution order must be coordinated.
metadata:
  author: nahisaho
  version: "0.5.2"
---

# Orchestrator

SHIDENのprompt群と補助skill群を最小手順でつなぐ。

## Use This Skill When

- 依頼が複数成果物にまたがる。
- どのpromptを起動すべきか曖昧である。
- 授業計画から教材、評価、フィードバックへ順番に展開したい。

## Workflow

1. 依頼の主目的を分類する。曖昧ならmeta-promptを優先する。
2. 主要成果物を1つ選び、副次成果物があれば順序を決める。
3. 小中高の成果物ではcurriculum参照を必須ステップとして差し込む。
4. 理論根拠が必要な成果物ではtheory-lookupを併用する。
5. 連続生成時はcontext-managerへ受け渡し対象を明示する。
6. 各prompt実行時のプロセス（参照結果、理論選定、設計判断）が表示・保存されることを確認する。

## Routing Rules

- 授業計画、指導案、本時案 → lesson-plan
- 教材、ワークシート、スライド、クイズ、配布資料 → materials
- ルーブリック、テスト、採点基準、形成的評価 → assessment
- 個別支援、合理的配慮、学習支援計画 → individual
- コメント、振り返り、返却時の声かけ → feedback
- 生活指導、保護者対応、危機対応、進路相談 → guidance

## Conditional References

- Read ../../AGENTS.md when suite-level routing or phase rules need confirmation.
- Read references/session-schema.md when handing off structured context between prompts.

## Quality Gates

- [ ] 主成果物と副成果物の順序が妥当である。
- [ ] 曖昧依頼でmeta-promptを飛ばしていない。
- [ ] 小中高案件でcurriculum参照ステップを落としていない。
- [ ] 危機案件を通常フローに混ぜていない。
- [ ] 各promptのプロセスが表示・保存される構成になっている。

## Data Handling & Safety

- 危機対応はguidanceを優先し、専門家連携を省略しない。
- 同じ情報を複数promptに渡すときも、不要な個人情報は削る。
- 実行順序が不明な場合は、直接生成より分類を優先する。

## Gotchas

- lesson-planを作る前にmaterialsやassessmentを先行させると整合性が崩れやすい。
- 曖昧依頼を即時に個別promptへ送ると、後続で条件不足が顕在化する。
- guidance系の危機案件を通常のfeedbackやindividualに誤配すると安全性が落ちる。

## Validation Loop

1. ルーティング案を決める。
2. 確認する。
  - 主要成果物が1つに定まっているか。
  - 補助skillの必要性が明確か。
  - 安全上の例外がないか。
3. 不合格なら、分類か順序を修正して再判定する。
4. 妥当な順序が決まったら実行へ進む。