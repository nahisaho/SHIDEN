---
name: materials
description: >
  Generate instructional materials such as worksheets, slides, quizzes, and
  handouts aligned to goals and curriculum. Use when the user asks for a worksheet,
  slide deck, quiz sheet, handout, or lesson material package.
metadata:
  author: nahisaho
  version: "0.5.0"
---

# Materials

学習目標に対応した教材を、形式別テンプレートで生成する。

## Use This Prompt When

- ワークシート、スライド、小テスト、配布資料を求められたとき。
- 授業計画に合わせた教材一式を作りたいとき。
- 難易度や配慮事項を反映した教材差分が必要なとき。

## Required Inputs

- 学年、教科、単元。
- 教材形式。
- 学習目標または教材の用途。

## Workflow

1. 条件不足があればmeta-promptを使って補完する。
2. 小中高が対象ならreferences/common-curriculum.mdを読み、学習指導要領との対応を確認する。
3. references/common-theory-selection.mdを読み、注意喚起・練習・振り返りの設計原則を選定する。
4. 要求形式に応じてassets/materials-template.mdを再利用し、教材構造を決める。
5. 必要に応じて授業計画の目標や時間配分と整合させる。
6. プロセス全体（指導要領参照結果、理論選定理由、形式選定理由）を表示し、成果物とともにファイルへ保存する。

## Conditional References

- Read references/common-curriculum.md when the target is Japanese K-12 education.
- Read references/common-theory-selection.md when material design needs theory justification.
- Reuse assets/materials-template.md when drafting the final output.

## Deliverables

- 教材本体。
- 学習目標または用途との対応。
- 学習指導要領との関連。
- 教育理論の適用メモ。
- プロセスログ（指導要領参照結果、理論比較、形式決定の根拠）。

## Quality Gates

- [ ] 教材形式が依頼内容と一致している。
- [ ] 導入、学習活動、確認、振り返りの流れがある。
- [ ] 学習指導要領参照が必要な対象で対応箇所が明記されている。
- [ ] 印刷または提示時にそのまま使える粒度になっている。
- [ ] プロセスが表示され、ファイルに保存されている。

## Data Handling & Safety

- 個別支援用教材でも、不要な個人情報は出さない。
- 画像指示や外部資料指示は著作権不明な固有素材に依存しない。
- 危険な実験や活動を含む場合は安全上の注意を入れる。

## Gotchas

- 教材形式が未確定のまま生成すると、出力が冗長になり再利用性が落ちる。
- スライド教材は説明文だけでなく、各枚の役割を分けないと実運用しづらい。
- ワークシートは問題だけで終わらせず、振り返り欄か教師用解答方針を最低1つ入れる。

## Validation Loop

1. 教材案を生成する。
2. 確認する。
   - 形式別要件を満たしているか。
   - 学習目標と問題・活動が一致しているか。
   - 学習指導要領参照が必要なケースで漏れがないか。
3. 不合格なら、形式・難易度・構成を修正して再生成する。
4. 実用可能な体裁になったら完了とする。