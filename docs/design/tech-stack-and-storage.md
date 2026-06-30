# 技术栈与存储

## 技术栈

- 仓库：TypeScript monorepo。
- 包管理：npm workspaces。
- 本地应用：Electron + React + Vite + TypeScript。
- Chrome Extension：Chrome MV3 + TypeScript + Background / Service Worker + Content Script。
- 本地通信：v0.1 先使用 localhost WebSocket；打包发布时可以再评估 Chrome Native Messaging。
- 存储：v0.1 先使用文件系统，不引入数据库。

建议包结构：

```text
apps/local-app
apps/extension
packages/runtime
packages/protocol
packages/snapshot
packages/storage
packages/llm
```

v0.1.0 已实现：

```text
apps/local-app
packages/storage
packages/llm
```

## LLM 集成

LLM 代码先支持 DeepSeek。v0.1.0 使用 DeepSeek 的 OpenAI-compatible Chat Completions API。base URL 是 `https://api.deepseek.com`。Bearer token 来自 `DEEPSEEK_API_KEY`，或本地 `settings.json` 里的 `deepSeekApiKey` 字段。

v0.1.0 默认模型是 `deepseek-v4-flash`。DeepSeek thinking mode 通过请求参数关闭：

```json
{
  "thinking": { "type": "disabled" }
}
```

v0.1.0 只支持单轮普通 QA。v0.1.1 会复用 LLM 层生成 playwright-like script。

## 文件存储

v0.1 使用文件夹保存任务产物，方便检查、调试和打包。

建议结构：

```text
braiser-data/
  settings.json
  runs/
    <run-id>/
      meta.json
      events.jsonl
      messages.json
      answer.txt
      final-script.ts
      snapshots/
        initial.json
        after-action.json
```

文件含义：

- `settings.json`：本地配置，包括 DeepSeek API key、base URL 和 model。
- `meta.json`：任务目标、状态、时间戳和其他 run 级元数据。
- `events.jsonl`：基础任务事件，逐行追加。
- `messages.json`：v0.1.0 单轮请求消息和回答。
- `answer.txt`：v0.1.0 回答文本。
- `final-script.ts`：v0.1.1 最终生成的脚本。
- `snapshots/`：关键页面 snapshot。

保持 `Storage` 抽象，但底层暂时只用文件系统。如果之后需要查询、筛选、报表或长期管理，再评估 SQLite 或其他嵌入式数据库。
