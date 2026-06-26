# Braiser Local App 设计

本地 App 是 v0.1 的系统主控，负责任务交互、脚本生成、AI 脚本执行和本地数据保存。Chrome 插件只执行浏览器侧动作。

## 顶层模块

| 模块 | 职责 |
|---|---|
| GUI App | 本地窗口、任务面板、执行日志查看、设置页和用户确认交互 |
| Task Agent | 管理任务生命周期；组装 Prompt；调用 LLM；串联快照采集、脚本执行和基础日志保存 |
| Script Runtime | 在本地受控环境中执行 AI 生成的 TypeScript 模块；注入 `page` / `locator` / `braiser` / `expect`；把浏览器调用转换为动作协议 |
| Extension Bridge | 维护本地 App 与 Chrome 插件的连接，发送 BrowserCommand，接收动作结果和页面快照 |
| Storage | 保存任务记录、基础事件、最终脚本、页面快照和本地配置 |

Task Agent 的内部流程和小部件见 [Task Agent 设计](./task-agent.md)。

## 脚本运行上下文

脚本运行时由 Script Runtime 提供受控任务上下文。上下文至少包含页面操作对象、任务输入、运行时辅助能力和基础断言能力。

脚本不拿原版 Playwright 对象，也不直接访问页面 DOM。浏览器动作统一经过 Script Runtime、Extension Bridge 和 Chrome 插件。

## 输出产物

每次任务至少保存：基础任务日志、最终脚本和关键页面快照。
