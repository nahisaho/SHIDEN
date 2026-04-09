---
name: feedback
description: >
  Generate actionable feedback comments, reflection prompts, and growth-oriented
  responses for student work. Use when the user asks for feedback, comments,
  reflection support, return notes, or response wording to learners.
metadata:
  author: nahisaho
  version: "0.5.2"
---

# Feedback

成長を促す、具体的で実行可能なフィードバックを作成する。

## Use This Prompt When

- レポート、作文、発表、ポートフォリオへのコメントを求められたとき。
- テスト返却時の声かけや振り返り支援が必要なとき。
- 改善点と次の一歩を、学習者が受け取りやすい形で示したいとき。

## Required Inputs

- 対象課題または学習成果。
- 良い点、改善点、関連目標または評価観点。
- 伝えたいトーンや対象学年。

## Workflow

1. 条件不足があればmeta-promptを使って補完する。
2. references/common-theory-selection.mdを読み、Growth Mindsetと原因帰属の観点で表現方針を決める。
3. assets/feedback-template.mdを再利用し、強み、改善点、次のアクション、振り返り質問をまとめる。
4. 既存ルーブリックや評価観点がある場合は、それに沿って表現を合わせる。
5. 学習者が次に取るべき行動を、1〜3件の具体策へ落とし込む。
6. 成果物（フィードバック）を先に提示する。
7. 次に、プロセス全体（表現方針の決定理由、理論適用箇所、トーン選定の根拠）を表示する。
8. create_fileツールで `SHIDEN_feedback_{YYYYMMDD}_{topic}.md` に成果物とプロセスログを保存する。保存完了をユーザーに報告する。

## Conditional References

- Read references/common-theory-selection.md when choosing tone or theoretical framing.
- Reuse assets/feedback-template.md when drafting the final output.

## Deliverables

- 良い点と改善点を含むフィードバック本文。
- 次の学習行動。
- 振り返りを促す問い。
- プロセスログ（理論選定理由、表現方針、トーン判断の根拠）。

## Quality Gates

- [ ] 結果だけでなく、努力や戦略にも言及している。
- [ ] 改善点が具体的行動へ変換されている。
- [ ] 対象年齢に合った言葉づかいになっている。
- [ ] 否定的断定や人格評価になっていない。
- [ ] プロセスが表示され、ファイルに保存されている。

## Data Handling & Safety

- 実名やセンシティブ属性は不要なら削る。
- 心理的危機を示唆する内容がある場合は、一般フィードバックに矮小化しない。
- 学習成果の評価と人格評価を混同しない。

## Gotchas

- 「すごい」「頑張った」だけでは再現可能性がなく、学習者が次の行動に移れない。
- 改善点を多く出しすぎると実行可能性が落ちるため、優先度の高いものに絞る。
- 低得点時の声かけで能力固定の表現を使うと、成長志向の設計が崩れる。

## Validation Loop

1. フィードバック案を生成する。
2. 確認する。
   - 強み、改善点、次の一歩がそろっているか。
   - 行動可能な提案になっているか。
   - 否定的断定表現がないか。
3. 不合格なら、表現トーンと具体性を修正して再生成する。
4. ファイルが保存されていなければ、create_fileで保存する。
5. 学習者が受け取って行動できる状態になったら完了とする。