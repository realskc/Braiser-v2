#import "@preview/touying:0.7.3": *
#import themes.university: *
#import "@preview/numbly:0.1.0": numbly

#let braiser-blue = rgb("#0b4f6c")
#let braiser-green = rgb("#27a36a")
#let braiser-ink = rgb("#1c2430")
#let braiser-red = rgb("#c84b4b")
#let braiser-gold = rgb("#d59b2d")
#let soft-blue = rgb("#eef7fb")
#let soft-green = rgb("#edf8f2")
#let soft-red = rgb("#fff1ef")
#let soft-gold = rgb("#fff8e8")
#let muted = rgb("#657386")

#show: university-theme.with(
  aspect-ratio: "16-9",
  progress-bar: true,
  config-info(
    title: [Braiser],
    short-title: [Braiser Roadshow],
    subtitle: [AI 驱动的网站记忆与操作自动化工具],
    author: [施开成，刘鹏飞],
    date: datetime.today(),
    institution: [北京大学],
    contact: [realskc\@stu.pku.edu.cn],
  ),
  config-colors(
    primary: braiser-blue,
    secondary: braiser-green,
    tertiary: rgb("#6b8fa3"),
    neutral-lightest: rgb("#ffffff"),
    neutral-darkest: braiser-ink,
  ),
)

#set heading(numbering: numbly("{1}.", default: "1.1"))
#set text(lang: "zh", region: "cn")

#let metric(value, label, accent: braiser-blue) = stack(
  dir: ttb,
  spacing: 0.35em,
  align(center)[#text(size: 27pt, weight: "bold", fill: accent)[#value]],
  align(center)[#text(size: 9.5pt, fill: muted)[#label]],
)

#let card(title, body, accent: braiser-blue, fill: soft-blue) = block(
  width: 100%,
  inset: 0.75em,
  radius: 6pt,
  fill: fill,
  stroke: 0.7pt + accent.lighten(45%),
)[
  #text(weight: "bold", fill: accent)[#title]
  #v(0.35em)
  #text(size: 14pt, fill: braiser-ink)[#body]
]

#let step(num, title, body, accent: braiser-blue) = stack(
  dir: ttb,
  spacing: 0.45em,
  align(center)[
    #circle(
      radius: 15pt,
      fill: accent,
      text(size: 12pt, weight: "bold", fill: white)[#num],
    )
  ],
  align(center)[#text(weight: "bold", fill: braiser-ink)[#title]],
  align(center)[#text(size: 8.8pt, fill: muted)[#body]],
)

#let tag(body, accent: braiser-blue, fill: soft-blue) = box(
  inset: (x: 0.7em, y: 0.28em),
  radius: 99pt,
  fill: fill,
  stroke: 0.5pt + accent.lighten(48%),
)[#text(size: 8.6pt, weight: "bold", fill: accent)[#body]]

#let compare-bar(label, width, accent) = grid(
  columns: (3.2em, 1fr),
  gutter: 0.65em,
  align: center,
  text(size: 9pt, fill: braiser-ink)[#label],
  stack(
    dir: ltr,
    rect(width: width, height: 0.7em, radius: 99pt, fill: accent),
    rect(width: 100% - width, height: 0.7em, radius: 99pt, fill: rgb("#edf0f3")),
  ),
)

#let time-column(label, value, bar-height, accent, fill) = stack(
  dir: ttb,
  spacing: 0.45em,
  align(center)[
    #block(width: 100%, height: 6.1em)[
      #v(6.1em - bar-height)
      #align(center)[#rect(width: 2.2em, height: bar-height, radius: 5pt, fill: accent)]
    ]
  ],
  align(center)[#text(size: 18pt, weight: "bold", fill: accent)[#value]],
  align(center)[#text(size: 11pt, weight: "bold", fill: braiser-ink)[#label]],
)

#title-slide(
  logo: text(size: 34pt, weight: "bold", fill: braiser-blue)[],
  authors: ([施开成], [刘鹏飞]),
)

= 痛点

== 为什么现在需要它

#v(0.5em)
#grid(
  columns: (1.1fr, 1fr),
  gutter: 1.4em,
  [
    #text(size: 20pt, weight: "bold", fill: braiser-ink)[大量数字工作仍困在浏览器里]
    #grid(
      columns: (1fr, 1fr),
      gutter: 0.75em,
      card([运营], [导出订单、更新内容], accent: braiser-green, fill: soft-green),
      card([财务], [下载发票、核对账单], accent: braiser-gold, fill: soft-gold),
      card([客服], [查订单、筛工单], accent: braiser-blue, fill: soft-blue),
      card([个人], [下载资料、重复填表], accent: braiser-red, fill: soft-red),
    )
  ],
  [
    #block(inset: 1em, radius: 6pt, fill: rgb("#f7f9fb"))[
      #text(size: 20pt, weight: "bold")[共同特点]
      
      - 流程固定
      - 频率高
      - 系统分散
      - 不值得专门写脚本
      - 但长期累积非常耗时
    ]
  ],
)

