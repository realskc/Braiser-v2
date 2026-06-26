# Task Session Workspace

v0.2 为每个 task session 分配专属文件夹，供 Agent 和脚本保存临时文件、中间结果、下载文件、调试输出和复盘材料。

## 原则

- workspace 路径由 Task Agent 创建，并写入 RunTrace。
- Script Runtime 只向脚本暴露当前 session 的受控文件访问能力。
- 文件默认不跨 session 共享。
- 需要长期复用的内容应沉淀为 Skill、Snapshot 或正式 Storage 记录。
- 任务结束后可设计自动清理、归档或用户手动删除策略。

## 可能内容

- 临时输入输出。
- 下载文件。
- 生成脚本副本。
- 关键快照。
- 错误上下文。
- Skill / Snapshot 复盘草稿。
