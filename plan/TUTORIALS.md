# SimpleCode 教程扩充计划（草案）

> 基于仓库 `linkxzhou/SimpleCode` 浅克隆（2026-10-20，UTC+8）。评分和星标数是 2026-10-20 实际抓取到的值：豆瓣数据来自 book.douban.com 条目页，星标数来自 GitHub API。没看到的数字一律写「未核实」。本草案未推送任何内容。

## 0. 总则

### 0.1 目录与 schema
- 允许的 docs/ 顶层目录由 `scripts/docs/tree.ts` 的 `isKnownDocsDir` 决定：`_` 前缀目录、`en`、`leetcode`，以及 `src/docs/runtime.ts` 中 `isBookId` 认可的书目 ID。新增书目必须先在 runtime 注册，否则 docs schema 校验会失败。
- 中文正文放在 `docs/<book>/NN-slug.md`，英文对应版放在 `docs/en/<book>/NN-slug.md`，文件名一一对应。
- frontmatter 沿用现有字段：`language`、`chapter`、`title`、`level`（beginner / intermediate / advanced）、`minutes`、`goals`、`sources`（引用 `docs/sources.yaml` 中的键）、`updated`。
- 新资料必须先登记到 `docs/sources.yaml`，写明 `license`，以及 `adapt: true/false`。

### 0.2 中英双语要求
- 每一章都要同时提交 zh 和 en 两个版本，章节号、标题含义、代码块数量与顺序一致，代码完全相同。
- 不允许只有单语的章节合入；`index.md` 两种语言同步更新。

### 0.3 代码规则
- 代码块内容一律 ASCII（`tests/docs-ascii.test.ts` 会检查），中文说明只写在正文里，代码注释也用英文。
- 每个示例都必须能在浏览器运行时里直接跑通：WASI 编译的 C/C++/Lua/Ruby/PHP/SQLite/wasi-sh，Pyodide（Python/NumPy/DL），浏览器内 Rust/Java/Go 工具链，以及 v86 Linux。不依赖网络、真实文件系统以外的资源、多进程或 GUI。需要输入的示例要提供样例输入。
- 运行时做不到的主题（例如真实 socket、fork、MySQL 服务、浏览器外线程），只用文字讲解，或者用模拟方式替代，并在正文里注明。
- 同一本书里不允许出现重复的代码块（`docs-length.test.ts` 的 fenceKey 去重）。

### 0.4 版权原则
- 正文必须原创。只有 `adapt: true` 的资料（CC-BY、CC-BY-SA、MIT、Apache、BSD、公有领域）可以改编代码示例，并要在 `sources` 中署名；CC-BY-SA 改编的内容需保持同协议说明。
- `adapt: false` 的资料（All-rights-reserved、NC、ND、协议不明，以及所有商业图书）只能用作目录结构参考，或放进「延伸阅读」链接，不得搬运原文、译文或示例代码。
- 豆瓣上的图书全部是版权书，只用来参考大纲和难度梯度。

## 1. 现状盘点（章节数不含 index.md；体量为中文版平均每章字节数，含 frontmatter）

