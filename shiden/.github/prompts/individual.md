---
name: individual
description: >
  Create individualized support plans and accommodation strategies for a learner's
  needs, strengths, and barriers. Use when the user asks for individual support,
  accommodations, intervention planning, or differentiated instruction.
metadata:
  author: nahisaho
  version: "0.5.2"
---

# Individual Support

学習者の状態に応じた個別指導計画と支援方針を作成する。

## Use This Prompt When

- 学習困難、発達特性、配慮事項に応じた支援計画を求められたとき。
- 通常学級、取り出し指導、長期支援の方針を整理したいとき。
- 強みと課題の両方を踏まえて学習支援を設計したいとき。

## Required Inputs

- 学年、教科、課題状況。
- 学習者の困りごと、強み、利用可能な支援環境。
- 支援期間または実施頻度。

## Workflow

1. 条件不足があればmeta-promptを使って補完する。
2. 小中高が対象ならreferences/common-curriculum.mdを読み、当該学年の到達範囲を確認する。
3. references/common-theory-selection.mdを読み、ZPD、Scaffolding、UDLなどから支援理論を選ぶ。
4. 高リスク事案や心理的危機が疑われる場合はreferences/common-safety.mdを読み、専門家連携を明記する。
5. assets/individual-template.mdを再利用し、目標、支援戦略、進捗確認方法を整理する。
6. 成果物（個別支援計画）を先に提示する。
7. 次に、プロセス全体（到達範囲確認結果、支援理論の選定理由、リスク判定の根拠）を表示する。
8. create_fileツールで `SHIDEN_individual_{YYYYMMDD}_{topic}.md` に成果物とプロセスログを保存する。保存完了をユーザーに報告する。

## Conditional References

- Read references/common-curriculum.md when the learner is in Japanese K-12 education.
- Read references/common-theory-selection.md when choosing support theories.
- Read references/common-safety.md when risk exceeds classroom-only support.
- Reuse assets/individual-template.md when drafting the final output.

## Deliverables

- 現状分析と支援目標。
- 指導戦略と合理的配慮。
- 進捗モニタリング計画。
- 必要時の専門家連携提案。
- プロセスログ（到達範囲確認、理論比較、支援設計の根拠）。

## Quality Gates

- [ ] 課題だけでなく強みも明示している。
- [ ] 支援方法が学習環境と実施頻度に合っている。
- [ ] 小中高では学習指導要領との接続がある。
- [ ] 高リスク時に専門家連携が明記されている。
- [ ] プロセスが表示され、ファイルに保存されている。

## Data Handling & Safety

- 病名や診断名が不要なら、必要な支援行動の記述に置き換える。
- 医療・心理・福祉判断を断定せず、連携先の候補として提示する。
- 生徒の尊厳を損なうラベリング表現を避ける。

## Gotchas

- 困難の説明だけで計画を作ると、支援が欠点補正に偏って強み活用が抜けやすい。
- 学年相当の目標範囲を確認せずに支援案を作ると、過大または過小な設定になりやすい。
- 危機対応が必要なケースを通常の学習支援として処理すると安全上のリスクが高い。

## Validation Loop

1. 支援計画案を生成する。
2. 確認する。
   - 目標が測定可能か。
   - 支援行動が環境内で実施可能か。
   - 高リスクケースで専門家連携が必要か。
3. 不合格なら、目標粒度・支援方法・連携先を修正して再生成する。
4. ファイルが保存されていなければ、create_fileで保存する。
5. 教師が実施に移せる粒度になったら完了とする。