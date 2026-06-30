# 本地应用实现说明

`docs/implement` 记录实际编码中的接口、边界和坑点。这里的文档按主题演进，不按版本号切分；后续版本如果继续改本地应用，就直接更新本文。

## 包结构

当前使用 npm workspaces：

```text
apps/local-app
packages/llm
packages/storage
```

职责：

- `apps/local-app`：Electron main/preload/renderer 和 Task Agent。
- `packages/llm`：DeepSeek API 的薄封装。
- `packages/storage`：文件系统存储抽象。

## Electron 进程边界

Electron main process 位于 `apps/local-app/src/main/main.ts`。

main process 负责：

- 配置 Electron 运行时。
- 创建 `BrowserWindow`。
- 注册 IPC handler。
- 初始化 `FileStorage` 和 `TaskAgent`。

preload 位于 `apps/local-app/src/preload/preload.ts`，只暴露：

```ts
window.braiser.getSettings()
window.braiser.saveSettings(input)
window.braiser.askQuestion(question)
```

renderer 不直接访问文件系统，也不会拿到明文 settings。它只接收是否已有 API key、key 来源等公开状态。

## Electron 启动坑点

开发过程中保留了几个 Windows/Electron 相关处理：

- 有些 shell 可能带着 `ELECTRON_RUN_AS_NODE=1`，会让 Electron 按 Node 行为启动。`dev:electron` 在启动前会清掉它。
- Codex 或其他非交互命令环境里，Chromium GPU 进程可能不可用。应用使用：
  - `app.disableHardwareAcceleration()`
  - `disable-gpu`
  - `disable-gpu-compositing`
  - `disable-gpu-sandbox`
  - `in-process-gpu`
- Electron `userData` 和 `sessionData` 指向仓库内的 `.braiser-electron-user-data/`。这样可以避开默认用户目录里的缓存权限问题，以及其他 profile 残留的 DPAPI 状态。
- `.braiser-electron-user-data/main.log` 记录启动节点，用来判断应用是否到达 `app ready`、是否创建窗口、是否加载 renderer、是否触发 `ready-to-show`。

这些运行时目录和日志必须继续被 git 忽略。

## Task Agent 状态机

`TaskAgent.askSingleQuestion()` 是当前本地 QA 核心流程：

```text
created
-> preparing_prompt
-> calling_llm
-> saving_result
-> completed / failed
```

持久化行为：

- 先创建 run 目录并立即写入 `meta.json`。
- 关键状态写入 `events.jsonl`。
- 成功时写入 `answer.txt` 和 `messages.json`。
- 失败时设置 `meta.status = failed`，并保存脱敏后的错误摘要。

错误摘要会把 `Bearer ...` 脱敏，避免 Authorization header 被写进 run 文件。

## DeepSeek API 调用

`packages/llm/src/index.ts` 提供 `DeepSeekClient`。

默认值：

```ts
baseUrl = "https://api.deepseek.com"
model = "deepseek-v4-flash"
temperature = 0.2
thinking = { type: "disabled" }
timeoutMs = 60000
```

请求体：

```json
{
  "model": "deepseek-v4-flash",
  "messages": [],
  "temperature": 0.2,
  "thinking": { "type": "disabled" },
  "stream": false
}
```

DeepSeek thinking mode 必须用 API 参数控制，不要通过 system prompt 写“不要思考”一类文本。

## Storage 接口

`packages/storage/src/index.ts` 提供 `FileStorage`。

主要方法：

```ts
readSettings()
writeSettings(settings)
createRun(meta)
updateRunMeta(meta)
appendRunEvent(runId, event)
writeMessages(runId, messages)
writeAnswer(runId, answer)
```

当前只使用文件系统。如果以后需要查询、筛选、报表或长期管理，再评估 SQLite。

## 安全边界

- API key 只能存在于环境变量、`settings.json` 和内存里的 DeepSeek client。
- renderer 可以展示是否已有 key 以及 key 来源，但不能展示明文 key。
- run 目录、events、messages 里不能存 key。
- 当前版本不执行模型生成代码，也不接触浏览器页面。