| 书目 | 章节 | 平均体量 | level 分布 | en 版 | 主要缺口 |
|---|---|---|---|---|---|
| python | 27 | ~1.0 KB | 全部 beginner | 齐 | 无进阶：生成器协议、dataclass、typing、上下文管理器、迭代器协议深入、标准库（collections/itertools/functools）、异步、测试 |
| rust | 27 | ~1.2 KB | 12/10/5 | 齐 | trait 深入、智能指针细节、错误处理生态、迭代器适配器、unsafe、宏进阶、测试、性能 |
| go | 28 | ~1.55 KB | 13/8/8 | 齐 | context、select/channel 模式、sync 包、测试/基准、反射、标准库实践 |
| java | 27 | ~1.7 KB | 全部 beginner | 齐 | 泛型、集合框架全貌、Lambda/Stream、Optional、record/sealed、并发、IO/NIO |
| lua | 21 | ~0.9 KB | 全部 beginner | 齐 | 闭包/upvalue、元表进阶、环境 _ENV、协程模式、性能与惯用法 |
| c | 24 | ~1.05 KB | 全部 beginner | 齐 | 位运算、多维数组与指针算术、函数指针、动态数据结构、可变参数、未定义行为、C11 |
| cpp | 38 | ~1.2 KB | 全部 beginner | 齐 | 现代 C++（auto/范围 for/lambda/智能指针/移动语义/RAII）、STL 算法、constexpr、模板进阶 |
| js (含 TS) | 29 | ~1.0 KB | 全部 beginner | 齐 | 闭包、原型链、模块、迭代器/生成器、Map/Set、类、正则、TS 泛型与工具类型 |
| sqlite | 25 | ~1.05 KB | 全部 beginner | 齐 | 窗口函数、CTE/递归 CTE、UPSERT、JSON 函数、触发器、EXPLAIN QUERY PLAN、范式与建模 |
| shell | 20 | ~0.9 KB | 全部 beginner | 齐 | 参数展开、case、here-doc、getopts、trap、子 shell、文本处理组合；需对照 wasi-sh 能力 |
| linux (v86) | 29 | ~1.1 KB | 10/10/9 | 齐 | find/xargs、sed/awk、进程与信号、环境变量、tar/压缩、网络命令（视镜像能力） |
| numpy | 10 | ~1.2 KB | 8/2 | 齐 | ufunc/聚合、布尔索引、结构化数组、einsum、性能向量化案例 |
| dl | 10 | ~1.7 KB | 2/6/2 | 齐 | 正则化/Dropout、BatchNorm、RNN、Transformer 小模型、训练技巧 |
| php | 33 | ~1.0 KB | 全部 beginner | 齐 | 现代 PHP 8（类型声明、match、enum、readonly、属性）、生成器、闭包；「mysql」「cookie」「forms」章需核对浏览器运行时能否真正运行 |
| ruby | 22 | ~0.9 KB | 全部 beginner | 齐 | 元编程、Enumerable 进阶、Proc/lambda、Struct、Comparable/模块混入、惯用法 |
| leetcode | 数据目录 | — | — | en 有 3 个文件 | 不在本计划范围，保持 `sources.lock.json` / LICENSES 机制 |

> 说明：任务描述里说 DeepLearning 有 11 章，实际是 10 章正文加 index.md（NumPy 同样如此）。

## 2. 推荐资料（实测数据）

