# v0.2 Agent Loop 概览

v0.2 在 v0.1 的“生成脚本并执行网页任务”基础上，增加任务后的复盘、长期记忆和下一次任务的上下文复用。

## 目标

```text
完成任务
-> 保存完整 RunTrace 和最终脚本
-> 复盘沉淀 Braiser Skill 和可复用 Snapshot
-> 下一次任务生成脚本时引用历史经验
```

## 文档

- [Agent Loop](./agent-loop.md)
- [Braiser Skill](./braiser-skill.md)
- [Task Session Workspace](./task-session-workspace.md)

## 暂不放进 v0.1 的内容

- 基于历史任务自动沉淀 Skill。
- 从关键页面状态沉淀可复用 Snapshot。
- 失败后基于错误、快照和 RunTrace 自动修复脚本。
- 每个 task session 的专属 workspace。
- Skill / Snapshot 检索、筛选、排序和摘要压缩。
