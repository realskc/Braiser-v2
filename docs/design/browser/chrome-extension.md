# Chrome Extension 设计

Chrome 插件是浏览器侧执行器，在 v0.1 中隐式工作，不提供任务输入 UI。它不运行 AI 代码，只运行 Braiser 可信代码。用户页面中的网站代码不可信，插件需要把页面观察和动作执行限制在 Braiser 定义的命令协议内。

## 边界

插件负责页面观察、元素定位和浏览器动作执行；任务输入、状态展示、LLM 调用、脚本执行和持久化都属于本地 App。

## 模块

| 模块 | 职责 |
|---|---|
| Background / Service Worker | 连接 Content Script 和本地 App；转发命令；管理 tab 上下文 |
| Content Script / Injected Script | 采集页面快照；解析 Locator；执行点击、输入、选择、滚动等动作；返回结果 |

MVP 先保证普通 DOM 页面稳定。React/Vue、Shadow DOM、iframe 等复杂页面可后续增强。