| 书目 | 资料 | 级别 | 评分 / 星标 | 协议 | 用法 |
|---|---|---|---|---|---|
| python | 《Python编程：从入门到实践》 book.douban.com/subject/26829016 | 入门 | 豆瓣 9.1 | 版权书 | 仅参考大纲 |
| python | 《流畅的Python》 book.douban.com/subject/27028517 | 进阶 | 豆瓣 9.4 | 版权书 | 仅参考大纲 |
| python | jackfrued/Python-100-Days | 入门→进阶 | 187,317★ | GitHub 未声明协议 | 仅参考大纲 |
| python | A Byte of Python（已登记） | 入门 | 未核实 | CC-BY-SA-4.0 | 可改编 |
| rust | rust-lang/book | 入门 | 18,436★ | MIT/Apache-2.0 双协议（GitHub 显示 NOASSERTION，以仓库 LICENSE 为准） | 可改编（核对后） |
| rust | rust-lang/rust-by-example | 入门→进阶 | 8,134★ | Apache-2.0 | 可改编 |
| rust | sunface/rust-course（Rust 语言圣经） | 进阶 | 31,043★ | GitHub 未声明协议 | 仅参考大纲 |
| rust | 《Rust权威指南》 subject/35081743；《Rust程序设计（第2版）》 subject/36547630 | 入门 / 进阶 | 豆瓣 8.6 / 9.1 | 版权书 | 仅参考大纲 |
| go | 《Go程序设计语言》 subject/27044219 | 入门→进阶 | 豆瓣 8.7 | 版权书 | 仅参考大纲 |
| go | quii/learn-go-with-tests | 进阶（测试） | 23,912★ | MIT | 可改编 |
| go | unknwon/the-way-to-go_ZH_CN | 入门 | 35,002★ | GitHub 未声明协议 | 仅参考大纲 |
| go | Go by Example（已登记） | 入门 | 未核实 | CC-BY-3.0 | 可改编 |
| java | 《Java核心技术·卷I（第12版）》 subject/35920145 | 入门 | 豆瓣 9.9（评价人数少） | 版权书 | 仅参考大纲 |
| java | 《Effective Java（第3版）》 subject/30412517 | 进阶 | 豆瓣 8.9 | 版权书 | 仅参考大纲 |
| java | Snailclimb/JavaGuide | 进阶 | 159,156★ | Apache-2.0 | 可改编（需署名） |
| java | doocs/advanced-java | 进阶 | 79,157★ | CC-BY-SA-4.0 | 可改编（同协议） |
| lua | 《Lua程序设计（第4版）》 subject/30262035 | 入门→进阶 | 豆瓣 9.0 | 版权书 | 仅参考大纲 |
| lua | Lua 5.4 Reference Manual（已登记） | 进阶 | — | Lua.org | 仅参考 |
| lua | Learn X in Y minutes — Lua（已登记） | 入门 | 未核实 | CC-BY-SA-3.0 | 可改编 |
| c | 《C程序设计语言》 subject/1139336 | 入门 | 豆瓣 9.4 | 版权书 | 仅参考大纲 |
| c | 《C Primer Plus（第6版）》 subject/26792521 | 入门 | 豆瓣 9.4 | 版权书 | 仅参考大纲 |
| c | 《深入理解计算机系统》 subject/1230413 | 进阶 | 豆瓣 9.5 | 版权书 | 仅参考大纲 |
| cpp | 《C++ Primer 中文版（第5版）》 subject/25708312 | 入门 | 豆瓣 9.4 | 版权书 | 仅参考大纲 |
| cpp | 《Effective C++》 subject/1842426 | 进阶 | 豆瓣 9.5 | 版权书 | 仅参考大纲 |
| cpp | changkun/modern-cpp-tutorial | 进阶 | 25,904★ | MIT（代码；正文协议以仓库为准） | 代码可改编 |
| cpp | AnthonyCalandra/modern-cpp-features | 进阶 | 21,912★ | MIT | 可改编 |
| cpp | isocpp/CppCoreGuidelines | 进阶 | 45,394★ | MIT 风格（已登记 adapt:false） | 仅参考 |
| js | 《JavaScript高级程序设计（第4版）》 subject/35175321 | 入门→进阶 | 豆瓣 8.4 | 版权书 | 仅参考大纲 |
| js | getify/You-Dont-Know-JS | 进阶 | 184,830★ | CC-BY-NC-ND（GitHub 显示 NOASSERTION） | 仅参考 |
| js | javascript-tutorial/en.javascript.info | 入门→进阶 | 25,511★ | CC-BY-NC-SA（已登记 adapt:false） | 仅参考 |
| js | MDN JS Guide / TS Handbook（已登记） | 入门→进阶 | — | CC-BY-SA-2.5 / CC-BY-4.0 | 可改编 |
| sqlite | 《SQL必知必会（第5版）》 subject/35167240 | 入门 | 豆瓣 9.0 | 版权书 | 仅参考大纲 |
| sqlite | SQLite SQL Language Reference（已登记） | 进阶 | — | 公有领域 | 可改编 |
| sqlite | enochtangg/quick-SQL-cheatsheet | 入门 | 5,478★ | MIT | 可改编 |
| shell | 《Linux命令行与shell脚本编程大全（第4版）》 subject/35933905 | 入门→进阶 | 豆瓣 9.0 | 版权书 | 仅参考大纲 |
| shell | dylanaraps/pure-bash-bible | 进阶 | 41,712★ | MIT | 可改编（需确认 wasi-sh 支持） |
| shell | koalaman/shellcheck | 进阶（规范） | 40,200★ | GPL-3.0 | 只链接，不改编 |
| linux | 《鸟哥的Linux私房菜》 subject/4889838 | 入门 | 豆瓣 9.0 | 版权书 | 仅参考大纲 |
| linux | jlevy/the-art-of-command-line | 进阶 | 162,561★ | CC-BY-SA-4.0（GitHub 未识别，以 README 为准，需核对） | 核对后可改编 |
| linux | tldr-pages/tldr | 速查 | 64,001★ | CC-BY-4.0（GitHub 显示 NOASSERTION，需核对） | 核对后可改编 |
| numpy | rougier/numpy-100 | 入门→进阶 | 14,623★ | MIT | 可改编 |
| numpy | 《Python数据科学手册》 subject/27667378；《利用Python进行数据分析》 subject/25779298 | 入门 | 豆瓣 9.2 / 8.6 | 版权书 | 仅参考大纲 |
| numpy | rougier/from-python-to-numpy | 进阶 | 2,157★ | 未核实（GitHub NOASSERTION） | 仅参考 |
| dl | d2l-ai/d2l-zh（动手学深度学习） | 入门→进阶 | 81,941★ | Apache-2.0（代码）；正文协议需核对 | 代码可改编 |
| dl | karpathy/micrograd；karpathy/nn-zero-to-hero | 入门 / 进阶 | 17,976★ / 24,880★ | MIT | 可改编 |
| dl | 《深度学习》（花书） subject/27087503 | 进阶理论 | 豆瓣 8.4 | 版权书 | 仅参考大纲 |
| php | 《PHP和MySQL Web开发（第4版）》 subject/3549421 | 入门 | 豆瓣 8.4 | 版权书 | 仅参考大纲 |
| php | PHP Manual（已登记） | 进阶 | — | CC-BY-3.0 | 可改编 |
| php | codeguy/php-the-right-way | 进阶 | 9,251★ | CC-BY-NC-SA-3.0 | 仅参考 |
| ruby | 《Ruby编程语言》 subject/3329887 | 入门→进阶 | 豆瓣 8.7 | 版权书 | 仅参考大纲 |
| ruby | Why's (Poignant) Guide / LXIY Ruby（已登记） | 入门 | 未核实 | CC-BY-SA | 可改编 |
| ruby | edgecase/ruby_koans | 进阶练习 | 823★ | CC-BY-NC-SA-3.0（已登记） | 仅参考 |

