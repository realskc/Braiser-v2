# Braiser Skill 设计

Braiser Skill 是从历史任务中沉淀出来的网站能力知识。它不是脚本模板，不直接执行，只作为 Prompt 上下文帮助 AI 写新脚本。

## 生成流程

```text
任务结束
-> 保存 RunTrace 和最终脚本
-> Task Agent 读取对话、RunTrace、脚本、关键快照
-> 生成或更新 Skill
-> 保存到本地 Skill Library
```

## 内容建议

Skill 可先用 Markdown 保存，便于直接放进 Prompt。建议包含：

- 名称
- 适用网站或页面
- 能力描述
- 关键入口和步骤
- 常用 locator / 元素语义
- 可参考代码片段
- 参数经验、风险提示、已知坑点
- 关联 RunTrace

## 与脚本的关系

当前复用机制是上下文复用：

```text
历史任务经验 -> Skill -> Prompt -> 新脚本
```

每次任务仍由 AI 重新生成完整脚本。

