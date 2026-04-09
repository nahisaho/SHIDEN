# Session Schema Reference

SHIDENのcontext-managerが優先して保持するキー。

```typescript
interface ShidenSessionContext {
  defaults: {
    grade?: string;
    subject?: string;
    topic?: string;
  };
  promptContext: {
    artifactType?: string;
    learningGoal?: string;
    constraints?: string[];
    considerations?: string[];
  };
  latestArtifacts: {
    lessonPlan?: string;
    materials?: string;
    assessment?: string;
    individual?: string;
    feedback?: string;
    guidance?: string;
  };
  processLogs: {
    filePaths?: string[];
    lastSavedAt?: string;
  };
}
```

## Handoff Rule

- 後続promptには、必要なキーだけを抜き出して渡す。
- 最新の明示入力が保存値より優先される。
- 匿名化可能な情報は匿名化して保持する。