== 当下 Agent 为什么不行

#grid(
  columns: (1fr, 1fr),
  gutter: 0.85em,
  card(
    [脚本受限],
    [代码脚本访问网页时没有用户登录态，登录、鉴权和反爬策略都会让流程失效。],
    accent: braiser-red,
    fill: soft-red,
  ),
  card(
    [操作精度差],
    [通用 Agent 常靠截图和图像识别点击，容易被小按钮、弹窗和布局变化打断。],
    accent: braiser-gold,
    fill: soft-gold,
  ),
  card(
    [学习能力弱],
    [每次面对同一网站都要重新观察和理解，无法沉淀网站结构与成功路径。],
    accent: braiser-blue,
    fill: soft-blue,
  ),
  card(
    [时间效率低],
    [每一步都要“看页面 -> 分析 -> 调工具”，复杂任务会迅速消耗时间和 token。],
    accent: braiser-green,
    fill: soft-green,
  ),
)

== 问题痛点

#block(inset: 0.75em, radius: 6pt, fill: rgb("#f7f9fb"), breakable: false)[
  #text(size: 17pt, weight: "bold", fill: braiser-ink)[同一个网页任务的耗时对比]
  #h(1em)
  #text(size: 11pt, fill: muted)[耗时越高，越难支撑高频任务]

  #v(0.65em)
  #line(length: 100%, stroke: 0.9pt + rgb("#d8dee6"))
  #v(0.35em)

  #grid(
    columns: (1fr, 1fr, 1fr),
    gutter: 1.1em,
    [
      #align(center)[
        #block(height: 5.9em)[
          #v(4.45em)
          #rect(width: 3em, height: 1.45em, radius: 5pt, fill: braiser-gold)
        ]
      ]
      #align(center)[#text(size: 23pt, weight: "bold", fill: braiser-gold)[30s]]
      #align(center)[#text(size: 13pt, weight: "bold", fill: braiser-ink)[人类操作]]
    ],
    [
      #align(center)[
        #block(height: 5.9em)[
          #v(0.25em)
          #rect(width: 3em, height: 5.65em, radius: 5pt, fill: braiser-red)
        ]
      ]
      #align(center)[#text(size: 23pt, weight: "bold", fill: braiser-red)[5min]]
      #align(center)[#text(size: 13pt, weight: "bold", fill: braiser-ink)[通用 Agent]]
    ],
    [
      #align(center)[
        #block(height: 5.9em)[
          #v(4.8em)
          #rect(width: 3em, height: 1.1em, radius: 5pt, fill: braiser-green)
        ]
      ]
      #align(center)[#text(size: 23pt, weight: "bold", fill: braiser-green)[15-20s]]
      #align(center)[#text(size: 13pt, weight: "bold", fill: braiser-ink)[Braiser]]
    ],
  )
]

= 解决方案

== 核心思路

#focus-slide[
  #set align(center + horizon)
  #text(size: 22pt, weight: "bold")[
    把一次性的 Agent 对话
  ]
  #v(0.3em)
  #text(size: 30pt, weight: "bold")[
    升级为可学习、可校验、可复用的自动化系统
  ]
]

== 三层架构

#grid(
  columns: (1fr, 1fr, 1fr),
  gutter: 1em,
  [
    #step([1], [环境层], [接入真实浏览器], accent: braiser-blue)
    #v(0.75em)
    #card([解决：能不能进网页], [复用用户登录态、权限上下文和真实页面状态。], accent: braiser-blue, fill: soft-blue)
  ],
  [
    #step([2], [记忆层], [把网站变成知识], accent: braiser-green)
    #v(0.75em)
    #card([解决：是否每次重来], [沉淀页面结构、任务经验和可复用路径。], accent: braiser-green, fill: soft-green)
  ],
  [
    #step([3], [执行层], [规划交给 Agent], accent: braiser-gold)
    #v(0.75em)
    #card([解决：如何稳定完成], [脚本高速执行动作，快照校验结果，异常再让 LLM 接管。], accent: braiser-gold, fill: soft-gold)
  ],
)

== 工作闭环

