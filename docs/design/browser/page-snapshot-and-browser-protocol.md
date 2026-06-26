# 页面快照与浏览器动作协议

## 页面快照

页面快照是给 LLM 和任务日志使用的结构化页面表示，不是完整 HTML，也不是单纯截图。其目的是让 LLM 理解当前页面，并核验交互后的页面是否符合预期。

Playwright 原生支持 yaml 类型的快照格式，可以以此为基础开发。

MVP 快照应包含：URL、title、重要文本、重要可交互元素，以及必要的可见性和可操作性信息。
 
## 浏览器动作协议

本地 App 和 Chrome 插件通过命令协议通信。现阶段只需要确定协议方向，不需要提前锁定精确类型。

MVP 命令至少覆盖：

- 采集页面快照。
- 点击、输入、选择、勾选、取消勾选。
- 读取可见性、文本内容、元素数量。
- 等待文本出现或 URL 匹配。

定位方式至少覆盖：

- role + accessible name。
- 文本。
- label。
- placeholder。
- CSS selector。

MVP 先保证常见 button、link、input、textarea、select 能稳定定位。

