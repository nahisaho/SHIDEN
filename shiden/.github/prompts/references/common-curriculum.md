# Common Curriculum Reference

日本の小学校・中学校・高等学校を対象とする成果物では、学習指導要領の参照を必須とする。

## 参照が必須のケース

- 授業計画、教材、評価設計、個別支援計画で学年と教科が日本の学校制度に属する場合。

## 推奨コマンド

```bash
npx shiden curriculum subject {教科名}
npx shiden curriculum search "{単元名またはキーワード}"
npx shiden curriculum grade "{学年}"
```

## 出力へ入れる最小要件

```markdown
### 学習指導要領との関連

**参照箇所**: {school_level}学習指導要領 {section}
**目標**: 「{goal_quote}」
**内容**: 「{content_quote}」
**本成果物との対応**: {alignment_note}
```

## 判断ルール

- 大学、研修、企業教育は原則として必須参照対象外。
- 対象が曖昧なら、学習指導要領参照の要否を明示して確認する。
- 参照箇所が見つからない場合は、無理に引用を捏造せず「要追加確認」とする。