注：豆瓣页面抓取时显示的评价人数偏少（可能未登录导致截断），所以表里只写评分，不写人数。GitHub 显示 NOASSERTION 或未声明协议的仓库，改编前必须人工核对 LICENSE 文件；无法确认的一律按 `adapt: false` 处理。

## 3. 目标大纲

现有章节保留，作为「快速入门」。新增章节接在现有编号之后，level 标注为 intermediate 或 advanced，每章 6–12 分钟。

### python（27 → 39，+12，进阶）
28 推导式与生成器进阶 / 29 迭代器协议 / 30 上下文管理器 with / 31 dataclass / 32 typing 类型注解 / 33 collections / 34 itertools 与 functools / 35 魔术方法 / 36 属性与描述符 / 37 asyncio 基础（Pyodide 事件循环）/ 38 unittest 与 doctest / 39 小项目：文本统计

### rust（27 → 37，+10）
28 trait 进阶（关联类型、默认实现）/ 29 trait 对象与 dyn / 30 迭代器适配器 / 31 Box、Rc、RefCell 深入 / 32 错误处理与 ? 组合 / 33 模式匹配进阶 / 34 声明宏进阶 / 35 测试 #[test] / 36 unsafe 入门 / 37 小项目：命令解析器

### go（28 → 36，+8）
29 select 与超时 / 30 sync 包与 WaitGroup / 31 context / 32 并发模式（流水线、worker pool）/ 33 testing 与基准 / 34 反射 reflect / 35 strings/strconv/sort 实践 / 36 小项目：词频统计

