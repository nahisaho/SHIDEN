# Meta Prompt Output Template

以下の構造で、収集済み条件を整理する。

```markdown
## 強化リクエスト

### 元の依頼
{original_request}

### 確認済みの理解
{refined_request}

### 収集した条件
- 対象: {grade_or_audience}
- 教科: {subject}
- トピック: {topic}
- 成果物: {artifact_type}
- 目標: {learning_goal}
- 制約: {constraints}
- 配慮事項: {considerations}

### 未確定または推測
- {assumption_1}

### 次に実行する prompt
{next_prompt}
```