# Task Agent 设计

Task Agent 是本地 App 里的任务编排单元。v0.1 中它只负责一次任务从输入到脚本执行完成的最小闭环。

## 职责

- 接收本地 GUI 发起的用户任务。
- 组装 Prompt 并调用 LLM 生成脚本。
- 调用 Script Runtime 执行脚本。
- 保存基础任务日志、最终脚本和关键快照。
- 把任务状态、日志摘要、用户输入请求和风险确认回传给本地 GUI。

## 任务流程

```text
created
-> collecting_context
-> generating_script
-> executing_script
-> completed / failed
-> saving_result
```

## 内部小部件

| 小部件 | 作用 |
|---|---|
| Prompt Builder | 组装用户任务、页面快照、可用 API 和运行约束 |
| Script Generator | 调用 LLM 生成本次任务脚本 |
| Task State Store | 维护任务状态，向本地 GUI 推送进度 |

这些小部件先作为 Task Agent 内部实现，不作为 Local App 顶层模块。

## Prompt 输入

v0.1 Prompt 至少包含：用户任务、当前页面快照、URL/title/origin、可用 API、运行约束和输出格式。

## 边界

Task Agent 负责“下一步做什么”；Script Runtime 负责“怎么安全执行脚本”，并产生执行事件；Extension Bridge 负责“怎么和插件通信”；Storage 负责“怎么落盘”。