### java（27 → 39，+12）
28 泛型 / 29 集合框架全貌 / 30 Iterator 与 Comparable / 31 Lambda / 32 Stream API / 33 Optional / 34 record 与 sealed / 35 内部类与匿名类 / 36 多线程基础 / 37 并发工具 / 38 Files 与 NIO / 39 小项目：成绩管理

### lua（21 → 29，+8）
22 闭包与 upvalue / 23 可变参数与 table.pack / 24 元方法全表 / 25 _ENV 与沙箱 / 26 协程生产者消费者 / 27 string 模式匹配进阶 / 28 性能与惯用法 / 29 小项目：状态机

### c（24 → 34，+10）
25 位运算 / 26 多维数组与指针算术 / 27 函数指针与回调 / 28 链表 / 29 栈与队列 / 30 可变参数 stdarg / 31 qsort/bsearch / 32 未定义行为 / 33 C11 新特性 / 34 小项目：简易计算器

### cpp（38 → 50，+12）
39 auto 与范围 for / 40 lambda / 41 智能指针 / 42 RAII / 43 移动语义 / 44 STL 算法 / 45 map/unordered_map / 46 string_view 与 optional / 47 constexpr / 48 模板进阶 / 49 异常安全 / 50 小项目：库存系统

### js（29 → 41，+12）
30 闭包 / 31 原型与原型链 / 32 class / 33 模块 ESM / 34 迭代器与生成器 / 35 Map/Set/WeakMap / 36 解构与展开 / 37 正则表达式 / 38 事件循环与微任务 / 39 TS 泛型 / 40 TS 工具类型 / 41 小项目：待办列表（纯逻辑）

### sqlite（25 → 34，+9）
26 CTE / 27 递归 CTE / 28 窗口函数 / 29 UPSERT / 30 JSON 函数 / 31 触发器 / 32 EXPLAIN QUERY PLAN 与索引 / 33 范式与建模 / 34 小项目：图书借阅库

### shell（20 → 28，+8，需先做 wasi-sh 能力表）
21 参数展开 ${} / 22 case / 23 here-doc / 24 getopts / 25 trap 与退出 / 26 子 shell 与命令替换 / 27 字符串处理惯用法 / 28 小项目：日志统计脚本

### linux（29 → 37，+8，取决于 v86 镜像里的工具）
30 find / 31 xargs / 32 sed / 33 awk / 34 sort/uniq/wc / 35 进程与信号 / 36 环境变量 / 37 tar 与压缩

### numpy（10 → 16，+6）
11 ufunc 与聚合 / 12 布尔与花式索引 / 13 排序与搜索 / 14 einsum / 15 结构化数组 / 16 向量化性能案例

### dl（10 → 15，+5）
11 正则化与 Dropout / 12 BatchNorm / 13 RNN / 14 迷你 Transformer / 15 训练技巧（学习率、早停）

### php（33 → 41，+8；并审查现有 23/28/33 章能否运行）
34 类型声明与严格模式 / 35 match / 36 enum / 37 readonly 与构造器提升 / 38 闭包与箭头函数 / 39 生成器 / 40 trait / 41 小项目：CSV 报表

### ruby（22 → 30，+8）
23 Proc 与 lambda / 24 Enumerable 进阶 / 25 Struct / 26 模块混入与 Comparable / 27 method_missing / 28 define_method 元编程 / 29 冻结与对象模型 / 30 小项目：DSL

合计：新增约 136 章（zh/en 各一份，共约 272 个文件）。

