# SimpleCode「{Language} 101」教学系统设计（LEARN）

> 状态：设计稿，仅规划，不含实现。日期 2026-10-15，基于 main@ed4082b（已含 Lua 5.4.9、Go/Yaegi）。
> 原始调研与许可证核对：[`plan/learn-research.md`](learn-research.md)。


## 目录
1. 目标与非目标 · 2. UI 草图 · 3. 架构 · 4. 组件设计 · 5. 样式规范（摘要，详见 §13）· 6. 文档目录与 frontmatter · 7. 各语言课程 · 8. 实现要点 · 9. 写作规范 · 10. 参考资料 · 11. 里程碑 · 12. 风险
- **§13 [文档 UI 黑白主题规范](#13-文档-ui-黑白主题规范)** —— 需求（4）：文档 UI 与主界面一致、纯黑白（token、配色表、排版、Shiki 单色主题、组件、状态、ASCII）
- **§14 [代码块运行按钮设计](#14-代码块运行按钮设计)** —— 需求（5）：每个代码块的「复制 / 运行」按钮，复制到主编辑器并运行（状态、行为、边界、时序图、API、语法、无障碍、测试）

---

## 1. 目标与非目标

### 1.1 目标
1. 工具栏 Run 按钮旁新增 **「{Language} 101」** 按钮（如 “Python 101”），打开右侧抽屉（Sheet），展示当前语言的教程。
2. 每种语言一本“小书”：**概览 + ≥10 章**，难度递进：入门（beginner）→ 进阶（intermediate）→ 高级（advanced）。
3. 文档为 Markdown，存放在 `docs/<language>/`（一语言一目录），随应用打包、离线可读（无网络依赖，符合 COEP）。
4. 文档 UI 完全遵循应用的黑白单色主题（shadcn-vue + Tailwind tokens）。
5. 文档中**每个代码块都有 Run 按钮**：点击 → 把代码写入主编辑器（必要时切换语言、触发运行时下载）→ 自动运行；另有 Copy 按钮。**详细设计见 §14 代码块运行按钮设计。**
6. 覆盖语言：python、ruby、js/ts（QuickJS；TS 先转译）、sqlite、c（clang）、c++（clangpp）、php（php-cgi）、lua、go（Yaegi）。
7. 每个可运行代码块都被自动化测试实际运行验证（smoke），确保教程示例在我们的运行时里可运行。

### 1.2 非目标
- 不做在线课程平台功能（账号、进度云同步、评分、证书）。进度仅存 localStorage。
- 不在浏览器内做类型检查（TS 只转译）；不做自动判题（v1 练习只给参考答案，可选 “期望输出” 对比，见 §7.4）。
- 不复制任何版权受限资料原文；第三方资料仅作参考与外链（见 §10）。

---

## 2. UI 草图（ASCII）

### 2.1 抽屉关闭（工具栏新增按钮）
```
┌──────────────────┬──────────────────────────────────────────────────────────────┐
│ Languages        │ main.py                   [📖 Python 101] [▶ Run] [⟲]        │
│ [Py] Python    ✓ │──────────────────────────────────────────────────────────────│
│ [Rb] Ruby      ↓ │  1  print("hello")                                           │
│ ...              │                                                              │
│                  │══════════════════════════════════════════════════════════════│
│                  │ Terminal ● 就绪                                   [⌫] [v]    │
└──────────────────┴──────────────────────────────────────────────────────────────┘
  “Python 101” = ghost xs 按钮（BookOpen 图标 + 文字），切换语言时文字随之变化；快捷键 ⌘/Ctrl+J
```

### 2.2 抽屉打开 —— 目录（章节列表）
```
┌──────────────┬──────────────────────────────┬──────────────────────────────────┐
│ Languages    │ main.py   [📖][▶ Run]        │ Python 101                  [×]  │
│ [Py] Python  │──────────────────────────────│──────────────────────────────────│
│ ...          │  1 print("hello")            │ [🔍 搜索本书…]                    │
│              │                              │ 概览                              │
│              │   （编辑器仍可见/可编辑）      │ ───────── 入门 ─────────          │
│              │                              │ ✓ 01 你好，Python                │
│              │                              │ ✓ 02 变量与类型                   │
│              │══════════════════════════════│ ● 03 字符串与输入输出    ← 当前    │
│              │ Terminal                     │ ○ 04 列表与元组                   │
│              │ hello                        │ ───────── 进阶 ─────────          │
│              │                              │ ○ 07 函数与作用域 …               │
│              │                              │ ───────── 高级 ─────────          │
│              │                              │ ○ 10 生成器与迭代器 …             │
└──────────────┴──────────────────────────────┴──────────────────────────────────┘
  抽屉宽 min(560px, 45vw)，可拖拽 400–760px；非模态（不遮罩），编辑器/终端仍可操作
  ✓ 已读  ● 当前  ○ 未读（单色符号，不用颜色）
```

### 2.3 抽屉打开 —— 章节阅读
```
┌──────────────────────────────────┐
│ ← 目录   03 字符串与输入输出  [×] │
│ 入门 · 约 10 分钟                 │
│──────────────────────────────────│
│ ## 本章目标                       │
│ - 掌握 f-string 格式化            │
│ - 用 input() 读取用户输入          │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ python          [⧉][▶ Run]  │ │ ← 代码块头：语言标签 + Copy + Run
│ │ name = input("名字？")        │ │
│ │ print(f"你好，{name}！")       │ │
│ │──────────────────────────────│ │
│ │ stdin 示例：Ada               │ │ ← 可选：frontmatter/块属性给出的输入样例
│ └──────────────────────────────┘ │
│ > 💡 提示（单色引用块）            │
│                                  │
│ ## 练习                           │
│ 1. …  [展开参考答案]               │
│──────────────────────────────────│
│ [‹ 上一章 02]          [下一章 04 ›]│
└──────────────────────────────────┘
```

### 2.4 代码块 Run 状态
> 完整状态与行为见 §14.2–§14.4。
```
│ python               [⧉ 已复制][◌ Running…] │   运行中：Run 变为 loading，主工具栏同步
│ python   需要下载 Ruby 23 MB  [▶ 下载并运行] │   跨语言且未缓存：按钮文字提示下载
│ go       ⚠ 示例仅供阅读（不可运行）          │   runnable=false 的块：无 Run，仅 Copy
```

### 2.5 移动端（< 768px）
```
┌──────────────────────────┐
│ ≡  main.py  [📖][▶ Run]  │   侧栏默认折叠为图标栏/隐藏
│──────────────────────────│
│ （编辑器）                 │
│══════════════════════════│
│ Terminal                 │
└──────────────────────────┘
        点击 📖 ↓
┌──────────────────────────┐
│ Python 101          [×]  │   抽屉变为底部全屏 Sheet（side="bottom", 高 92vh）
│ ← 目录 / 章节内容 …       │   点击代码块 Run → 自动关闭 Sheet，聚焦终端显示输出
└──────────────────────────┘
```

---

## 3. 架构

### 3.1 组件树
```mermaid
graph TD
  Toolbar[EditorToolbar.vue] --> LearnBtn["LearnButton.vue<br/>{Language} 101"]
  App[AppShell.vue] --> Drawer["DocsDrawer.vue<br/>shadcn-vue Sheet (non-modal)"]
  Drawer --> Header[DocsHeader.vue<br/>标题/返回/关闭/搜索]
  Drawer --> List[ChapterList.vue<br/>按 level 分组]
  Drawer --> View[ChapterView.vue]
  View --> MD[MarkdownView.vue<br/>渲染 HTML + 挂载代码块]
  MD --> CB[CodeBlock.vue × N<br/>Copy / Run / stdin 样例]
  View --> Pager[ChapterPager.vue]
  subgraph Stores
    DS[useDocsStore<br/>open/当前语言/当前章节/已读进度]
    LS[useLanguageStore 已有]
    ES[useEditorStore 已有]
    RS[useRunStore 已有]
  end
  subgraph Core
    IDX[docs/index.ts<br/>import.meta.glob 索引]
    REN[markdown.ts<br/>markdown-it + 插件]
    HL[highlight.ts<br/>Shiki 单色主题 / 构建期]
    TS[transpile.ts<br/>Sucrase: TS→JS]
  end
  LearnBtn -.-> DS
  List -.-> DS --> IDX
  MD --> REN --> HL
  CB -.-> RS
  CB -.-> LS
  CB -.-> ES
  RS --> TS
```

### 3.2 文档加载
```mermaid
flowchart LR
  A["docs/&lt;lang&gt;/*.md"] -->|"import.meta.glob('/docs/*/*.md', { query: '?raw', import: 'default' })"| B[懒加载函数表]
  A -->|"import.meta.glob(..., { eager: true }) 仅 frontmatter<br/>（Vite 插件预解析为 JSON）"| C[章节索引 index.json]
  C --> D[ChapterList：标题/level/顺序/时长]
  B -->|打开章节时 import()| E[markdown-it 渲染]
  E --> F[HTML + 代码块占位 data-block-id]
  F --> G[MarkdownView 用 Vue 渲染 CodeBlock 组件替换占位]
```
- **按语言拆分 chunk**：每章一个懒加载模块（`?raw` 字符串），首次打开抽屉只加载索引（标题/元数据，几 KB）。
- **frontmatter 预解析**：自定义 Vite 插件 `vite-plugin-docs`（约 60 行）：对 `docs/**/*.md` 生成虚拟模块 `virtual:docs-index`（全部 frontmatter + 标题 + 代码块计数），并在构建时校验 schema（缺字段直接构建失败）。
- **高亮**：两方案：
  - A（推荐）**构建期 Shiki**：插件在构建时把 Markdown 预渲染为 HTML（markdown-it + `@shikijs/markdown-it`），运行时零高亮开销、不增加主包体积；自定义**单色主题**（关键字加粗、注释斜体灰、字符串中灰，无彩色）。
  - B 运行时复用 **Monaco `monaco.editor.colorize`**（已在包内，零新增依赖），但会带入 Monaco 彩色主题 → 与“文档单色”要求冲突，需自定义 Monaco 单色主题仅用于 colorize。
  - 结论：A。代码块原始源码另存在 `data` 中供 Run/Copy 使用（不从 HTML 反解）。
- **搜索（可选，M4）**：构建期为每语言生成轻量倒排索引（标题 + 小节标题 + 正文前 N 字），用 MiniSearch（MIT，~7KB gzip ⚠️）在抽屉内搜索。

### 3.3 从文档运行的时序
> 精确版本（含停止确认、TS 转译、备份撤销、expect 比对）见 §14.5；API 契约见 §14.6。
```mermaid
sequenceDiagram
  actor U as 用户
  participant CB as CodeBlock
  participant DS as docsStore
  participant LS as languageStore
  participant ES as editorStore
  participant RS as runStore
  participant T as Terminal
  U->>CB: 点击 ▶ Run
  CB->>CB: 若 lang=ts → Sucrase 转译为 JS（失败则在块下显示错误）
  alt 代码块语言 ≠ 当前语言
    CB->>LS: select(targetLang)（触发下载/进度，侧栏同步）
  end
  CB->>LS: ensure(targetLang)
  LS-->>CB: ready / error（error 时块内提示）
  CB->>ES: 若编辑器内容“脏”且非来自本块 → 先存为草稿备份（localStorage: simplecode:backup:<lang>）
  CB->>ES: set(targetLang, code)
  CB->>RS: run({ stdinPreset? })
  RS->>T: 清屏、输出（终端若折叠则自动展开）
  opt 块定义了 stdin 样例 且 用户选择“使用样例输入”
    RS->>RS: 启动后 pushStdin(sample) + pushEOF
  end
  RS-->>CB: 状态（running/done/failed）→ 块按钮同步
  Note over CB,T: 移动端：运行前关闭 Sheet；桌面端抽屉保持打开
```
- **覆盖保护**：编辑器内容被替换前，若与上次保存/示例不同，toast 提示「已备份你的代码，[恢复]」（单色 Sonner），避免误覆盖。
- `runStore.run()` 需扩展一个可选参数 `{ stdin?: string }`（实现阶段改动，现阶段仅规划）。

---

## 4. 组件设计

| 组件 | 职责 | 关键 props/状态 | shadcn-vue |
|---|---|---|---|
| `LearnButton` | 工具栏按钮，文字 `${label} 101`，有文档才显示 | 当前语言是否有 docs | Button(ghost, xs) + Tooltip |
| `DocsDrawer` | 非模态 Sheet，右侧（桌面）/底部（移动）；宽度可拖拽并记忆 | `open`、`view: toc\|chapter`、`width` | Sheet / SheetContent / SheetHeader |
| `DocsHeader` | 标题（Python 101）、返回目录、关闭、搜索框 | — | Button(icon)、Input |
| `ChapterList` | 概览 + 章节按 level 分组，显示已读状态、时长 | 索引、进度 | ScrollArea、Separator |
| `ChapterView` | 渲染章节、记录滚动位置、标记已读（滚动到底或停留 >30s） | chapterId | ScrollArea |
| `MarkdownView` | 输入预渲染 HTML + blocks 元数据，挂载 CodeBlock | html、blocks[] | — |
| `CodeBlock` | 语言标签、Copy、Run、stdin 样例、期望输出（折叠） | `lang`、`code`、`runnable`、`stdin?`、`expect?` | Button(xs)、Collapsible |
| `ChapterPager` | 上一章/下一章 | — | Button(outline, xs) |

状态：
- **CodeBlock.Run**：idle → (跨语言未缓存) “下载并运行” → downloading(百分比) → running(Loader2) → done(✓ exit 0，2s 后复位) / failed(空心圆 + exit N)。全部单色。
- **Copy**：⧉ → “已复制”（1.5s）。
- **ChapterList 项**：○ 未读 / ● 当前 / ✓ 已读；hover `bg-accent`；focus-visible ring。
- 键盘：`⌘/Ctrl+J` 开关抽屉；抽屉内 `[`/`]` 上/下一章；代码块内 `⌘/Ctrl+Enter` 运行该块（焦点在块上时）。
- 可访问性：Sheet `aria-label="Python 101 教程"`；代码块 Run `aria-label="运行此示例（Python）"`。

---

## 5. 样式规范（单色）
> 本节为摘要；**完整规范（实际 token 值、明暗配色表、排版、Shiki 主题、组件与状态）见 §13。**
- 完全使用现有 tokens（`--background/--foreground/--muted/--border/--accent/--primary`），**无任何彩色**；深/浅色同 DESIGN §11。
- 抽屉：`bg-background border-l border-border`，宽 `min(560px,45vw)`，标题栏 h-10，内容 `px-5 py-4`。
- 排版（`prose` 自定义，不用 @tailwindcss/typography 默认色）：正文 14px/1.7；h1 20px semibold；h2 16px semibold + 上间距 24px；h3 14px semibold；列表 `pl-5`；链接 `underline underline-offset-2`；引用块 `border-l-2 border-foreground/30 pl-3 text-muted-foreground`；表格 1px 边框、表头 `bg-muted`；行内代码 `bg-muted px-1 rounded font-mono text-[13px]`。
- 代码块：`rounded-md border border-border bg-muted`（浅色）/ `bg-[#0a0a0a]`（深色）；头部 h-8 `border-b`，左侧语言标签 `text-xs font-mono uppercase text-muted-foreground`，右侧 Copy（icon xs）+ Run（default xs, h-7）；代码 13px JetBrains Mono，行高 1.6，`overflow-x-auto`；行号可选关闭。
- Shiki 单色主题 `simplecode-mono-light/dark`：关键字 **粗体 foreground**，字符串 `foreground/75`，数字 `foreground/75`，注释 *斜体* `muted-foreground`，标点 `foreground/60`。
- 提示框（Markdown 容器 `::: tip / warning / note`）：单色边框 + 图标（lucide Info/AlertTriangle/Lightbulb），不使用颜色区分。
- 动画：Sheet 滑入 200ms；遵守 `prefers-reduced-motion`。

---

## 6. 文档目录与 frontmatter 约定

### 6.1 目录
```
docs/
├── _shared/                 # 通用片段（如“如何使用 Run 按钮”）
├── python/
│   ├── index.md             # 概览（chapter: 0）
│   ├── 01-hello.md
│   ├── …
│   └── 12-mini-project.md
├── ruby/  js/  sqlite/  c/  cpp/  php/  lua/  go/
└── README.md                # 写作规范（§9 摘要）
```
- 目录名 = 文档语言 id；与运行时 id 映射：`js→quickjs`（`ts` 代码块也在 js 书中）、`c→clang`、`cpp→clangpp`、`php→php-cgi`，其余同名。映射写在 `docs/index.ts`（或 manifest 增加 `docs: "python"` 字段）。

### 6.2 frontmatter schema
```yaml
---
language: python          # 必填，目录语言 id
chapter: 3                # 必填，0 = 概览
title: 字符串与输入输出     # 必填
level: beginner           # beginner | intermediate | advanced
minutes: 10               # 预计阅读时长
goals:                    # 本章目标（渲染为列表）
  - 掌握 f-string
  - 用 input() 读取输入
runtime: python           # 可选，默认按目录映射；用于覆盖
sources:                  # 参考资料 id（见 docs/sources.yaml），仅链接
  - python-tutorial
  - lxiy-python
updated: 2026-10-15
---
```

### 6.3 代码块属性（fenced info string）
````markdown
```python run stdin="Ada" expect="你好，Ada！"
name = input("名字？")
print(f"你好，{name}！")
```

```go norun
// 仅供阅读：Yaegi 不支持的写法示例
```

```ts run
const add = (a: number, b: number): number => a + b;
console.log(add(1, 2));
```
````
- `run`（默认对可运行语言为 true）、`norun`（只读）、`stdin="..."`（样例输入，`\n` 分隔多行）、`expect="..."`（期望输出子串，用于测试与可选的“检查输出”）、`lang` 可与书语言不同（例如 SQL 书中也可出现 python 块，Run 时自动切换语言）。
- 解析：markdown-it 的 `fence` 规则读取 info 字符串（`markdown-it-attrs` 风格或自写 parser，≈30 行）。

### 6.4 来源登记 `docs/sources.yaml`
```yaml
gobyexample: { title: Go by Example, url: https://gobyexample.com/, license: CC-BY-3.0, adapt: true }
little-go-book: { title: The Little Go Book, url: https://github.com/karlseguin/the-little-go-book, license: CC-BY-NC-SA-4.0, adapt: false }
```
`adapt:false` 的资料只能在章节末“延伸阅读”中链接；CI 校验：章节正文中出现大段与 adapt:false 来源相同的文本时报警（可选，见 §11）。

---

## 7. 各语言课程（每语言 1 概览 + ≥10 章）

> 约束总述（所有示例必须遵守）：无网络、无文件持久化（每次运行全新虚拟 FS，只有 `/program`）、无多线程并行、无第三方包、单文件程序；交互输入通过终端 stdin。

### 7.1 Python 101（CPython 3.11）
| # | 标题 | 级别 | 要点 | 示例程序 | 练习 |
|---|---|---|---|---|---|
| 0 | 概览：Python 是什么 | — | 解释执行、REPL 思维、在 SimpleCode 中运行与输入 | `print("你好")` | 改写问候语 |
| 1 | 你好，Python | 入门 | print、注释、缩进 | 打印名片 | 打印三角形 |
| 2 | 变量与类型 | 入门 | int/float/str/bool、type()、类型转换 | 温度换算 | 计算 BMI（stdin） |
| 3 | 字符串与输入输出 | 入门 | f-string、切片、input() | 问候（stdin） | 回文判断 |
| 4 | 条件与循环 | 入门 | if/elif、for/range、while、break | 猜数字（固定种子 random） | FizzBuzz |
| 5 | 列表与元组 | 入门 | 增删改查、切片、推导式 | 成绩统计 | 去重保序 |
| 6 | 字典与集合 | 入门 | dict 方法、集合运算、Counter | 词频统计 | 字母异位词分组 |
| 7 | 函数 | 进阶 | 参数/默认值/*args/**kwargs、作用域、lambda | 计算器函数 | 递归阶乘/斐波那契 |
| 8 | 异常处理 | 进阶 | try/except/finally、raise、自定义异常 | 安全除法 | 解析数字输入 |
| 9 | 模块与标准库 | 进阶 | math、random、datetime、itertools、collections | 日期差计算 | 排列组合 |
| 10 | 面向对象 | 进阶 | class、__init__、继承、dataclass、__repr__ | 银行账户 | 形状面积多态 |
| 11 | 迭代器与生成器 | 高级 | yield、生成器表达式、itertools 管道 | 无限素数生成器 | 滑动窗口 |
| 12 | 装饰器与上下文管理器 | 高级 | 闭包、functools.wraps、with/contextlib | 计时装饰器 | 缓存装饰器 |
| 13 | 类型标注与小项目 | 高级 | typing、dataclass、命令行小游戏 | 井字棋（stdin） | 扩展 AI |
限制说明：不讲 pip/requests/threading/文件写入持久化；`random` 示例固定 seed 以保证测试可复现。来源：Python Tutorial、Learn X in Y（改编）、Think Python / Automate（仅链接）。

### 7.2 Ruby 101（Ruby 3.2）
| # | 标题 | 级别 | 要点 | 示例 | 练习 |
|---|---|---|---|---|---|
| 0 | 概览 | — | 一切皆对象、irb 思维 | `puts "你好"` | — |
| 1 | 输出与变量 | 入门 | puts/print/p、字符串插值 | 名片 | 单位换算 |
| 2 | 数字、字符串与符号 | 入门 | Integer/Float、String 方法、Symbol | 字符串变换 | 首字母大写 |
| 3 | 条件与循环 | 入门 | if/unless、case/when、times/each/while | 成绩等级 | FizzBuzz |
| 4 | 数组 | 入门 | each/map/select/reduce | 统计 | 二维数组转置 |
| 5 | 哈希 | 入门 | Hash 字面量、遍历、默认值 | 词频（gets） | 分组 |
| 6 | 方法与块 | 进阶 | def、默认参数、yield、block_given? | 自定义 each | 计时块 |
| 7 | Proc 与 Lambda | 进阶 | 闭包、&block、method(:x) | 函数组合 | 柯里化 |
| 8 | 类与模块 | 进阶 | class、attr_accessor、include、Comparable | 向量类 | 排序自定义对象 |
| 9 | 异常 | 进阶 | begin/rescue/ensure/retry | 输入校验 | 重试逻辑 |
| 10 | Enumerable 进阶 | 高级 | lazy、each_slice、zip、group_by | 惰性素数 | 滑动平均 |
| 11 | 元编程入门 | 高级 | send、define_method、method_missing | 动态属性 | DSL |
| 12 | 小项目：文字冒险 | 高级 | 状态机、stdin 交互 | 冒险游戏 | 增加房间 |
来源：Ruby in Twenty Minutes（链接）、Ruby Koans（仅借鉴“公案”练习形式，不复制）、Poignant Guide（CC BY-SA，可少量改编）。

### 7.3 JavaScript / TypeScript 101（QuickJS）
| # | 标题 | 级别 | 要点 | 示例 | 练习 |
|---|---|---|---|---|---|
| 0 | 概览 | — | JS 引擎 vs 浏览器、QuickJS 环境（无 DOM） | `console.log` | — |
| 1 | 值与变量 | 入门 | let/const、类型、typeof | 类型表 | 交换变量 |
| 2 | 运算与字符串 | 入门 | 模板字符串、== vs === | 格式化 | 反转单词 |
| 3 | 控制流 | 入门 | if/switch/for/for…of | FizzBuzz | 九九乘法表 |
| 4 | 函数 | 入门 | 声明/箭头函数、默认参数、闭包 | 计数器 | 记忆化 |
| 5 | 数组 | 进阶 | map/filter/reduce/sort | 成绩处理 | 扁平化 |
| 6 | 对象与解构 | 进阶 | 展开、可选链、JSON | 配置合并 | 深拷贝 |
| 7 | 类与原型 | 进阶 | class、extends、getter、原型链 | 形状 | 栈/队列 |
| 8 | 错误处理 | 进阶 | try/catch、Error 子类 | 解析 JSON | 自定义错误 |
| 9 | 迭代器与生成器 | 高级 | Symbol.iterator、function* | 范围生成器 | 斐波那契 |
| 10 | Promise 与 async | 高级 | Promise 链、async/await（仅微任务，避免依赖 setTimeout ⚠️） | 异步流水线 | Promise.all |
| 11 | TypeScript 入门 | 高级 | 类型标注、interface、联合类型（`ts` 块，Sucrase 去类型后运行，无类型检查） | 类型化 TODO | 泛型函数 |
| 12 | TS 进阶与小项目 | 高级 | 泛型、类型收窄、枚举（Sucrase 支持 enum ⚠️） | 状态机 | 扩展 |
限制：无 DOM/fetch/模块导入（单文件）；stdin 读取在 QuickJS 版本中能力有限 ⚠️ → JS 书示例**不依赖 stdin**（实现阶段验证 `std`/`os` 模块后再决定）。来源：MDN（CC BY-SA，可改编）、TS Handbook（CC BY 4.0 ⚠️）、javascript.info / Eloquent JS（仅链接）。

### 7.4 SQL 101（SQLite 3.26）
| # | 标题 | 级别 | 要点 | 示例 | 练习 |
|---|---|---|---|---|---|
| 0 | 概览 | — | 关系模型、每次运行=全新内存库、`.mode box` | 建表+查询 | — |
| 1 | SELECT 基础 | 入门 | SELECT/FROM、列别名 | 电影表 | 选列 |
| 2 | 过滤与排序 | 入门 | WHERE、AND/OR、LIKE、ORDER BY、LIMIT | 筛选电影 | Top 3 |
| 3 | 建表与写入 | 入门 | CREATE TABLE、INSERT、类型亲和性 | 学生表 | 批量插入 |
| 4 | 更新与删除 | 入门 | UPDATE/DELETE、事务 BEGIN/COMMIT | 调薪 | 回滚演示 |
| 5 | 聚合与分组 | 进阶 | COUNT/SUM/AVG、GROUP BY、HAVING | 销售统计 | 每类最高 |
| 6 | 多表连接 | 进阶 | INNER/LEFT JOIN、外键 | 订单-客户 | 未下单客户 |
| 7 | 子查询与 CTE | 进阶 | IN/EXISTS、WITH | 高于平均 | 递归 CTE 生成序列 |
| 8 | 约束与索引 | 进阶 | PRIMARY KEY/UNIQUE/CHECK、CREATE INDEX、EXPLAIN QUERY PLAN | 约束违反示例 | 观察查询计划 |
| 9 | 窗口函数 | 高级 | ROW_NUMBER/RANK/LAG、OVER(PARTITION BY)（3.25+ 可用） | 排名 | 移动平均 |
| 10 | 视图与触发器 | 高级 | CREATE VIEW、TRIGGER | 审计日志 | 自动更新时间 |
| 11 | 小项目：图书馆 | 高级 | 建模 + 报表查询 | 借阅报表 | 逾期统计 |
限制：不用 `RETURNING`、`STRICT`、`->>`、`UPSERT … DO UPDATE`（3.24 起支持，可用 ⚠️需测）、`generate_series`（扩展未编入）；不依赖文件库。来源：SQLite 官方文档（公有领域，可改编）、SQLBolt / Select Star SQL（仅链接，借鉴循序渐进结构）。

### 7.5 C 101（clang 8 + wasi-libc）
| # | 标题 | 级别 | 要点 | 示例 | 练习 |
|---|---|---|---|---|---|
| 0 | 概览 | — | 编译→链接→运行（终端显示阶段）、`-Werror` 含义 | hello | — |
| 1 | 第一个程序 | 入门 | main、printf、返回值 | 名片 | 格式化表格 |
| 2 | 类型与运算 | 入门 | int/char/double、sizeof、整数溢出 | 类型大小 | 温度换算 |
| 3 | 输入与控制流 | 入门 | scanf、if/switch/for/while | 求和（stdin） | 质数判断 |
| 4 | 函数 | 入门 | 原型、递归、static | 阶乘 | 汉诺塔 |
| 5 | 数组与字符串 | 进阶 | 数组、char[]、string.h | 反转字符串 | 冒泡排序 |
| 6 | 指针 | 进阶 | &、*、指针运算、数组退化 | swap | 指针遍历 |
| 7 | 结构体与枚举 | 进阶 | struct、typedef、enum、union | 学生记录 | 链表节点 |
| 8 | 动态内存 | 进阶 | malloc/free、realloc | 动态数组 | 链表 |
| 9 | 预处理与多文件思维 | 高级 | #define、宏陷阱、#if（单文件内模拟头文件） | 断言宏 | 泛型 max 宏 |
| 10 | 位运算与未定义行为 | 高级 | 位操作、UB 示例与避免 | 位集合 | 计数 1 的个数 |
| 11 | 小项目：栈式计算器 | 高级 | 逆波兰表达式（stdin） | RPN 计算器 | 支持变量 |
限制：`-Werror` → 示例必须零警告（例如 `int main(void)`、检查 scanf 返回值）；无线程/信号/fork/文件持久化；`printf` 后提示前需 `fflush(stdout)`。来源：Beej / Modern C / learn-c.org（仅链接）。

### 7.6 C++ 101（clang 8 + libc++）
| # | 标题 | 级别 | 要点 | 示例 | 练习 |
|---|---|---|---|---|---|
| 0 | 概览 | — | C++ 与 C、本环境 C++17 部分支持 | hello | — |
| 1 | iostream 与变量 | 入门 | cout/cin、auto、引用 | 名片 | 交换 |
| 2 | string 与控制流 | 入门 | std::string、范围 for | 单词计数 | 回文 |
| 3 | vector 与算法 | 入门 | vector、sort、find、<algorithm> | 成绩排序 | 去重 |
| 4 | 函数与重载 | 入门 | 重载、默认参数、const 引用 | 重载 area | 模板前奏 |
| 5 | 类与对象 | 进阶 | 构造/析构、成员函数、访问控制 | 计数器 | 分数类 |
| 6 | 运算符重载 | 进阶 | operator+、<<、比较 | 向量 | 复数 |
| 7 | 继承与多态 | 进阶 | virtual、override、抽象类 | 形状 | 动物 |
| 8 | 模板 | 进阶 | 函数/类模板 | 泛型栈 | 泛型 max |
| 9 | STL 容器 | 高级 | map/set/unordered_map/deque | 词频 | LRU（list+map） |
| 10 | RAII 与智能指针 | 高级 | unique_ptr/shared_ptr、移动语义 | 资源守卫 | 链表 |
| 11 | Lambda 与现代 C++ | 高级 | lambda、std::function、结构化绑定（C++17） | 自定义排序 | 函数组合 |
| 12 | 小项目：库存管理 | 高级 | 综合 | 命令行库存 | 扩展 |
限制：避免 C++20（concepts/ranges/format）、`std::filesystem`、`std::thread`；异常（throw/try）是否可用 **需实测** ⚠️，若不可用则相关内容标 `norun` 并说明。来源：LearnCpp、cppreference（仅链接）、C++ Core Guidelines（可引用条目编号）。

### 7.7 PHP 101（php-cgi 8.2）
| # | 标题 | 级别 | 要点 | 示例 | 练习 |
|---|---|---|---|---|---|
| 0 | 概览 | — | `<?php`、CLI 式运行（-q 无头） | echo | — |
| 1 | 变量与输出 | 入门 | $var、echo/print、字符串插值 | 名片 | heredoc |
| 2 | 类型与运算 | 入门 | 弱类型、严格比较、`declare(strict_types=1)` | 比较表 | 类型转换 |
| 3 | 控制流 | 入门 | if/match/for/foreach | FizzBuzz | 等级 match |
| 4 | 数组 | 入门 | 索引/关联数组、array_* 函数 | 成绩 | 分组 |
| 5 | 函数 | 进阶 | 类型声明、默认值、箭头函数、闭包 | 计算器 | 柯里化 |
| 6 | 字符串处理 | 进阶 | sprintf、str_*、preg_* | 模板替换 | 校验邮箱 |
| 7 | 面向对象 | 进阶 | class、构造器提升、readonly、接口 | 账户 | 形状 |
| 8 | 异常与错误 | 进阶 | try/catch、自定义异常 | 安全除法 | 校验 |
| 9 | 枚举与 match（8.1+） | 高级 | enum、backed enum | 订单状态 | 状态机 |
| 10 | 生成器与迭代器 | 高级 | yield、IteratorAggregate | 惰性范围 | 分页 |
| 11 | 小项目：JSON 报表 | 高级 | json_encode/decode、array 处理 | 报表 | 排序输出 |
限制：无网络/数据库/会话/HTTP 请求处理；stdin 读取方式需实测（`fgets(STDIN)` vs `php://stdin`）⚠️，确认前 PHP 书示例不依赖 stdin。来源：PHP 手册（CC BY 3.0 ⚠️，可改编署名）、PHP The Right Way（仅链接）。

### 7.8 Lua 101（Lua 5.4.9）
| # | 标题 | 级别 | 要点 | 示例 | 练习 |
|---|---|---|---|---|---|
| 0 | 概览 | — | 轻量嵌入式语言、5.4 特性 | print | — |
| 1 | 值与变量 | 入门 | nil/boolean/number/string、local | 类型表 | 交换 |
| 2 | 字符串 | 入门 | `..`、string 库、模式匹配基础 | 格式化 | 单词计数 |
| 3 | 控制流 | 入门 | if、while、repeat、数值/泛型 for | FizzBuzz | 质数 |
| 4 | 表（数组） | 入门 | 序列、`#`、table.insert/concat/sort | 成绩 | 反转 |
| 5 | 表（字典） | 入门 | pairs/ipairs、嵌套表 | 词频（io.read） | 分组 |
| 6 | 函数与闭包 | 进阶 | 多返回值、可变参数、闭包、高阶函数 | 计数器 | map/filter |
| 7 | 错误处理 | 进阶 | error/pcall/xpcall/assert（本构建可用） | 安全解析 | 带回溯的 xpcall |
| 8 | 元表与 OOP | 进阶 | setmetatable、__index、__add、__tostring | 向量类 | 继承 |
| 9 | 模块思维 | 进阶 | 返回表的模块模式（单文件内） | 工具模块 | 命名空间 |
| 10 | 协程 | 高级 | coroutine.create/resume/yield、生产者-消费者 | 生成器 | 管道 |
| 11 | 字符串模式进阶 | 高级 | gsub/gmatch/捕获 | 模板引擎 | CSV 解析 |
| 12 | 小项目：文字冒险 | 高级 | 状态机 + io.read | 冒险游戏 | 存档（内存） |
限制：无 `io.popen`/`os.execute`/`io.tmpfile`/`os.tmpname`、无 `require` C 模块。来源：Lua 5.4 手册（引用条目）、Learn Lua in Y（CC BY-SA，可改编）、Programming in Lua（仅链接）。

### 7.9 Go 101（Yaegi 0.16.1 解释器）
| # | 标题 | 级别 | 要点 | 示例 | 练习 |
|---|---|---|---|---|---|
| 0 | 概览 | — | Go 特点；本环境为解释执行（Yaegi），仅标准库 | hello | — |
| 1 | 包、变量与常量 | 入门 | package main、:=、const、iota | 名片 | 单位换算 |
| 2 | 基本类型与格式化 | 入门 | int/float64/string/rune、fmt.Printf | 类型表 | 字符计数（rune） |
| 3 | 控制流 | 入门 | if/for/switch、defer | FizzBuzz | 质数 |
| 4 | 数组、切片与 map | 入门 | append、copy、range、map | 词频（bufio.Scanner 读 stdin） | 去重 |
| 5 | 函数与闭包 | 进阶 | 多返回值、可变参数、闭包 | 计数器 | 记忆化 |
| 6 | 结构体与方法 | 进阶 | struct、值/指针接收者、嵌入 | 账户 | 矩形 |
| 7 | 接口 | 进阶 | 隐式实现、类型断言、Stringer | 形状 | error 接口 |
| 8 | 错误处理 | 进阶 | error、errors.Is/As、fmt.Errorf %w、panic/recover | 解析数字 | 自定义错误 |
| 9 | goroutine 与 channel | 高级 | go、chan、select、sync.WaitGroup（单线程调度，演示并发而非并行） | 流水线 | 扇入扇出 |
| 10 | 泛型 | 高级 | 类型参数、约束（Yaegi 泛型支持有限 ⚠️ → 仅简单示例，复杂者标 norun） | Map/Filter | 泛型栈 |
| 11 | 标准库精选 | 高级 | strings、sort、strconv、time（避免依赖真实 Sleep 时长）、encoding/json | JSON 编解码 | 排序结构体 |
| 12 | 小项目：命令行待办 | 高级 | 综合 + stdin | TODO | 持久化（内存） |
限制：无 `go get`/第三方模块/cgo/网络；Yaegi 与官方编译器存在语义差异（个别反射/泛型/unsafe）⚠️；每个示例必须是完整 `package main`。来源：Go by Example（**CC BY 3.0，可改编，须署名**）、A Tour of Go（⚠️ 许可证待确认，先仅链接）、The Little Go Book（CC BY-NC-SA，仅链接）、Learn Go with Tests（MIT，测试驱动思路）。

---

## 8. 实现要点（供后续实现参考）
- 依赖（预计）：`markdown-it`（MIT）、`@shikijs/markdown-it` + `shiki`（MIT，构建期）、`gray-matter` 或 `front-matter`（MIT，构建期）、`sucrase`（MIT，运行时，懒加载）、可选 `minisearch`（MIT）。运行时新增 JS 约：markdown 运行时 0（预渲染）+ sucrase ~200KB（仅 TS 块首次运行时加载）⚠️。
- shadcn-vue 组件：Sheet、ScrollArea、Separator、Input、Collapsible、Sonner（按需 `npx shadcn-vue add`）。
- Store：`useDocsStore`（open、lang、chapterId、progress: Record<lang, Set<chapter>>、scroll 位置，持久化 localStorage）。
- `runStore.run({ stdin })` 扩展；`CodeEditor` 无需修改（已监听 editorStore 外部变更）。
- 与语言切换联动：抽屉打开时切换左侧语言 → 抽屉跟随切到该语言的书（保持各书最近阅读位置）。

---

## 9. 内容写作规范
1. **中文原创**：所有正文由我们撰写；参考资料只取知识点与章节顺序，不翻译、不复制原文；CC BY / CC BY-SA / MIT / 公有领域资料的**代码示例**可改编，须在章节末“参考与致谢”注明来源与许可证（SA 资料改编的片段同协议）。
2. 每章结构：`本章目标 → 讲解（小节 2–5 个）→ 可运行示例（≥3 个）→ 常见错误 → 练习（2–3 题，带折叠参考答案）→ 延伸阅读（链接）`。
3. **示例必须可运行**：单文件、无网络/文件依赖、输出确定（固定随机种子、不打印时间戳/地址）；需要输入的示例必须提供 `stdin=` 样例；预期输出写进 `expect=`。
4. 运行时差异要说明：例如 “本环境 C++ 为 LLVM 8，不支持 C++20”，“Go 由 Yaegi 解释执行”。
5. 代码风格：Python PEP 8、Go gofmt、C/C++ 4 空格、Lua 2 空格；示例 ≤ 40 行；注释中文。
6. 术语表：每本书 `index.md` 末尾维护中英术语对照。
7. **测试**：`tests/docs-smoke.mjs`：遍历 `docs/**/*.md` 的所有 `run` 代码块，按语言分组，用现有 Playwright smoke 流程（或抽出 headless runner）逐块运行：断言 exit 0（或 frontmatter 声明的期望非 0）、`expect` 子串命中、超时 30s；`norun` 块跳过但统计数量；CI 失败即阻止合并。`./build.sh test` 增加 `--docs`。
8. 审校清单：可运行性、正确性、术语一致、无版权文本、许可证标注。

---

## 10. 参考资料与许可证（详见 learn-research.md）
| 资料 | 链接 | 许可证 | 使用方式 |
|---|---|---|---|
| Learn X in Y minutes | https://learnxinyminutes.com/ | CC BY-SA 3.0 ✔ | 可改编（署名+SA） |
| Python Tutorial | https://docs.python.org/3/tutorial/ | PSF ⚠️ | 参考/链接 |
| Think Python 3e | https://greenteapress.com/wp/think-python-3rd-edition/ | CC BY-NC-SA 4.0 ⚠️ | 仅链接 |
| A Byte of Python | https://python.swaroopch.com/ | CC BY-SA 4.0 ⚠️ | 可改编 |
| Ruby in Twenty Minutes | https://www.ruby-lang.org/en/documentation/quickstart/ | ⚠️ | 链接 |
| Ruby Koans | https://github.com/edgecase/ruby_koans | CC BY-NC-SA 3.0 ✔ | 仅链接 |
| Why's (Poignant) Guide | https://poignant.guide/ | CC BY-SA 2.5 ⚠️ | 可少量改编 |
| javascript.info | https://javascript.info/ | CC BY-NC-SA 4.0 ⚠️ | 仅链接 |
| Eloquent JavaScript | https://eloquentjavascript.net/ | CC BY-NC 3.0 ⚠️ | 仅链接 |
| MDN JS Guide | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide | CC BY-SA 2.5 / 代码 CC0 ⚠️ | 可改编 |
| TypeScript Handbook | https://www.typescriptlang.org/docs/handbook/intro.html | CC BY 4.0 ⚠️ | 可改编 |
| SQLite 文档 | https://www.sqlite.org/lang.html | Public Domain ✔ | 可改编 |
| SQLBolt | https://sqlbolt.com/ | 版权保留 | 仅链接 |
| Select Star SQL | https://selectstarsql.com/ | ⚠️ | 仅链接 |
| Beej's Guide to C | https://beej.us/guide/bgc/ | CC BY-NC-ND 3.0 ⚠️ | 仅链接 |
| Modern C | https://gustedt.gitlabpages.inria.fr/modern-c/ | ⚠️ NC-ND | 仅链接 |
| learn-c.org | https://www.learn-c.org/ | ⚠️ | 仅链接 |
| LearnCpp | https://www.learncpp.com/ | 版权保留 | 仅链接 |
| C++ Core Guidelines | https://github.com/isocpp/CppCoreGuidelines | MIT 风格 ⚠️ | 引用条目 |
| PHP Manual | https://www.php.net/manual/en/ | CC BY 3.0 ⚠️ | 可改编 |
| PHP The Right Way | https://github.com/codeguy/php-the-right-way | CC BY-NC-SA 3.0 ✔ | 仅链接 |
| Programming in Lua (1st ed.) | https://www.lua.org/pil/ | 版权保留 | 仅链接 |
| Lua 5.4 Manual | https://www.lua.org/manual/5.4/ | Lua.org ⚠️ | 引用 |
| Go by Example | https://gobyexample.com/ | CC BY 3.0 ✔ | 可改编（署名） |
| A Tour of Go | https://go.dev/tour/ | ⚠️ | 链接 |
| The Little Go Book | https://github.com/karlseguin/the-little-go-book | CC BY-NC-SA 4.0 ✔ | 仅链接 |
| Effective Go | https://go.dev/doc/effective_go | ⚠️ | 链接 |
| Learn Go with Tests | https://github.com/quii/learn-go-with-tests | MIT ✔ | 可改编 |
| Teach Yourself Programming in Ten Years | https://norvig.com/21-days.html | 版权保留 | 设计理念参考 |
✔ = 本次从仓库 README/LICENSE 实际抓取确认；⚠️ = 基于已知信息，落地前需逐一核实。

---

## 11. 里程碑
| M | 内容 | 验收 |
|---|---|---|
| L0 | docs 目录骨架、frontmatter schema、`vite-plugin-docs`（索引 + 校验 + 预渲染）、单色 Shiki 主题 | `yarn build` 生成索引，schema 错误会失败 |
| L1 | UI：LearnButton、DocsDrawer（桌面+移动）、ChapterList、ChapterView、CodeBlock（Copy/Run） | 打开/关闭/切章/跨语言运行可用 |
| L2 | `runStore.run({stdin})`、覆盖备份 toast、TS 转译（Sucrase 懒加载） | ts 块可运行；stdin 样例可用 |
| L3 | 内容第一批：Python、Go、Lua、SQL（各 1 概览 + ≥10 章） | docs-smoke 全绿 |
| L4 | 内容第二批：C、C++、Ruby、PHP、JS/TS；运行时能力实测（PHP stdin、QuickJS stdin/timers、C++ 异常） | docs-smoke 全绿 |
| L5 | 搜索（MiniSearch）、阅读进度、快捷键、无障碍、截图回归 | Lighthouse a11y ≥ 90 |

---

## 12. 风险
1. **内容工作量**：9 本 × ≥11 篇 ≈ 100+ 篇中文原创、300+ 可运行示例；需分批交付并以 docs-smoke 保证质量。
2. **运行时差异**：clang 8 / SQLite 3.26 / Yaegi / QuickJS-wasmedge 与主流版本不同，读者照搬到本地可能行为不同 → 每本书概览注明版本与限制。
3. **未验证能力** ⚠️：QuickJS 的 stdin 与定时器、PHP CGI 的 STDIN、C++ 异常、Yaegi 泛型、`time.Sleep`——在 L4 前实测，不通过的主题改写或标 `norun`。
4. **许可证**：大量优质资料为 NC/ND，只能链接；改编 CC BY-SA 内容会使对应文件需以 CC BY-SA 发布 → 建议 docs 整体采用 **CC BY-SA 4.0**，代码示例 **MIT**，在 `docs/LICENSE` 声明。
5. **体积**：预渲染 HTML + 索引随语言数线性增长（估计每本 200–400 KB，按章懒加载可接受）。
6. **覆盖用户代码**：Run 文档示例会替换编辑器内容 → 必须有备份与恢复。
7. **与并行开发冲突**：实现阶段需改 EditorToolbar/AppShell/runStore（其他 PR 也在改）→ 实现前 rebase，并以新增组件为主、最小化对既有文件的修改。

---

## 13. 文档 UI 黑白主题规范

> 对应需求（4）：文档 UI 与主界面主题**完全一致**，纯黑白灰。本节所有取值均来自现有代码：`src/style.css`（CSS 变量，HSL 三元组，饱和度全部为 0）、`tailwind.config.js`（颜色映射 `hsl(var(--x))`、字体栈）、`src/main.ts`（本地打包字体）、`src/components/ui/button`（尺寸 variants）。文档组件**不得新增任何颜色变量**，只能组合以下 token 与其透明度（如 `foreground/60`）。

### 13.1 铁律：文档中不使用任何强调色
- 禁止 `text-red-*`/`blue-*`/`green-*`/`yellow-*`… 等任何带色相的 Tailwind 类，禁止十六进制彩色、禁止 Shiki/Monaco 默认彩色主题、禁止 emoji 作为状态指示（正文 emoji 可保留但不承担语义）。
- 状态差异只用：**明度**（foreground / muted-foreground / 透明度）、**字重**（400/500/600）、**形状**（实心●/空心○/✓/虚线边框）、**动画**（pulse/spin）。
- 校验：CI 增加 `scripts/check-mono.mjs`：扫描 `src/components/docs/**` 与 Shiki 主题 JSON，若出现饱和度 > 0 的颜色值或彩色 Tailwind 类则失败。
- 唯一允许“有色”的区域仍只有主编辑器 Monaco（不在抽屉内）。

### 13.2 复用的设计 token（实际值）
| CSS 变量（`src/style.css`） | Light（`:root`） | Dark（`.dark`） | Tailwind 类 |
|---|---|---|---|
| `--background` | `0 0% 100%`（#FFFFFF） | `0 0% 4%`（#0A0A0A） | `bg-background` |
| `--foreground` | `0 0% 4%`（#0A0A0A） | `0 0% 98%`（#FAFAFA） | `text-foreground` |
| `--muted` | `0 0% 97%`（#F7F7F7） | `0 0% 7%`（#121212） | `bg-muted` |
| `--muted-foreground` | `0 0% 45%`（#737373） | `0 0% 64%`（#A3A3A3） | `text-muted-foreground` |
| `--accent` | `0 0% 92%`（#EBEBEB） | `0 0% 15%`（#262626） | `bg-accent` |
| `--secondary` | `0 0% 96%` | `0 0% 15%` | `bg-secondary` |
| `--primary` / `--primary-foreground` | `0 0% 9%` / `0 0% 98%` | `0 0% 98%` / `0 0% 9%` | `bg-primary text-primary-foreground` |
| `--border` / `--input` | `0 0% 89%`（#E3E3E3） | `0 0% 15%`（#262626） | `border-border` |
| `--ring` | `0 0% 9%` | `0 0% 83%` | `ring-ring` |
| `--popover` | `0 0% 100%` | `0 0% 4%` | `bg-popover`（Tooltip/菜单） |
| `--terminal-bg` | `#0a0a0a` | `#000000` | `bg-terminal`（仅终端，不用于文档） |
| `--radius` | `0.5rem` | 同 | `rounded-lg`=8px / `rounded-md`=6px / `rounded-sm`=4px |
（`--success/--warning/--destructive` 在本应用中也是灰阶，但文档组件不使用它们，避免语义混淆。）

### 13.3 文档元素配色表
| 元素 | Light | Dark | 实现 |
|---|---|---|---|
| 抽屉背景 | `--background` #FFF | `--background` #0A0A0A | `bg-background` |
| 抽屉左边框 / 分隔线 | `--border` #E3E3E3 | `--border` #262626 | `border-l border-border` |
| 抽屉标题栏 | 背景 `--background`，下边框 `--border` | 同 | `h-10 border-b` |
| 正文文字 | `--foreground` | `--foreground` | `text-foreground` |
| 次要文字（元信息、时长、页脚） | `--muted-foreground` #737373 | #A3A3A3 | `text-muted-foreground` |
| 标题 h1/h2/h3 | `--foreground`，600 | 同 | `font-semibold` |
| 链接 | `--foreground` + 下划线；hover 下划线加粗、`foreground/80` | 同 | `underline underline-offset-2 decoration-foreground/40 hover:decoration-foreground` |
| 行内代码 | 背景 `--muted`，文字 `--foreground`，1px `--border` | 背景 `--accent` #262626 | `rounded-sm bg-muted px-1 py-px font-mono text-[13px] border` |
| 代码块背景 | `--muted` #F7F7F7 | `--muted` #121212 | `bg-muted` |
| 代码块边框 / 头部分隔 | `--border` | `--border` | `border rounded-md`，头部 `border-b` |
| 代码块语言标签 | `--muted-foreground` | 同 | `text-[11px] font-mono uppercase tracking-wider` |
| 表格边框 | `--border` | `--border` | `border-collapse border` |
| 表头 | 背景 `--muted`，600 | 背景 `--muted` | `bg-muted font-semibold` |
| 表格斑马纹 | 偶数行 `muted/50` | 同 | `even:bg-muted/50` |
| 引用块 blockquote | 左边框 2px `foreground/30`，文字 `--muted-foreground` | 同 | `border-l-2 border-foreground/30 pl-3` |
| 提示框 tip/note/warning | 1px `--border`、背景 `--background`、左侧 lucide 图标（Lightbulb/Info/AlertTriangle）`foreground`；warning 用**2px 实线边框**区分，不用颜色 | 同 | `rounded-md border p-3`（warning：`border-2 border-foreground/60`） |
| 列表标记 | `--muted-foreground` | 同 | `marker:text-muted-foreground` |
| 有序列表数字 | `--muted-foreground`，tabular-nums | 同 | — |
| 分隔线 hr | 1px `--border` | 同 | `border-t my-6` |
| 章节列表：hover | `--accent` | `--accent` | `hover:bg-accent` |
| 章节列表：当前章 | `--accent` 背景 + 500 字重 + 左侧 2px `--foreground` 竖条 | 同 | `bg-accent font-medium border-l-2 border-foreground` |
| 章节状态符号 | 已读 ✓（foreground）/ 当前 ●（foreground）/ 未读 ○（muted-foreground） | 同 | lucide Check / Circle(fill) / Circle |
| 分组标题（入门/进阶/高级） | `--muted-foreground`，11px uppercase | 同 | 与侧栏 “LANGUAGES” 标题一致 |
| 滚动条 thumb / track | thumb `foreground/20`（hover `/35`），track 透明，宽 8px，圆角 4px | thumb `foreground/25` | ScrollArea 的 `ScrollAreaThumb` 类：`bg-foreground/20 rounded-full` |
| 选区 | `foreground/15` | `foreground/25` | `selection:bg-foreground/15` |
| 搜索命中高亮 | 文字加粗 + 下划线（不用黄色 mark） | 同 | `mark { background: transparent; font-weight:600; text-decoration: underline }` |

### 13.4 字体与排版（实际已打包字体）
- 已打包：`@fontsource/inter` latin 400/500/600、`@fontsource/jetbrains-mono` latin 400（`src/main.ts`；实现时需追加 `latin-700.css` 供代码关键字加粗，约 +20KB）；CJK 使用系统字体：UI 文本走 `tailwind.config.js` 的 `sans` 栈（`Inter, system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`），代码走 `mono` 栈（`"JetBrains Mono", "SimpleCode CJK", ui-monospace, SFMono-Regular, Menlo, monospace`，其中 `SimpleCode CJK` 为 `local()` 系统字体 + `size-adjust:120%`）。
- 文档字号阶梯（px / 行高 / 字重）：
| 用途 | 字号 | 行高 | 字重 | 其它 |
|---|---|---|---|---|
| 抽屉标题（Python 101） | 14 | 20 | 600 | — |
| 章节 h1 | 20 | 28 | 600 | `tracking-tight`，下方元信息 12px muted |
| h2 | 16 | 24 | 600 | 上间距 28，下 8 |
| h3 | 14 | 20 | 600 | 上间距 20，下 6 |
| 正文 p / li | 14 | 24（1.7） | 400 | 段间距 12 |
| 小字（元信息、表格注） | 12 | 16 | 400 | muted |
| 行内代码 | 13 | — | 400 | mono |
| 代码块 | 13 | 21（1.6） | 400 | mono；粗体关键字 700（需追加打包 JetBrains Mono 700） |
| 章节列表项 | 13 | 20 | 400 / 当前 500 | — |
| 分组标题 | 11 | 16 | 500 | uppercase、`tracking-wider` |

### 13.5 间距与尺寸
- 4px 网格。抽屉宽默认 `min(560px, 45vw)`，拖拽范围 400–760px；标题栏 `h-10 px-3`（与编辑器工具栏同高 40px）；内容区 `px-5 py-4`；正文最大行宽 68ch。
- 代码块：外边距 `my-4`，头部 `h-8 pl-3 pr-1`，代码区 `px-3 py-2.5`；按钮间距 `gap-1`。
- 章节列表项 `h-9 px-3`（与侧栏条目节奏一致）；分组标题 `px-3 pt-4 pb-1`。
- 圆角：代码块/提示框 `rounded-md`(6px)，行内代码 `rounded-sm`(4px)，按钮沿用 Button（`rounded-md`）。

### 13.6 单色 Shiki 主题 `simplecode-mono-{light,dark}`
| Scope（TextMate） | Light | Dark | 字形 |
|---|---|---|---|
| 默认文本 `editor.foreground` | #0A0A0A | #FAFAFA | 400 |
| `keyword`, `storage`, `keyword.control` | #0A0A0A | #FAFAFA | **700** |
| `entity.name.function`, `support.function` | #0A0A0A | #FAFAFA | 500（下划线不用） |
| `entity.name.type`, `support.type`, `entity.name.class` | #262626 | #E5E5E5 | 600 |
| `string`, `string.template` | #525252 | #C4C4C4 | 400 |
| `constant.numeric`, `constant.language` | #404040 | #D4D4D4 | 400 |
| `comment` | #737373（= muted-foreground） | #A3A3A3 | *italic* |
| `punctuation`, `meta.brace` | #737373 | #8A8A8A | 400 |
| `variable.parameter` | #0A0A0A | #FAFAFA | *italic* |
| `invalid` | #0A0A0A | #FAFAFA | 下划线 wavy |
| 背景 `editor.background` | 透明（由代码块 `bg-muted` 提供） | 透明 | — |
- 主题 JSON 中所有颜色均为灰阶（R=G=B），`check-mono.mjs` 校验。
- 构建期生成 light/dark 两套 class（Shiki dual themes：`themes: { light, dark }`，输出 CSS 变量，随 `<html class="dark">` 切换），无需运行时重新高亮。

### 13.7 使用的 shadcn-vue 组件（新增 `npx shadcn-vue add` 的标注 *新增*）
| 组件 | 用途 | 关键类 |
|---|---|---|
| **Sheet**（*新增*，reka-ui Dialog） | 抽屉：桌面 `side="right"` 非模态（`:modal="false"`、无遮罩），移动 `side="bottom"` 模态 | `SheetContent class="w-[min(560px,45vw)] p-0 border-l"` |
| **ScrollArea**（*新增*） | 章节列表 / 正文滚动，统一灰阶滚动条 | thumb `bg-foreground/20` |
| **Button**（已有） | 复制/运行（`size="xs"`=h-7）、关闭/返回（`size="icon"` 收紧为 h-7 w-7）、上一章/下一章（`variant="outline" size="xs"`） | 见 §14 |
| **Tooltip**（已有） | 图标按钮说明、语言下载提示 | `bg-primary text-primary-foreground text-xs` |
| **Separator**（*新增*） | 分组间分隔、页脚分隔 | `bg-border` |
| **Input**（*新增*） | 书内搜索 | `h-8 text-sm border-input focus-visible:ring-1 ring-ring` |
| **Collapsible**（*新增*） | 练习“参考答案”、代码块“期望输出 / stdin 样例” | 触发器 `text-xs underline` |
| **Badge**（已有） | 章节级别（入门/进阶/高级）、时长 | 单色描边 |
| **Sonner / Toast**（*新增*） | “已替换编辑器内容 [撤销]” | `bg-primary text-primary-foreground`（反色，单色） |
| **Kbd**（自建，已在 Tooltip 中使用 `<kbd>`） | 快捷键提示 | `font-mono text-[10px] opacity-70` |

### 13.8 交互状态（所有文档可交互元素）
| 状态 | 规则 |
|---|---|
| hover | 背景 `bg-accent`；文字不变；链接下划线变实 |
| focus-visible | `ring-2 ring-ring ring-offset-1 ring-offset-background`（与 Button 一致），列表项为 `ring-inset` |
| active / pressed | 背景 `bg-accent` + `translate-y-px`（按钮）；主按钮 `bg-primary/90` |
| selected（当前章） | `bg-accent font-medium border-l-2 border-foreground` |
| disabled | `opacity-50 pointer-events-none`，Tooltip 说明原因 |
| loading | lucide `Loader2 animate-spin`；文字改为进行时 |
| reduced motion | `motion-reduce:animate-none`，Sheet 动画关闭 |

### 13.9 ASCII：抽屉与渲染后的章节（浅色 / 深色）
浅色（白底、灰边、黑字）：
```
┌────────────────────────────────────────────┐  bg #FFFFFF  border-l #E3E3E3
│ ← 目录   Python 101              [⌕] [×]   │  h-10, 14px/600, 下边框 #E3E3E3
├────────────────────────────────────────────┤
│ 03 字符串与输入输出                         │  h1 20px/600 #0A0A0A
│ 入门 · 约 10 分钟                           │  12px #737373  [入门] Badge 描边
│                                            │
│ 本章目标                                    │  h2 16px/600
│  • 掌握 f-string 格式化                     │  marker #737373
│  • 用 input() 读取输入                      │
│                                            │
│ 用 `input()` 读取一行文本……                 │  行内代码 bg #F7F7F7 + 1px #E3E3E3
│ ┌────────────────────────────────────────┐ │  代码块 bg #F7F7F7 border #E3E3E3
│ │ PYTHON                [复制] [运行 ▷]  │ │  头部 h-8，标签 11px #737373
│ ├────────────────────────────────────────┤ │
│ │ name = input("名字？")                 │ │  关键字/函数黑 700，字符串 #525252
│ │ print(f"你好，{name}！")  # 输出问候    │ │  注释 #737373 斜体
│ └────────────────────────────────────────┘ │
│ ▎ 提示：input() 总是返回字符串。            │  blockquote 左边 2px foreground/30
│ ────────────────────────────────────────── │  hr #E3E3E3
│ [‹ 02 变量与类型]        [04 列表与元组 ›]  │  outline xs 按钮
└────────────────────────────────────────────┘
```
深色（近黑底、深灰边、白字）：
```
┌────────────────────────────────────────────┐  bg #0A0A0A  border-l #262626
│ ← 目录   Python 101              [⌕] [×]   │  文字 #FAFAFA
├────────────────────────────────────────────┤
│ 03 字符串与输入输出                         │  #FAFAFA
│ 入门 · 约 10 分钟                           │  #A3A3A3
│ ┌────────────────────────────────────────┐ │  代码块 bg #121212 border #262626
│ │ PYTHON                [复制] [运行 ▷]  │ │  [运行 ▷] = 反色：白底黑字
│ │ name = input("名字？")                 │ │  字符串 #C4C4C4，注释 #A3A3A3 斜体
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```
章节列表（浅色）：
```
│ 入门                                       │  11px uppercase #737373
│ ✓ 01 你好，Python                    5 分 │
│ ✓ 02 变量与类型                      8 分 │
│▌● 03 字符串与输入输出               10 分 │  bg #EBEBEB + 2px 黑竖条 + 500
│ ○ 04 列表与元组                     12 分 │  ○ 为 #737373
```

---

## 14. 代码块运行按钮设计

> 对应需求（5）：文档中**每个代码块**都有运行按钮；点击后把代码复制到**当前主界面编辑器**并运行。本节定义外观、状态、精确行为、边界情况、API 契约、语法、无障碍与测试。现有可复用 API（main@b6a1c07 实际代码）：`useLanguageStore().select(id)` / `.ensure(id): Promise<boolean>` / `.states[id].status`（`idle|cached|downloading|ready|error`，含 `loaded/total`）；`useEditorStore().get(id)` / `.set(id, code)`；`useRunStore().run()` / `.stop()` / `.running` / `.status` / `.exitCode`；`terminal`（`src/core/terminal.ts`）`.focus()` / `.transcript`。

### 14.1 外观（与主工具栏 Run 一致：Button `size="xs"` = `h-7 px-2.5 text-xs`，图标 14px）
```
┌──────────────────────────────────────────────────────────┐
│ PYTHON  · 需要输入                     [⧉ 复制] [运行 ▷] │  头部 h-8；[复制]=ghost xs，[运行 ▷]=default xs（反色）
├──────────────────────────────────────────────────────────┤
│ name = input("名字？")                                   │
│ print(f"你好，{name}！")                                  │
├──────────────────────────────────────────────────────────┤
│ ▸ 样例输入：Ada        ▸ 期望输出                         │  Collapsible，12px muted，可选
└──────────────────────────────────────────────────────────┘
```
- 按钮顺序固定：`[复制]` 在左、`[运行 ▷]` 在右（主操作最右，与工具栏一致）；图标 lucide `Copy` / `Play`。
- 窄抽屉（< 420px）时按钮只显示图标，Tooltip 显示文字。
- 语言标签使用代码块 info 中的语言（大写 11px muted），跨语言时追加 `→ 切换到 Ruby` 提示（muted 小字）。

### 14.2 状态
| 状态 | 按钮呈现 | 说明 |
|---|---|---|
| idle（目标语言已缓存/就绪） | `[运行 ▷]` | 可点击 |
| idle（目标语言未下载） | `[下载并运行 ▷ 23 MB]` | Tooltip：“首次运行需下载 Ruby 运行时（23.4 MB）” |
| downloading | `[◌ 下载 38%]`（Loader2 spin + 百分比，取 `states[id].loaded/total`），按钮宽度固定避免抖动；旁边 `[取消]` ghost xs | 侧栏条目同步显示进度 |
| preparing / compile / link / running | `[◌ 运行中…]`，右侧出现 `[■ 停止]` ghost xs | 状态取 `runStore.status`（仅当本块为“当前运行来源”时显示） |
| done | `[✓ exit 0]` 2 秒后回到 idle | 形状区分，单色 |
| failed / crash | `[○ exit 1]`（空心圆）或 `[○ 编译失败]`，2 秒后回 idle；不自动消失的说明在终端 | — |
| download error | `[○ 下载失败 · 重试]` | 点击重试 |
| disabled — `norun` 块 | 无运行按钮，仅 `[复制]`；头部右侧 `仅供阅读` muted 文本 | — |
| disabled — 语言不支持 | 无运行按钮，`[复制]` 保留；标签旁 `不可运行` | 见 §14.4 |
| disabled — 页面未隔离（!crossOriginIsolated） | `[运行 ▷]` disabled，Tooltip 说明 | 与 IsolationGuard 一致 |
| 复制 | `[⧉ 复制]` → `[✓ 已复制]` 1.5s | Clipboard API；失败时选中代码并提示 ⌘C |

### 14.3 精确行为（点击「运行」）
1. **解析目标语言**：`blockLang = normalize(infoLang)`（映射表见 §14.6），得到运行时 id（如 `py → python`、`js → quickjs`、`ts → quickjs`、`c → clang`、`cpp|c++ → clangpp`、`php → php-cgi`、`sql|sqlite → sqlite`、`lua`、`go`、`rb|ruby → ruby`）。
2. **处理进行中的运行**：若 `runStore.running`：
   - 来源是同一代码块 → 视为“停止”（按钮已变为停止）。
   - 否则弹出确认（Popover，非阻塞）：“当前程序正在运行，停止并运行此示例？[停止并运行] [取消]”；设置项“不再询问”（localStorage `simplecode:learn:autoStop`）。确认后 `runStore.stop()` 并等待状态离开 running（≤1s）。
3. **切换语言**：若 `blockLang !== languageStore.selectedId` → `languageStore.select(blockLang)`（侧栏与编辑器随之切换；抽屉中的书**不切换**，保持当前阅读位置）。
4. **确保运行时**：`await languageStore.ensure(blockLang)`；期间按钮显示下载进度；返回 false → 按钮进入“下载失败 · 重试”，流程终止。
5. **备份编辑器**：`prev = editorStore.get(blockLang)`；若 `prev !== code` 且 `prev` 不是“本次会话由文档写入且未被修改”的内容，则写入 `localStorage["simplecode:backup:<lang>"] = { code: prev, at }`，并显示 Toast：“已用示例替换编辑器内容（Python） [撤销]”，8 秒；点击撤销 → `editorStore.set(lang, prev)`（若运行中先停止）。
6. **转译（TS）**：若 infoLang 为 `ts/typescript` → 懒加载 Sucrase，`transform(code, { transforms: ["typescript"] })`；失败 → 代码块下方显示单色错误框（行列信息），终止。编辑器里放**原始 TS 源码**还是转译结果？→ 放**转译后的 JS**（因为编辑器语言为 QuickJS/JavaScript，可直接再次运行），并在首行加注释 `// 由 TypeScript 转译（原始代码见文档）`。
7. **写入编辑器**：`editorStore.set(blockLang, finalCode)`（`CodeEditor` 已 watch store 变化同步到 Monaco model；光标置于开头，撤销栈：用 `model.pushEditOperations` 实现，使 ⌘Z 也能恢复 — 实现细节）。
8. **stdin 预填**：若块有 `stdin="..."` 且用户在块的 Collapsible 中勾选“使用样例输入”（默认：勾选），则 `runStore.run({ stdin })`：运行开始（phase=run）后 `pushStdin(stdin.replaceAll("\\n","\n"))`，并在终端回显该输入（灰色），然后 `pushEOF()`（可配置 `stdinEOF: true` 默认）。未勾选 → 正常交互输入。
9. **自动运行**：`runStore.run(opts)`；终端若折叠则自动展开（MainArea 已实现）；记录 `runSource = blockId` 供按钮显示状态。
10. **焦点**：运行开始后 `terminal.focus()`（便于直接输入）；桌面端抽屉**保持打开**（默认，可在抽屉菜单设置“运行后关闭抽屉”）；移动端（底部 Sheet）**先关闭** Sheet 再运行。
11. **结果**：按钮显示 `exit N`；若块有 `expect` → 运行结束后比对 `terminal.transcript` 是否包含 expect，块底部显示 `✓ 输出符合预期` / `○ 输出与预期不同 [查看差异]`（单色）。

### 14.4 边界情况
| 情况 | 处理 |
|---|---|
| 运行中再点同一块 | 按钮为「停止」，点击即 `stop()` |
| 运行中点其它块 | 确认停止（§14.3-2） |
| 目标语言正在下载（由侧栏触发） | 复用同一下载 Promise（`ensure` 已去重），按钮显示进度 |
| 用户在下载中取消 | 按钮回 idle，不改动编辑器 |
| TS 块 | Sucrase 去类型；不做类型检查；转译失败显示错误不运行 |
| info 语言未知/不支持（如 `rust`、`bash`、`text`、`json`、无语言） | 不显示运行按钮，只有复制；`text/console/output` 类块视为输出示例 |
| `norun` 块 | 只读，仅复制 |
| 多文件 C/C++（如 `main.c` + `util.h`） | v1 不支持多文件：作者需写成单文件（教程中用“单文件内模拟头文件”约定）；预留语法 `file="util.h" group="ex3"`：同组块合并为 WASI FS 多文件后编译（需要 runner 支持 `headlessRunFS` 式多文件 + clang 参数追加，列入 L5 后续）；v1 遇到 `group` 属性仅显示复制并提示“多文件示例请在本地运行” |
| 代码块需要 stdin 但未提供样例 | 正常运行，终端等待输入（焦点已在终端），块下提示“此示例需要输入” |
| 抽屉中所看书的语言 ≠ 块语言（如 SQL 书中的 Python 块） | 照常切换主语言；Toast 文案注明“已切换到 Python” |
| 编辑器内容为空或与块相同 | 不备份、不弹 Toast，直接运行 |
| 页面不支持 Clipboard API | 复制降级为选中代码 + 提示 |
| 极长代码块（> 200 行） | 正常写入；渲染时代码区 `max-h-[480px] overflow-auto` |

### 14.5 时序图
```mermaid
sequenceDiagram
  actor U as 用户
  participant CB as CodeBlock.vue
  participant H as useRunFromDoc()
  participant RS as runStore
  participant LS as languageStore
  participant ES as editorStore
  participant TP as transpile(Sucrase)
  participant T as terminal
  U->>CB: 点击 [运行 ▷]
  CB->>H: runFromDoc({ code, lang, blockId, stdin, expect })
  H->>H: resolveRuntime(lang) → runtimeId / 不支持则抛出
  alt RS.running
    alt 来源为同一 block
      H->>RS: stop() ; return
    else 其它来源
      H-->>U: 确认 “停止并运行？”
      U->>H: 确认
      H->>RS: stop() 并等待 idle
    end
  end
  opt runtimeId ≠ LS.selectedId
    H->>LS: select(runtimeId)
  end
  H->>LS: ensure(runtimeId)
  LS-->>CB: states[runtimeId] 进度（响应式）
  LS-->>H: true / false
  opt lang = ts
    H->>TP: transform(code)
    TP-->>H: js | error
  end
  H->>ES: get(runtimeId) → prev
  opt prev 需要备份
    H->>H: saveBackup(runtimeId, prev) + toast[撤销]
  end
  H->>ES: set(runtimeId, finalCode)
  H->>RS: run({ stdin, source: blockId })
  RS->>T: 清屏 / 输出 / 自动展开终端
  H->>T: focus()
  RS-->>H: 结束（exitCode / status）
  H->>H: expect 比对 terminal.transcript
  H-->>CB: RunFromDocResult
```

### 14.6 Store / API 契约（TypeScript）
```ts
// src/composables/useRunFromDoc.ts
export type DocLang =
  | "python" | "py" | "ruby" | "rb" | "js" | "javascript" | "ts" | "typescript"
  | "sql" | "sqlite" | "c" | "cpp" | "c++" | "php" | "lua" | "go";

export type RuntimeId = "python" | "ruby" | "quickjs" | "sqlite" | "clang" | "clangpp" | "php-cgi" | "lua" | "go";

export const DOC_LANG_TO_RUNTIME: Record<DocLang, RuntimeId> = {
  python: "python", py: "python", ruby: "ruby", rb: "ruby",
  js: "quickjs", javascript: "quickjs", ts: "quickjs", typescript: "quickjs",
  sql: "sqlite", sqlite: "sqlite", c: "clang", cpp: "clangpp", "c++": "clangpp",
  php: "php-cgi", lua: "lua", go: "go",
};

export interface RunFromDocOptions {
  blockId: string;            // `${book}/${chapter}#${index}`，用于按钮状态归属
  stdin?: string;             // 样例输入（已反转义）
  useStdin?: boolean;         // 默认 true（有 stdin 时）
  stdinEOF?: boolean;         // 预填后是否发送 EOF，默认 true
  expect?: string;            // 期望输出子串
  confirmStop?: () => Promise<boolean>; // 运行中时的确认回调（UI 注入）
  keepDrawerOpen?: boolean;   // 默认 desktop=true, mobile=false
}

export type RunFromDocResult =
  | { type: "unsupported"; lang: string }
  | { type: "cancelled" }                       // 用户取消停止/下载
  | { type: "download-failed"; error?: string }
  | { type: "transpile-error"; message: string; line?: number; column?: number }
  | { type: "finished"; status: "done" | "failed" | "crash" | "terminated"; exitCode?: number; matchedExpect?: boolean };

export function resolveRuntime(lang: string): RuntimeId | undefined;

export function useRunFromDoc(): {
  /** 当前由哪个代码块发起运行（用于按钮状态） */
  activeBlockId: Readonly<Ref<string | undefined>>;
  runFromDoc(code: string, lang: string, opts: RunFromDocOptions): Promise<RunFromDocResult>;
  stopFromDoc(blockId: string): void;
  undoLastReplace(): void;   // Toast [撤销] 调用
};
```
需要对现有 store 做的**最小扩展**（实现阶段）：
```ts
// stores/run.ts
run(opts?: { stdin?: string; stdinEOF?: boolean; source?: string }): Promise<void>;
readonly source: Ref<string | undefined>;      // 当前运行来源（"editor" | blockId）
// stores/editor.ts（无破坏）
set(id: string, code: string, opts?: { origin?: "user" | "doc"; blockId?: string }): void;
lastDocWrite(id: string): { blockId: string; code: string } | undefined; // 判断是否需要备份
```
- `useRunFromDoc` 是唯一入口；CodeBlock 不直接调用 store。
- 备份 key：`simplecode:backup:<runtimeId>` → `{ code, at, reason: "doc-run" }`，只保留最近 1 份；Toast 撤销后删除。

### 14.7 Markdown 代码块 info string 语法
```
```<lang> [run|norun] [stdin="..."] [expect="..."] [title="..."] [file="..." group="..."] [eof=false]
```
| 片段 | 含义 | 默认 |
|---|---|---|
| `<lang>` | 必填；见 §14.6 映射；未知语言 → 不可运行 | — |
| `run` / `norun` | 是否显示运行按钮 | 可运行语言默认 `run` |
| `stdin="Ada\n42"` | 样例输入，`\n` 表示换行，`\"` 转义引号 | 无 |
| `expect="你好，Ada"` | 期望输出子串（测试与“输出符合预期”提示） | 无 |
| `title="猜数字"` | 头部显示标题（替代语言标签旁） | 无 |
| `eof=false` | 预填 stdin 后不发送 EOF（用于还需继续交互的示例） | `true` |
| `file`/`group` | 多文件示例（v1 仅复制，见 §14.4） | — |
示例：
````markdown
```python run stdin="Ada" expect="你好，Ada！" title="问候"
name = input("名字？")
print(f"你好，{name}！")
```
````
解析：自写 `parseFenceInfo(info: string): { lang, attrs }`（支持带引号值与转义），单元测试覆盖。

### 14.8 无障碍与键盘
- 按钮均为 `<button>`，`aria-label`：复制 → “复制 Python 代码”；运行 → “运行此 Python 示例（会替换编辑器内容）”；下载中 `aria-busy="true"` + `aria-valuenow`。
- 代码块容器 `role="group" aria-label="代码示例 3：问候"`，`tabindex="0"`；焦点在代码块上时：`⌘/Ctrl+Enter` = 运行，`⌘/Ctrl+Shift+C` = 复制，`Esc` = 停止（运行中）。
- 状态变化通过 `aria-live="polite"` 区域播报（“正在下载 Ruby 38%”“运行结束，退出码 0”“已替换编辑器内容，可撤销”）。
- 焦点管理：运行后焦点移到终端（xterm `textarea`）；Toast 的“撤销”可用 `⌘/Ctrl+Z`（焦点在抽屉内时）触发；关闭抽屉后焦点回到 LearnButton。
- 对比度：所有前景/背景组合 ≥ 4.5:1（#737373 on #FFFFFF = 4.74:1 ✓；#A3A3A3 on #0A0A0A ≈ 8.3:1 ✓）。

### 14.9 测试
**单元（Vitest）**：`parseFenceInfo`（引号、转义、未知属性）、`resolveRuntime`（全部别名、未知语言）、`useRunFromDoc` 的分支（mock stores）：跨语言切换、ensure 失败、运行中确认/取消、备份与撤销、TS 转译成功/失败、stdin 预填调用顺序。
**E2E（Playwright，复用 tests/smoke.mjs 的 preview 服务器与系统 Chrome）** `tests/learn.spec.mjs`：
1. 打开应用 → 点击 `[data-testid=learn-button]` → 抽屉出现，标题含 “Python 101”。
2. 打开第 3 章 → 定位第 1 个 `[data-testid=doc-code-block]`，读取其 `data-code`。
3. 点击块内 `[data-testid=doc-run]` → 等待 `[data-testid=run-status][data-status=done]`。
4. 断言：`__simplecodeEditor.getValue() === data-code`；`__simplecodeTerminal.transcript` 包含块的 `data-expect`；终端可见。
5. 跨语言：在 SQL 书中点 Python 块 → 断言侧栏选中 Python、编辑器语言为 python、输出匹配。
6. 下载状态：清除缓存后点 Ruby 块 → 断言按钮出现 `下载` 百分比 → 最终 done。
7. 备份/撤销：先在编辑器输入自定义代码 → 运行文档块 → 点击 Toast「撤销」→ 编辑器恢复为自定义代码。
8. 运行中冲突：运行 Python 死循环块 → 点击另一块 → 出现确认 → 确认后前一运行状态为 terminated、新块 done。
9. `norun` 块无 `doc-run` 按钮；未知语言块无运行按钮。
10. 单色校验：对抽屉截图（浅/深）做像素检查——所有像素 R=G=B（容差 ±2，排除抗锯齿可放宽为 99% 像素满足）。
**文档全量（docs-smoke）**：见 §9：遍历所有 `run` 块，exit 0 且 expect 命中。