#grid(
  columns: (1fr, 1fr, 1fr),
  gutter: 0.7em,
  card([1. 接入真实浏览器], [复用用户登录状态和真实页面上下文。], accent: braiser-blue, fill: soft-blue),
  card([2. 读取网页结构], [提取 DOM、可交互元素和页面文本。], accent: braiser-blue, fill: soft-blue),
  card([3. Agent 规划任务], [根据自然语言目标、网站记忆和历史经验生成方案。], accent: braiser-green, fill: soft-green),
  card([4. 脚本执行操作], [Playwright 快速完成点击、输入、跳转、下载等动作。], accent: braiser-green, fill: soft-green),
  card([5. 快照校验状态], [对比页面结构快照；若状态不符，就交回 Agent 重新分析修复。], accent: braiser-gold, fill: soft-gold),
  card([6. 沉淀记忆脚本], [保存页面结构、操作路径和自动化脚本，后续直接复用。], accent: braiser-gold, fill: soft-gold),
)

#v(0.65em)
#align(center)[
  #text(size: 12.8pt, weight: "bold", fill: braiser-ink)[观察网页 → 理解任务 → 生成脚本 → 执行操作 → 校验结果 → 沉淀记忆]
]

== Demo 视频

= 产品

== 核心功能

#grid(
  columns: (1fr, 1fr, 1fr),
  gutter: 0.75em,
  card([自然语言创建任务], [“进入 GitHub 项目页，下载最新 release 文件。”], accent: braiser-blue, fill: soft-blue),
  card([网站自动探索], [Agent 自由探索网站用法，保存页面快照、整理页面用法、编写脚本函数。], accent: braiser-green, fill: soft-green),
  card([网站任务记忆库], [保存历史任务、常用页面、成功路径。], accent: braiser-gold, fill: soft-gold),
  card([脚本复用], [高频任务无需每次重新推理。], accent: braiser-green, fill: soft-green),
  card([云端模板], [常见网站知识库与自动化脚本模板。], accent: braiser-blue, fill: soft-blue),
  card([风险确认], [支付、删除、敏感提交前暂停确认。], accent: braiser-red, fill: soft-red),
)

== 产品定位

#grid(
  columns: (1fr, 1fr),
  gutter: 1.1em,
  [
    #v(0.2em)
    #text(size: 24pt, weight: "bold")[目标用户]
    #card([个人效率用户], [频繁重复网页操作，希望省时间，但不想写脚本。], accent: braiser-blue, fill: soft-blue)
    #v(0.2em)
    #card([小型商业团队], [电商、SaaS、客服、财务、运营团队有大量后台操作。], accent: braiser-green, fill: soft-green)
  ],
  [
    #v(0.2em)
    #text(size: 24pt, weight: "bold")[市场机会]
    #set text(size: 20pt)
    #block(inset: 0.9em, radius: 6pt, fill: rgb("#f7f9fb"))[
      - 通用浏览器 Agent 偏一次性
      - 企业 RPA 太重
      - 浏览器自动化工具面向开发者
      - 普通用户缺少“会记住网页流程”的助手
    ]
  ],
)

== 竞品对比