## 4. 优先级与阶段

- **P0 准备（第 1 周）**：把本表中 adapt 资料补登到 `sources.yaml`，人工核对 NOASSERTION 协议；整理 shell（wasi-sh）、linux（v86）、php 各运行时的能力表；审查 php 的 forms/cookie/mysql 章节。
- **阶段一（P1，2–3 周）**：Python、JavaScript/TS、Java。这三本目前全是 beginner、用户面最广，而且运行时成熟。
- **阶段二（P2，2–3 周）**：C++、C、SQLite。C/C++ 侧重现代特性，SQLite 进阶查询价值高、资料是公有领域可改编。
- **阶段三（P3，2 周）**：Go、Rust（已有部分进阶内容，补齐即可），NumPy、DL。
- **阶段四（P4，1–2 周）**：Lua、Ruby、PHP、Shell、Linux（受运行时能力限制，按能力表裁剪）。

## 5. 验收标准

1. `bash ./build.sh test` 全部通过，包括 `tests/docs-unit.test.ts`（docs schema / 目录白名单）、`docs-length.test.ts`（章节体量、代码去重、zh/en 对应）、`docs-ascii.test.ts`（代码 ASCII）、`samples-locale.test.ts`、`i18n-unit.test.ts`。
2. `node --experimental-strip-types tests/docs-smoke.mjs` 及 `npm run smoke` 通过：每个新增代码块都能在浏览器运行时里跑出预期输出。
3. `npm run typecheck` 通过；`isKnownDocsDir` 不新增未注册目录。
4. 每章都有 zh 和 en 两版，frontmatter 完整，`sources` 键都在 `sources.yaml` 里，`adapt: false` 资料只出现在延伸阅读里。
5. 人工抽查：对照参考书，抽 10% 的新章节确认不存在原文或译文搬运。

## 6. P0（仅 P1 所需）与 P1 落地

2026-10-20。P0 没有做 shell / linux / php 的能力表，那些留到 P4。这一轮只把 Python、JavaScript、Java 会引用的资料补进 `docs/sources.yaml`。

`adapt: true` 且本章可以署名引用：已有的 `byte-of-python`、`lxiy-python`、`mdn-js`、`ts-handbook`、`lxiy-js`，以及新登记的 `javaguide`（Apache-2.0）、`advanced-java`（CC-BY-SA-4.0）。章节示例是按练习场重写的，没有摘录这两份仓库的段落；若以后改编 `advanced-java` 的原文，衍生文字保持 CC-BY-SA-4.0。

`adapt: false`，只出现在延伸阅读链接里：`python-100-days`（仓库未声明许可证）、`fluent-python`、`python-crash-course`、`think-python`、`automate`、`ydkjs`（CC-BY-NC-ND）、`javascript-info`、`eloquent-js`、`js-professional`、`java-core-vol1`、`effective-java`。

运行时边界（写进可运行块之前在页面里试过）：

- Python 是 WASI CPython 3.11。`asyncio.run` 在收尾 `_UnixSelectorEventLoop._ssock` 上失败，协程用一个只 `send` 的小驱动器。`dataclass`、`typing`、`collections`、`itertools`、`functools`、`unittest`、`doctest` 可以跑。
- QuickJS 单文件脚本。`import` 加载不到邻居文件。`queueMicrotask` 未定义。`setTimeout` 会把这次运行挂住。`Promise.then`、生成器、`Map` / `WeakMap`、`class` 可以跑。TypeScript 经 Sucrase 去类型。
- Java 是 TeaVM。泛型、`HashSet`、`LinkedList`、lambda、`Stream`、`Optional`、`record`、`sealed`、内部类、`Thread.join`、`AtomicInteger` 可以跑。两条线程都 `start` 后再 `join` 时，宿主可能在打印前结束。`CountDownLatch` 没有这个类。`String.getBytes` 会带上 Wasm GC 不接受的 `ByteBuffer`。`java.nio` 与真实文件仍是 `norun`。

