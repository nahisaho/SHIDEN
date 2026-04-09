---
name: context-manager
description: >
  Preserve structured SHIDEN session context and hand off prior outputs between
  prompts safely. Use when a later prompt must reuse a previous artifact, when
  session defaults matter, or when generated outputs need consistent carry-over.
metadata:
  author: nahisaho
  version: "0.5.2"
---

# Context Manager

セッション内で確定した条件と生成済み成果物を再利用可能な形で保持する。

## Use This Skill When

- 直前の授業計画を基に教材や評価を作る。
- 学年、教科、単元などの既知条件を再入力させたくない。
- 生成済み成果物の観点や目標を次工程へ渡したい。

## Workflow

1. 会話から確定情報と未確定情報を分ける。
2. 学年、教科、単元、目標、配慮事項、成果物IDを構造化して保存する。
3. 後続promptが参照するときは、必要最小限の要素だけ引き渡す。
4. 古い条件と新しい条件が競合したら、最新の明示入力を優先する。
5. セッション要約が必要なら、再利用価値の高い成果物だけを列挙する。
6. 各promptで生成されたプロセスログのファイルパスも保持し、後続参照に使う。

## Conditional References

- Read references/session-schema.md when you need the canonical context keys or handoff shape.

## Quality Gates

- [ ] 確定情報と推測情報を混同していない。
- [ ] 後続promptに不要な情報を渡していない。
- [ ] 最新のユーザー指定が古い保存値に勝っている。
- [ ] 参照対象の成果物種別が識別できる。
- [ ] プロセスログのファイルパスが保持されている。

## Data Handling & Safety

- 保存するのは再利用に必要な条件のみとし、個人情報の持ち越しを最小化する。
- センシティブ案件では、匿名化した要約だけを保持する。
- 古い危機案件の文脈を新しい通常案件へ自動流用しない。

## Gotchas

- 「前の内容を使って」が何を指すか曖昧なまま引き継ぐと、誤った成果物を参照しやすい。
- 目標だけでなく評価観点も保持しないと、assessmentやfeedbackへの接続が弱くなる。
- すべての会話ログを保持するより、再利用キーに正規化した方が後続promptの精度が上がる。

## Validation Loop

1. 保存または再利用するコンテキストをまとめる。
2. 確認する。
   - 最新条件が反映されているか。
   - 渡す情報が後続タスクに十分か。
   - 不要な個人情報が混ざっていないか。
3. 不合格なら、保持キーや参照対象を修正する。
4. 妥当な引き継ぎ形に整えたら完了とする。