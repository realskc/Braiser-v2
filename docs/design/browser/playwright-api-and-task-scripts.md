# Playwright-style API 与任务脚本

Braiser 让 AI 编写接近 Playwright 风格的脚本，但底层由 Script Runtime 和 Chrome 插件实现。

## 最小 API 能力

MVP 阶段只需要覆盖常见网页自动化能力：

- 页面定位：按 role、文本、label、placeholder 或 CSS selector 查找元素。
- 页面状态：读取 URL、title，等待文本或 URL 变化，采集页面快照。
- 元素动作：点击、输入、选择、勾选、取消勾选。
- 元素状态：判断可见性、数量、文本内容，等待元素可用。
- 运行时能力：写日志、请求用户补充输入、请求风险确认、包裹下载动作。

## 脚本入口

AI 生成的脚本应是一个完整 TypeScript 模块，并暴露一个默认异步入口函数。入口函数接收 Braiser 提供的任务上下文，主要包括：

- `page`：Playwright-style 页面对象。
- `input`：任务输入参数。
- `braiser`：日志、用户输入、风险确认、下载等待等运行时能力。
- `expect`：基础断言和状态校验能力。


## 安全边界

AI 生成的脚本默认不可信。它只能在本地 App 的 Script Runtime 中执行，不能直接操作真实 DOM，也不能访问浏览器页面里的 `document` / `window`。

所有浏览器动作都必须通过 `page`、`locator`、`braiser`、`expect` 等受控入口进入 Script Runtime，再转成浏览器动作协议，并写入基础任务日志。下载、提交、删除、支付等高风险动作需要预留统一确认和记录能力。

## 脚本原则

- 每次任务都重新生成完整脚本。
- v0.1 不复用历史脚本或模板；每次任务都生成本次脚本。
- 脚本可以写控制流、条件判断、循环和函数封装。
- 脚本不直接访问 `document`、`window` 或真实 DOM。
- 页面动作只能通过 `page`、`locator`、`braiser`、`expect` 完成。
- 最终脚本必须保存，供审计、调试和演示使用。




