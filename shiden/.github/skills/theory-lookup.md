---
name: theory-lookup
description: >
  Retrieve relevant education theories from SHIDEN's bundled SQLite database and
  connect them to the current artifact. Use when a prompt needs theory-backed justification,
  related theory discovery, or evidence-based instructional rationale.
metadata:
  author: nahisaho
  version: "0.5.0"
---

# Theory Lookup

内蔵教育理論データベースから、成果物に必要な理論を検索して根拠づけする。

## Use This Skill When

- 授業計画、教材、評価、個別支援に理論的根拠が必要である。
- 適用候補を複数比較したい。
- 関連理論や補完理論も合わせて確認したい。

## Workflow

1. 現在の成果物タイプと目的から検索キーワードを抽出する。
2. theories searchで候補を絞り、必要ならcategoryやrelatedを使って比較する。
3. 採用理論ごとに、何に使うかを1文で説明できる形へ整理する。
4. 生成物には、理論名だけでなく適用理由と配置箇所を明記する。
5. 候補が弱い場合は、一般理論を無理に当てず「適用候補が限定的」と明示する。

## Conditional References

- Read references/sqlite-cli-reference.md when you need exact theory CLI commands or query patterns.
- Read ../prompts/references/common-theory-selection.md when mapping theories to prompt types.

## Quality Gates

- [ ] 理論名だけでなく、成果物への適用理由がある。
- [ ] 少なくとも1件は直接適用、必要なら補完理論も提示している。
- [ ] 検索語が成果物タイプと一致している。
- [ ] データベース未確認の理論を断定引用していない。

## Data Handling & Safety

- 理論選定は教育支援の根拠付与であり、医療や法的判断の裏づけに流用しない。
- 検索結果が乏しい場合は、未確認情報を補完せず不足を明示する。
- 固有理論を引用するときは、効果を過剰断定しない。

## Gotchas

- 理論検索を省くとSHIDENのエビデンスベース価値が弱まり、一般生成との差がなくなる。
- 理論を多く並べすぎると、どこに効いているのか不明瞭になるので2〜3件に絞るのが基本である。
- 検索語が広すぎると一般論ばかり出るため、成果物タイプと目的語を含めて検索する方が精度が高い。

## Validation Loop

1. 候補理論を選ぶ。
2. 確認する。
   - 検索結果に基づいているか。
   - 成果物内の適用位置が説明できるか。
   - 過剰断定がないか。
3. 不合格なら、検索語か採用理論を見直して再検索する。
4. 適用理由まで説明できたら完了とする。