# Task Agent 设计

Task Agent 是本地 App 里的任务编排单元。v0.1.0 中它只负责一次单轮 LLM 问答；v0.1.1 再扩展到脚本生成和执行。

## 职责

- 接收本地 GUI 发起的用户任务。
- v0.1.0：组装单轮问答 Prompt 并调用 DeepSeek API。
- v0.1.0：保存基础问答日志和单次回答。
- v0.1.1：组装网页任务 Prompt 并调用 LLM 生成脚本。
- v0.1.1：调用 Script Runtime 执行脚本。
- v0.1.1：保存基础任务日志、最终脚本和关键快照。
- 把任务状态、日志摘要、用户输入请求和风险确认回传给本地 GUI。

## 任务流程

v0.1.0：

```text
created
-> preparing_prompt
-> calling_llm
-> saving_result
-> completed / failed
```

v0.1.1：

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
| Prompt Builder | v0.1.0 组装单轮问答 Prompt；v0.1.1 组装网页任务、页面快照、可用 API 和运行约束 |
| LLM Caller | v0.1.0 调用 DeepSeek API 获取单次回答；v0.1.1 调用 LLM 生成本次任务脚本 |
| Task State Store | 维护任务状态，向本地 GUI 推送进度 |

这些小部件先作为 Task Agent 内部实现，不作为 Local App 顶层模块。

## Prompt 输入

v0.1.0 Prompt 只包含用户问题和最小系统约束，不保留多轮对话上下文。v0.1.1 Prompt 再加入当前页面快照、URL/title/origin、可用 API、运行约束和输出格式。

## 边界

Task Agent 负责“下一步做什么”；Script Runtime 负责“怎么安全执行脚本”，并产生执行事件；Extension Bridge 负责“怎么和插件通信”；Storage 负责“怎么落盘”。

