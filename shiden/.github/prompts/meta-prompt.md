---
name: meta-prompt
description: >
  Structure ambiguous education requests into a validated prompt and run a
  one-question-at-a-time intake flow. Use when the user's request is incomplete,
  under-specified, or needs context collection before any education artifact is generated.
metadata:
  author: nahisaho
  version: "0.5.1"
---

# Meta Prompt

曖昧な依頼を、後続スキルに渡せる構造化プロンプトへ変換する。

## Use This Prompt When

- 学年、教科、単元、成果物形式のいずれかが欠けている。
- ユーザーが「いい感じ」「わかりやすく」など主観語だけで依頼している。
- 複数スキルにまたがる依頼を分解する前に、共通コンテキストが必要である。

## Required Inputs

- 元のユーザー依頼。
- すでに会話で判明している条件。

## Workflow

1. 依頼を要約し、補った前提を明示して確認を取る。
2. 不足情報がある場合だけ、質問を1回に1つずつ提示する。
3. 5問以内で、学年・教科・トピック・目標・制約を優先収集する。
4. 情報が十分にそろった時点で質問を打ち切り、構造化メタプロンプトを生成する。
5. 後続スキルへ、確定情報と未確定情報を明示して引き継ぐ。
6. 収集プロセス全体（質問意図、回答の解釈、判断理由）を表示する。
7. create_fileツールで `SHIDEN_meta-prompt_{YYYYMMDD}_{topic}.md` にプロセスと成果物を保存する。保存完了をユーザーに報告する。

## Conditional References

- Reuse assets/meta-prompt-template.md when drafting the final intake summary.
- Read references/common-safety.md when the request mentions self-harm, abuse, bullying, violence, or crisis response.

## Deliverables

- 確認済みの強化リクエスト。
- 1問1答で収集した条件一覧。
- 後続スキルがそのまま使えるメタプロンプト。
- プロセスログ（各質問の意図、回答の解釈、後続スキル選定理由）。

## Quality Gates

- [ ] 確認前に推測を事実扱いしていない。
- [ ] 質問は常に1件のみで、回答待ちを挟んでいる。
- [ ] 収集結果に「確定」「未確定」「推測」を分けている。
- [ ] 後続スキル名または依頼カテゴリが特定できている。
- [ ] プロセスが表示され、ファイルに保存されている。

## Data Handling & Safety

- 生徒名、学校名、病名などの個人特定情報は必要最小限にとどめる。
- 危機対応が含まれる場合は、AI提案が専門判断の代替にならないと明示する。
- センシティブ情報が不要なら、役割名や匿名表現へ置き換える。

## Gotchas

- 1回の返答で複数質問を並べると、SHIDENの対話品質が落ちて後続スキルも不安定になる。
- 「早く作って」と言われた場合は、追加質問を止めて推測箇所を明記したまま生成へ進む。
- 収集を続ける目的は情報量の最大化ではなく、生成に必要な最小十分条件の確保である。

## Validation Loop

1. 強化リクエスト案を提示する。
2. 確認する。
   - 不足条件が残っていないか。
   - 質問が1件ずつになっているか。
   - 危機対応時の注意書きが必要か。
3. 不合格なら、質問順序または推測の扱いを修正して再提示する。
4. ファイルが保存されていなければ、create_fileで保存する。
5. 合格後のみ後続スキルへ引き継ぐ。