#grid(
  columns: (1fr, 1fr),
  gutter: 0.75em,
  card(
    [通用浏览器 Agent],
    [代表：Operator / ChatGPT Agent#v(0.25em)局限：偏一次性执行#v(0.25em)#text(fill: braiser-ink)[#strong[Braiser：网站记忆 + 脚本沉淀]]],
    accent: braiser-blue,
    fill: soft-blue,
  ),
  card(
    [企业 RPA],
    [代表：UiPath / Power Automate / 影刀#v(0.25em)局限：配置重、门槛高#v(0.25em)#text(fill: braiser-ink)[#strong[Braiser：自然语言 + 真实浏览器接入]]],
    accent: braiser-green,
    fill: soft-green,
  ),
  card(
    [桌面操作 Agent],
    [代表：Computer Use / Copilot#v(0.25em)局限：场景过泛，精度不高#v(0.25em)#text(fill: braiser-ink)[#strong[Braiser：专注网页，做深登录态、DOM、复用]]],
    accent: braiser-gold,
    fill: soft-gold,
  ),
  card(
    [浏览器自动化工具],
    [代表：Playwright / MCP#v(0.25em)局限：面向技术用户#v(0.25em)#text(fill: braiser-ink)[#strong[Braiser：包装成普通用户可用的产品体验]]],
    accent: braiser-red,
    fill: soft-red,
  ),
)

== 商业模式与定价

#matrix-slide(columns: (1fr, 1fr, 1fr))[
  *Free*

  #text(size: 22pt, weight: "bold", fill: braiser-blue)[免费]

  体验与传播

  #text(size: 14pt)[任务与脚本数量限额、基础安全确认、下载云端模板。]
][
  *Pro*

  #text(size: 22pt, weight: "bold", fill: braiser-green)[49 元/月]

  个人高频用户

  #text(size: 14pt)[高额度任务与脚本生成、脚本不限、LLM 接管与自动修复。]
][
  *Team*

  #text(size: 22pt, weight: "bold", fill: braiser-gold)[299 元/月]

  小型商业团队

  #text(size: 14pt)[团队共享脚本、成员权限、任务历史共享、团队级安全确认。]
]

= 技术

== 技术亮点

#grid(
  columns: (1fr, 1fr),
  gutter: 0.85em,
  card([网页结构清洗], [提取 DOM、表单、按钮、链接和主文本，而不是直接把整页源码丢给 LLM。], accent: braiser-blue, fill: soft-blue),
  card([结构快照校验], [记录关键元素、状态和区域，执行后对比是否进入预期页面。], accent: braiser-green, fill: soft-green),
  card([Playwright 高速执行], [LLM 负责规划和异常处理，具体网页动作交给脚本批量执行。], accent: braiser-gold, fill: soft-gold),
  card([操作函数抽象], [把稳定操作沉淀为可调用函数，如批量下载、表单填写、数据导出。], accent: braiser-red, fill: soft-red),
)

#focus-slide[
  #set align(center + horizon)
  
  #text(size: 32pt, weight: "bold")[
    不做“什么都能操作一点”
  ]
  #v(0.45em)
  #text(size: 32pt, weight: "bold")[
    只把网页任务做到稳定、可复用，让用户离不开
  ]
]

= 收尾

== 主创团队

#grid(
  columns: (1fr, 1fr),
  gutter: 1.2em,
  card([施开成], [NOI2023 金牌，现 CS 图灵班大二。], accent: braiser-blue, fill: soft-blue),
  card([刘鹏飞], [NOI2023 银牌，现 CS 拔尖班大二。], accent: braiser-green, fill: soft-green),
)

#v(1em)
#block(inset: 0.9em, radius: 6pt, fill: rgb("#f7f9fb"))[
  #text(weight: "bold")[当前进展]
  #v(0.45em)
  已完成支持单步操作浏览器的早期版本；MVP 正在补齐从“单步操作”到“完整任务闭环”的能力。
]

== 下一步计划

#grid(
  columns: (1fr, 1fr, 1fr, 1fr),
  gutter: 0.7em,
  card([真实网站测试], [覆盖复杂页面、弹窗、异步加载、登录态。], accent: braiser-blue, fill: soft-blue),
  card([业务后台验证], [电商、SaaS、数据导出、运营自动化。], accent: braiser-green, fill: soft-green),
  card([高频 Demo], [打磨 1-2 个“手动 vs 自动”对比场景。], accent: braiser-gold, fill: soft-gold),
  card([云端模板], [沉淀常见网站脚本，降低首次使用成本。], accent: braiser-red, fill: soft-red),
)

== 资源需求

#matrix-slide(
  config: config-page(
    margin: (top: 1.7em, bottom: 0em, left: 0em, right: 0em),
    header: align(left)[
      #pad(left: 0.5em, bottom: 0.4em)[
        #text(size: 30pt, weight: "bold", fill: braiser-blue)[#utils.display-current-heading(level: 2, style: auto)]
      ]
    ],
  ),
  columns: (1fr, 1fr, 1fr),
)[
  *开发资源*

  产品开发、模型调用、测试网站与后台环境。

  #v(0.4em)
  #text(size: 9pt)[用于完成 MVP、验证任务闭环和异常修复能力。]
][
  *真实试点*

  电商、SaaS、数据导出、运营自动化等业务场景。

  #v(0.4em)
  #text(size: 9pt)[验证是否能显著减少重复操作时间，并稳定复用网页流程。]
][
  *种子用户*

  早期产品反馈、真实失败案例和持续使用场景。

  #v(0.4em)
  #text(size: 9pt)[验证非技术用户能否直接上手，以及是否能进入小团队协作。]
]

== Q&A

#focus-slide(background-color: braiser-ink)[
  #set align(center + horizon)
  #text(size: 52pt, weight: "bold")[谢谢]

  #v(0.8em)
  #text(size: 24pt)[Braiser：为 AI 构建高效可靠的浏览器操作层]

  #v(0.6em)
  #text(size: 15pt)[Contact:  realskc\@stu.pku.edu.cn]
]
