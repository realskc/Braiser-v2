# Braiser v0.1 总览

## 产品方向

v0.1 逐步搭出本地应用和 Chrome Extension，让用户可以用自然语言描述网页任务。v0.1 的长期目标流程是：

```text
自然语言任务
-> LLM 生成 playwright-like script
-> 本地应用执行脚本
-> Chrome Extension 操作真实页面
-> 本地应用保存基础任务日志和最终脚本
```

## 里程碑

- [v0.1.0：本地应用 + 普通 LLM QA](../v0.1/v0.1.0.md)
- v0.1.1：脚本生成和浏览器执行

v0.1.0 先实现最小本地 QA 闭环，不连接浏览器，也不生成脚本。v0.1.1 再加入 Chrome Extension、页面 snapshot、script 生成和浏览器动作执行。

## 文档索引

### 版本文档

- [v0.1.0](../v0.1/v0.1.0.md)：已实现的本地 QA 闭环、运行方式、配置、存储和验收标准。

### 实现说明

- [本地应用实现说明](../implement/local-app.md)：包结构、IPC/API 边界、Electron 启动坑、DeepSeek thinking mode、存储和安全边界。

### 设计文档

- [架构与流程](./architecture-and-flow.md)：组件关系和目标 v0.1 任务流程。
- [技术栈与存储](./tech-stack-and-storage.md)：monorepo、Electron、Chrome MV3、本地通信和文件存储方向。

### 本地应用

- [Braiser 本地应用设计](./local-app/local-app.md)：本地应用顶层模块和职责边界。
- [Task Agent 设计](./local-app/task-agent.md)：任务编排和未来脚本生成路径。
- [Run Trace 与脚本留存](./local-app/runtrace.md)：v0.1 基础日志和脚本产物。

### 浏览器侧

- [Chrome Extension 设计](./browser/chrome-extension.md)：extension 作为隐式浏览器执行层。
- [页面 Snapshot 与浏览器协议](./browser/page-snapshot-and-browser-protocol.md)：页面 snapshot 和浏览器命令。
- [Playwright-style API 与任务脚本](./browser/playwright-api-and-task-scripts.md)：浏览器语义 API 和脚本约束。

### 后续版本

Agent Loop、Skill 和 Snapshot 持久化放在 [v0.2](./v0.2/overview.md) 跟踪。