新章（中英同名文件，接在原编号后面）：

- Python 28–39：`28-comp-adv` 推导式进阶、`29-iter-proto` 迭代器协议、`30-with` 上下文管理器、`31-dataclass`、`32-typing` 类型注解、`33-collections`、`34-itertools`、`35-magic` 魔术方法、`36-descriptor` 属性与描述符、`37-asyncio` 协程、`38-unittest`、`39-textstat` 文本统计。
- JavaScript 30–41：`30-closure` 闭包、`31-prototype` 原型、`32-class`、`33-modules` 模块、`34-generator` 迭代器与生成器、`35-map-set`、`36-destructure` 解构与展开、`37-regex` 正则、`38-event-loop` 微任务、`39-ts-generic` 泛型、`40-ts-utility` 工具类型、`41-todo` 待办列表。
- Java 28–39：`28-generic` 泛型、`29-collections` 集合、`30-iterator`、`31-lambda`、`32-stream`、`33-optional`、`34-record` record 与 sealed、`35-inner` 内部类、`36-thread` 线程、`37-concurrent` 并发工具、`38-nio` 文件与内存缓冲、`39-grades` 成绩小项目。

## 7. P2 落地

2026-10-20。C、C++、SQLite 的进阶章接在原编号后面。中英同名文件。`renderDocs` 是 `docs: 904 chapters, 2706 runnable blocks`。

`adapt: true`：已有的 `cppreference`、`sqlite-lang`，以及新登记的 `modern-cpp-tutorial`（MIT）、`modern-cpp-features`（MIT）、`quick-sql`（MIT）。示例按练习场重写，没有摘录这些仓库的段落。

`adapt: false`，只出现在延伸阅读链接里：`kr-c`、`c-primer-plus`、`csapp`、`cpp-primer`、`effective-cpp`、`sql-must-know`。

运行时边界（写进可运行块之前在页面里试过）：

- C 是 clang 8，默认 C11。位运算、多维数组、函数指针、`malloc` 链表、数组上的栈和队列、`stdarg`、`qsort` / `bsearch`、`_Static_assert`、`_Generic`、匿名结构体、`_Alignof`、`sscanf` 可以跑。有符号溢出和释放后使用标 `norun`。
- C++ 是同一份 clang 的 C++14（`__cplusplus` 为 201402）。`auto`、范围 for、lambda、`unique_ptr`、`make_unique`、移动构造、`map`、`unordered_map`、`string_view`、`constexpr`（含循环）、函数特化、参数包、非类型模板参数可以跑。`std::sort` 链接缺少 `__lttf2`。`throw` 因异常被关掉而不能编译。`shared_ptr` 会让这份 clang 在代码生成阶段崩溃。`std::optional` 要 C++17，头文件在这个标准下不声明它。
- SQLite 是 3.26.0。CTE、递归 CTE、`ROW_NUMBER` / `RANK` / `SUM() OVER`、`ON CONFLICT`、触发器、`RAISE(IGNORE)`、`EXPLAIN QUERY PLAN` 可以跑。JSON1 没编进去，`json` 和 `json_extract` 标 `norun`。

新章：

- C 25–34：`25-bits` 位运算、`26-array2d` 多维数组、`27-fnptr` 函数指针、`28-list` 链表、`29-stackq` 栈与队列、`30-stdarg` 可变参数、`31-qsort`、`32-ub` 未定义行为、`33-c11`、`34-calc` 小计算器。
- C++ 39–50：`39-auto`、`40-lambda`、`41-unique`、`42-raii`、`43-move`、`44-algo`、`45-map`、`46-view` string_view、`47-constexpr`、`48-tmpl`、`49-safety`、`50-stock` 库存。
- SQLite 26–34：`26-cte`、`27-recur`、`28-window`、`29-upsert`、`30-json`、`31-trigger`、`32-explain`、`33-normal`、`34-library`。
