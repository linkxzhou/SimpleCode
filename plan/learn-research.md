# Learn 101 调研笔记（原始）

> 2026-10-15。链接以 `curl -L` 实测（HTTP 状态码列于括号内）；许可证来自项目 README/LICENSE 实际抓取（标 ✔）或已知信息未本次核实（标 ⚠️）。
> 原则：**只有 CC BY / CC BY-SA / MIT / 公有领域 / CC0 代码可“改编”**（须署名，SA 需同协议）；**NC / ND / 版权保留**的资料**只链接、只参考结构**，绝不逐字复制。所有章节文本由我们用中文原创撰写。

## 搜索过程
- Web 搜索 + 直接抓取官方站点 / GitHub README / LICENSE。
- X（`search_posts_all`，查询 “little book / getting started / best free book” × golang/lua/ruby/python，19 条）：结果多为个人入门帖与课程广告（如 #LearnInPublic Python 入门系列），**无高价值新资料**，仅印证“input()/类型转换/变量”这类入门话题顺序；不作为引用来源。
- 资深实践文章：Peter Norvig《Teach Yourself Programming in Ten Years》(200, https://norvig.com/21-days.html) —— 指导“少量、反复、可运行练习”的课程设计理念。

## 通用
| 资料 | 链接 | 状态 | 许可证 | 用途 |
|---|---|---|---|---|
| Learn X in Y minutes | https://learnxinyminutes.com/ ・ 源码 https://github.com/adambard/learnxinyminutes-docs | 200/200 | CC BY-SA 3.0 ✔ | 各语言速览的结构参考；可改编（署名+SA） |
| Exercism tracks | https://exercism.org/tracks ・ https://github.com/exercism/python | 200/200 | MIT（习题仓库）⚠️ | 练习题思路 |
| Rosetta Code | https://rosettacode.org/ | 403（反爬） | GFDL 1.2 ⚠️ | 仅链接 |

## Python
| 资料 | 链接 | 状态 | 许可证 |
|---|---|---|---|
| 官方 Tutorial | https://docs.python.org/3/tutorial/ | 200 | PSF License（文档）⚠️ |
| Think Python 3e (Allen Downey) | https://greenteapress.com/wp/think-python-3rd-edition/ | 200 | CC BY-NC-SA 4.0 ⚠️ → 仅链接 |
| A Byte of Python | https://python.swaroopch.com/ | 200 | CC BY-SA 4.0 ⚠️ |
| Automate the Boring Stuff | https://automatetheboringstuff.com/ | 200 | CC BY-NC-SA 3.0 ⚠️ → 仅链接 |
运行时限制：CPython 3.11 WASI；无 `pip`、无网络、无线程（`threading` 导入可但不能真正并行 ⚠️）、无 `subprocess`；标准库纯 Python 部分可用；`input()` 交互可用。

## Ruby
| 资料 | 链接 | 状态 | 许可证 |
|---|---|---|---|
| Ruby in Twenty Minutes | https://www.ruby-lang.org/en/documentation/quickstart/ | 200 | ruby-lang.org 内容 ⚠️（链接） |
| Ruby Koans | https://www.rubykoans.com/ ・ https://github.com/edgecase/ruby_koans | 200/200 | CC BY-NC-SA 3.0 ✔ → 仅链接/借鉴“公案”形式 |
| Why's (Poignant) Guide to Ruby | https://poignant.guide/ | 200 | CC BY-SA 2.5 ⚠️ |
| The Little Book of Ruby (Huw Collingbourne) | 原站 huwcollingbourne.com 本次请求失败（000） | — | 版权保留，免费分发 ⚠️ → 仅提及 |
运行时：Ruby 3.2 WASI；无 gem 安装、无 socket、无 fork/Thread 并行；`gets` 可交互。

## JavaScript / TypeScript（QuickJS）
| 资料 | 链接 | 状态 | 许可证 |
|---|---|---|---|
| The Modern JavaScript Tutorial | https://javascript.info/ ・ https://github.com/javascript-tutorial/en.javascript.info | 200/200 | CC BY-NC-SA 4.0 ⚠️ → 仅链接 |
| Eloquent JavaScript 4e | https://eloquentjavascript.net/ | 200 | CC BY-NC 3.0 ⚠️ → 仅链接 |
| MDN JavaScript Guide | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide | 200 | 文本 CC BY-SA 2.5，代码 CC0 ⚠️ |
| TypeScript Handbook | https://www.typescriptlang.org/docs/handbook/intro.html ・ https://github.com/microsoft/TypeScript-Website | 200/200 | 文档 CC BY 4.0 ⚠️ |
| Sucrase（TS → JS 转译器，浏览器内） | https://github.com/alangpierce/sucrase | 200 | MIT ⚠️ |
运行时：QuickJS（wasmedge 版）：无 DOM、无 `fetch`、无 `setTimeout`? ⚠️（需实测；wasmedge-quickjs 有事件循环实现）、`console.log` 可用；ES2020 语法；**stdin 交互能力有限 ⚠️**。TS 需在主线程/Worker 用 Sucrase 或 TypeScript `transpileModule` 去类型后交给 QuickJS（无类型检查）。

## SQL（SQLite）
| 资料 | 链接 | 状态 | 许可证 |
|---|---|---|---|
| SQLBolt | https://sqlbolt.com/ | 200 | 版权保留 → 仅链接 |
| Select Star SQL | https://selectstarsql.com/ | 200 | ⚠️ 未确认 → 仅链接 |
| SQLite 官方 SQL 语法 | https://www.sqlite.org/lang.html ・ https://www.sqlite.org/copyright.html | 200/200 | Public Domain ✔（可改编） |
运行时：SQLite 3.26（2018）+ `-batch` + 自动 EOF：**无窗口函数之外的新特性？**（3.25 起支持窗口函数，3.26 可用；`RETURNING`(3.35)、`STRICT`(3.37)、`->>` JSON 运算符(3.38) **不可用**）；`.mode box` 等点命令可用 ⚠️；每次运行为全新内存库。

## C / C++（clang 8）
| 资料 | 链接 | 状态 | 许可证 |
|---|---|---|---|
| Beej's Guide to C Programming | https://beej.us/guide/bgc/ | 200 | CC BY-NC-ND 3.0 ⚠️ → 仅链接 |
| Learn-C.org | https://www.learn-c.org/ | 200 | ⚠️ → 仅链接 |
| Modern C (Jens Gustedt) | https://gustedt.gitlabpages.inria.fr/modern-c/ | 200 | CC BY-NC-ND ⚠️ → 仅链接 |
| LearnCpp.com | https://www.learncpp.com/ | 200 | 版权保留 → 仅链接 |
| cppreference | https://en.cppreference.com/ | 403（反爬） | CC BY-SA 3.0 + GFDL ⚠️ |
| C++ Core Guidelines | https://github.com/isocpp/CppCoreGuidelines | 200 | MIT 风格 ⚠️ |
运行时：clang 8.0.1 + wasi-libc + libc++（2019）；`-Werror -O2`；**C++17 部分**（无 `std::filesystem`、`<charconv>` 浮点等 ⚠️），无 C++20；无线程（`std::thread` 链接失败）、无异常? ⚠️（wasm-clang 早期构建 `-fno-exceptions` 可能 → 示例避免 `throw`，需实测）；`scanf`/`std::cin` 交互可用。

## PHP
| 资料 | 链接 | 状态 | 许可证 |
|---|---|---|---|
| PHP 官方手册 | https://www.php.net/manual/en/ | 200 | CC BY 3.0 ⚠️（可改编，署名） |
| PHP The Right Way | https://phptherightway.com/ ・ https://github.com/codeguy/php-the-right-way | 200/200 | CC BY-NC-SA 3.0 ✔ → 仅链接 |
运行时：php-cgi 8.2 `-q`；无网络、无数据库扩展（PDO_SQLITE? ⚠️ 未确认）、无 `readline` → stdin 用 `fgets(STDIN)` ⚠️（CGI SAPI 下 STDIN 常量可能未定义，改用 `fopen('php://stdin','r')`，需实测）。

## Lua
| 资料 | 链接 | 状态 | 许可证 |
|---|---|---|---|
| Programming in Lua（第 1 版在线） | https://www.lua.org/pil/ ・ https://www.lua.org/pil/contents.html | 200/200 | 版权保留（Roberto Ierusalimschy）→ 仅链接 |
| Lua 5.4 Reference Manual | https://www.lua.org/manual/5.4/ ・ https://www.lua.org/license.html | 200/200 | 手册版权 Lua.org，可自由使用 ⚠️（Lua 本体 MIT ✔） |
| lua-users wiki Tutorial | http://lua-users.org/wiki/TutorialDirectory | 200 | ⚠️ → 仅链接 |
| Learn Lua in Y minutes | https://learnxinyminutes.com/lua/ | 200 | CC BY-SA 3.0 ✔ |
| Exercism Lua | https://exercism.org/tracks/lua | 200 | MIT ⚠️ |
运行时：Lua 5.4.9（wasi-sdk 33，sjlj）→ `pcall/error` 可用；无 `io.popen`/`os.execute`/`io.tmpfile`/`os.tmpname`；无 C 模块加载；`io.read` 交互可用；coroutine 可用。

## Go（Yaegi）
| 资料 | 链接 | 状态 | 许可证 |
|---|---|---|---|
| A Tour of Go | https://go.dev/tour/ | 200 | 文档 CC BY 3.0 / 代码 BSD ⚠️ |
| Go by Example | https://gobyexample.com/ ・ https://github.com/mmcgrana/gobyexample | 200/200 | **CC BY 3.0 ✔**（可改编，须署名） |
| The Little Go Book (Karl Seguin) | https://github.com/karlseguin/the-little-go-book | 200 | CC BY-NC-SA 4.0 ✔ → 仅链接 |
| Effective Go | https://go.dev/doc/effective_go | 200 | CC BY 4.0 / BSD ⚠️ |
| Learn Go with Tests | https://github.com/quii/learn-go-with-tests | 200 | MIT ✔ |
| Yaegi | https://github.com/traefik/yaegi | 200 | Apache-2.0 |
运行时：Yaegi 0.16.1 解释器（wasip1）：仅标准库；无 `go get`、无 cgo、无 `unsafe` 部分用法；无网络；goroutine/channel 可用（单线程调度）；泛型支持有限 ⚠️（Yaegi 对复杂泛型有已知缺陷）；`time.Sleep` 依赖 poll_oneoff ⚠️；`package main` + `func main()` 必需。

## 技术选型调研
| 组件 | 链接 | 状态 | 许可证 | 备注 |
|---|---|---|---|---|
| markdown-it | https://github.com/markdown-it/markdown-it | 200 | MIT | CommonMark，插件丰富（anchor、container、attrs） |
| Shiki | https://shiki.style/ ・ https://github.com/shikijs/shiki | 200/200 | MIT | 构建期高亮，可自定义单色主题；或复用 Monaco `colorize` |
| Sucrase | https://github.com/alangpierce/sucrase | 200 | MIT | TS 去类型，体积小（~200KB ⚠️） |
