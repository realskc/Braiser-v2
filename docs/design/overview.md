# Braiser v0.1 概览

## 项目定位

v0.1 的目标是实现本地 App 和 Chrome 浏览器插件，让用户可以用自然语言描述网页任务，由 LLM 生成 playwright-like 脚本，并在当前真实 Chrome 页面中执行。

```text
自然语言任务
-> LLM 生成 playwright-like 脚本
-> 本地 App 执行脚本
-> Chrome 插件操作真实页面
-> 保存基础任务日志和最终脚本
```

## v0.1 范围

```text
本地 App（Windows） + Chrome 浏览器插件
```

架构图和完整执行流见 [架构与执行流](./architecture-and-flow.md)。

v0.1.0：Electron App + LLM 任务，不接入浏览器。

v0.1.1：加入 Playwright Extension，接入用户浏览器，让 LLM 可以通过编写 playwright 脚本操作浏览器。

## 文档组织

建议按下面顺序阅读：

### 总体设计

- [架构与执行流](./architecture-and-flow.md)：说明 v0.1 的组件关系和一次任务如何从本地 App 落到浏览器页面。
- [技术栈与存储](./tech-stack-and-storage.md)：说明 monorepo、Electron、Chrome MV3、本地通信和文件存储方向。

### 本地 App

- [Braiser Local App 设计](./local-app/local-app.md)：说明本地 App 的顶层模块和职责边界。
- [Task Agent 设计](./local-app/task-agent.md)：说明一次任务如何被编排、生成脚本并交给 Script Runtime 执行。
- [任务日志与脚本留存](./local-app/runtrace.md)：说明 v0.1 需要保存哪些基础日志和脚本产物。

### 浏览器侧

- [Chrome Extension 设计](./browser/chrome-extension.md)：说明插件作为隐式执行层如何连接页面和本地 App。
- [页面快照与浏览器动作协议](./browser/page-snapshot-and-browser-protocol.md)：说明页面快照和浏览器动作命令的设计方向。
- [Playwright-style API 与任务脚本](./browser/playwright-api-and-task-scripts.md)：说明 AI 脚本可使用的浏览器语义能力和脚本约束。

### 后续版本

Agent Loop、Skill、Snapshot 沉淀等后续能力见 [v0.2](./v0.2/overview.md)。

## 开发顺序

v0.1 先打通最小执行闭环：插件通信与页面快照、Script Runtime 基础动作、脚本生成与执行、基础任务日志和最终脚本保存。

## 第一版成功标准

用户能在当前已登录的 Chrome 页面里提出任务；Braiser 能生成并执行脚本，完成页面动作，并保存基础任务日志和最终脚本。


