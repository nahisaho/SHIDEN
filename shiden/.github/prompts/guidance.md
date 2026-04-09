---
name: guidance
description: >
  Create student guidance plans, classroom behavior responses, parent-contact
  drafts, and crisis-aware support actions. Use when the user asks about life guidance,
  student behavior support, parent communication, counseling flow, or crisis response.
metadata:
  author: nahisaho
  version: "0.5.1"
---

# Guidance

生活指導、保護者連携、危機対応を含む支援計画を作成する。

## Use This Prompt When

- いじめ、問題行動、学級経営、進路相談、保護者対応を扱うとき。
- 対象生徒、周囲の生徒、保護者、学校体制まで含めて整理したいとき。
- 緊急度に応じた初期対応と継続支援の流れが必要なとき。

## Required Inputs

- 学年と状況概要。
- 関係者、経緯、現時点の安全性。
- 必要なら家庭・学校・外部機関連携の条件。

## Workflow

1. 条件不足があればmeta-promptを使って補完する。
2. references/common-safety.mdを読み、緊急度を通常・要連携・危機対応に分類する。
3. 発達段階や学校文脈を踏まえて、初期対応、継続支援、フォローアップを設計する。
4. 保護者連絡文や面談方針が必要なら、役割別に分けて作成する。
5. assets/guidance-template.mdを再利用し、専門家連携が必要な場合は必ず明記する。
6. プロセス全体（緊急度判定の理由、対応フェーズの設計根拠、連携先選定理由）を表示する。
7. create_fileツールで `SHIDEN_guidance_{YYYYMMDD}_{topic}.md` にプロセスと成果物を保存する。保存完了をユーザーに報告する。

## Conditional References

- Read references/common-safety.md when the case involves bullying, self-harm, abuse, violence, or other urgent risk.
- Reuse assets/guidance-template.md when drafting the final output.

## Deliverables

- 状況分析と指導目標。
- 初期対応、継続支援、フォローアップ案。
- 保護者・校内・校外連携案。
- 必要時の危機対応警告。
- プロセスログ（緊急度判定理由、対応設計の根拠、連携先選定理由）。

## Quality Gates

- [ ] 緊急度判定が明示されている。
- [ ] 対象生徒だけでなく周囲と組織対応も含んでいる。
- [ ] 危機対応時は専門家または管理職連携が明示されている。
- [ ] 連絡文や声かけが事実と支援方針を分けている。
- [ ] プロセスが表示され、ファイルに保存されている。

## Data Handling & Safety

- 事実確認前の推測を断定表現で書かない。
- 自傷、虐待、いじめ、触法の可能性がある場合は、AIの助言のみで完結させない。
- 保護者連絡文では、センシティブ情報の共有範囲を最小限に保つ。

## Gotchas

- 危機対応を一般的な生活指導の延長として扱うと、初期対応の優先順位を誤りやすい。
- 保護者対応は学校側の見解と未確認事実を分けて書かないと、不要な対立を生みやすい。
- 加害・被害の構図がある案件で、当事者だけを対象にすると学級全体の再発防止が抜ける。

## Validation Loop

1. 指導案を生成する。
2. 確認する。
   - 緊急度判定が適切か。
   - 校内外連携が必要なケースで漏れがないか。
   - 事実と評価が混同されていないか。
3. 不合格なら、対応フェーズと連携先を修正して再生成する。
4. ファイルが保存されていなければ、create_fileで保存する。
5. 安全条件を満たしたら完了とする。