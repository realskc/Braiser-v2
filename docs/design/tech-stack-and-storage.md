# 技术栈与存储

## 技术栈

- 仓库：TypeScript monorepo。
- 本地 App：Electron + React + Vite + TypeScript。
- Chrome 插件：Chrome MV3 + TypeScript + Background / Service Worker + Content Script。
- 本地通信：v0.1 先用 localhost WebSocket；发布版可评估 Chrome Native Messaging。
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

## LLM 集成

LLM 相关代码只需要先形成薄封装，供 Task Agent 调用。v0.1 能力包括：生成任务脚本、清洗模型输出。

## 文件存储

v0.1 用文件夹保存任务产物，便于调试、查看和打包。

建议结构：

```text
braiser-data/
  settings.json
  runs/
    <run-id>/
      meta.json
      events.jsonl
      final-script.ts
      snapshots/
        initial.json
        after-action.json
```

其中：

- `settings.json` 保存本地配置。
- `meta.json` 保存任务目标、URL、状态、创建时间等顶层信息。
- `events.jsonl` 保存基础任务事件，按行追加。
- `final-script.ts` 保存本次最终脚本。
- `snapshots/` 保存关键页面快照。

先保留 `Storage` 抽象，但底层实现用文件系统。后续如果查询、筛选、统计、长期管理需求变强，再评估 SQLite 或其它数据库。
