# SimpleCode 贡献者指南

给后续改这个仓库的人和代理用。先写 `plan/*.md`，再改代码。合进 `main` 走 Pull Request，合并前 `./build.sh build` 和 `./build.sh test` 要通过。

## 项目是什么

浏览器里的多语言练习场：左边选语言，中间 Monaco 编辑，下面 xterm 看输出，工具栏 Run 在本机执行。Python、Ruby、JS/TS、SQLite、C、C++、PHP、Lua、Go、Shell 的运行时是 WASI preview1 命令模块，由 `@runno/wasi` 的 `WASIWorkerHost` 在 Web Worker 里跑。标准输入走 `SharedArrayBuffer`，所以页面必须跨源隔离。Rust 的编译器是 weblings 的 Cranelift rustc，在另一个 Worker 里编译；编出来的 wasm 再交给同一个 `WASIWorkerHost`。

教学抽屉叫「{语言} 快速入门」。Markdown 在构建时预渲染。十一本书都已按菜鸟教程的短节写成，内部 id 不变。

Linux（v86 + Buildroot）只写在 `plan/LANGUAGES.md` §10 和 `plan/LEARN.md` §20，还没有运行时，也没有 `docs/linux/`。

## 架构

```
侧栏 LanguageSidebar
  → stores/language.ts 选中语言，按需下载 wasm/
编辑器 CodeEditor（Monaco）
  → stores/editor.ts 草稿在 localStorage
工具栏 RunButton
  → stores/run.ts
  → src/core/runner.ts  RunSession
       └─ WASIWorkerHost（今天唯一的执行器）
终端 src/core/terminal.ts（xterm）
文档 DocsDrawer
  → scripts/docs/render.ts 预渲染 docs/
  → useRunFromDoc 把示例装进编辑器再 Run
```

资源在 `wasm/`。`scripts/languages.config.mjs` 列出资产和语言。`scripts/write-manifest.mjs` 按磁盘文件生成 `wasm/manifest.json`（`size`、`sha256`）。该文件 gitignore，不提交。`src/core/wasmLoader.ts` 用 Cache API（`simplecode-wasm-v1`）缓存，并用清单里的 `size` 核对。

语言 id：`python`、`ruby`、`quickjs`（界面文案 JS/TS）、`sqlite`、`clang`、`clangpp`、`php-cgi`、`lua`、`go`、`shell`、`rust`。Rust 不进默认 `./build.sh vendor`，也不写进 `wasm/manifest.json`。`./build.sh vendor --rust` 校验 pin 后把 `rustc.wasm` 和 `sysroot-wasip1.bundle` 放到 `wasm/rust/`。没跑这条命令时，页面从 pin 住的演示地址下载同一对文件，并用 Cache API（`simplecode-rustc-v1`）缓存。GitHub Release 资产在 COEP 页面里没有 CORS，不能当浏览器下载地址。

## 技术栈和命令

Vue 3、Vite、TypeScript、shadcn-vue、Monaco、xterm、`@runno/wasi`。包管理用 **yarn**。

`./build.sh`：

| 子命令 | 作用 |
|---|---|
| `install` | `yarn install` |
| `vendor` | 从 `thirdparty/runno/langs` 拷贝运行时，并编译 Lua / Go / Shell。结束时重写清单。`--rust` 另下 weblings 工具链，不进这份清单 |
| `dev` | Vite 开发服务器，带 COOP/COEP，默认端口 5173 |
| `build` | `yarn vue-tsc --noEmit`，再 `yarn vite build` 到 `dist/`（含 `dist/wasm`） |
| `preview` | 用 COOP/COEP 提供 `dist/` |
| `test` | 文档单元测试、`check-mono`、hello-world 冒烟、`docs-smoke`、`tests/learn.spec.mjs` |
| `clean` | 删 `dist/`。`--all` 再删 `node_modules/` 和 `wasm/` |

缺 wasm 时，`dev` / `build` 会先尝试只重写清单；清单对不上文件才会 vendor。

## 界面规矩

黑白单色。侧栏、工具栏、按钮、抽屉、终端只用中性灰。**Monaco 语法色是唯一例外。** 文档 UI 由 `scripts/check-mono.mjs` 卡住彩色 Tailwind 类和非灰阶色值。

- 折叠侧栏只有图标（约 56px）。缓存用量、清除、主题、展开都在**底部**。展开时一行一种语言。
- Run 只用 `src/components/RunButton.vue`：`Button` 的 `size="xs"`（高 28px），图标 Play，文案 `Run`。工具栏和文档代码块共用它。
- 文档抽屉的 `top` 是 `var(--editor-toolbar-h)`（`src/style.css` 里 2.5rem）。抽屉不得盖住 Run 和语言切换。
- 等宽字体是 JetBrains Mono，中文回退 `SimpleCode CJK`（`size-adjust: 120%`）。xterm 里一个汉字占两格；系统黑体的 1em 字面宽会在格子之间留出空隙，所以才放大到 120%。字体用 `local()`，不从网络拉，否则 COEP 会挡住。

## 加一门语言

1. 在 `plan/LANGUAGES.md` 写清运行时、许可证、体积、做不到的事。
2. `scripts/languages.config.mjs` 增加资产和语言（`id`、`label`、`short`、`syntax`、`fileName`、`run`）。
3. 版本和 sha256 写进 `scripts/sources.lock.json`。构建脚本放在 `scripts/builders/<name>/`，bash 3.2，macOS 与 Linux、x86_64 与 arm64 都能走（`uname` 选工具链，或 `prebuiltUrl` 退回已发布文件）。
4. `./build.sh vendor` 产出 wasm。清单由 `write-manifest.mjs` 从磁盘生成，**不要提交** `wasm/manifest.json`。
5. 许可证写入 `LICENSES/THIRD_PARTY.md`。
6. `tests/smoke.mjs` 加一条 hello-world。有书之后再加文档冒烟。

WASI 命令模块必须导出 `_start`，导入只有 `wasi_snapshot_preview1`。带 `nimbus_proc`、`env` 或 Emscripten 胶水的二进制不能交给 `WASIWorkerHost`。

## 快速入门怎么写

标准在 `plan/LEARN.md` §19。对照是菜鸟教程的**目录形状**（正式章名、一节一件事）。句子和示例字符串自己写，不抄原文。

- 第 0 章文件名是 `index.md`。其余章节不要用 `index` 当 slug，否则会盖住概览。
- 每章至少三个 `###`。章前引言不超过 180 个汉字。每节去掉代码后 1 到 400 个汉字。
- 每章至少两个可运行块：info 里有 `run`，并有 `expect="子串"`。
- `norun` 只供阅读，旁边写原因。`smoke=skip` 仍算结构测试里的可运行块，`docs-smoke` 不执行它（Python 的 `while True` 用了这个）。
- 不要再写固定的「常见错误 / 最佳实践 / 小结 / 练习」四节。
- 十一本书一起检查连续 60 个汉字不重复。
- 围栏属性见 `src/docs/fence.ts`：`run`、`norun`、`stdin`、`expect`、`title`、`smoke`、`exit`。`stdin=""` 表示立刻 EOF。

现在的书（章数）：Python 28、JavaScript 30、Ruby 23、SQL 26、C 25、C++ 39、PHP 34、Lua 22、Go 29、Shell 21、Rust 28。合计 305 章。`SHIPPED_BOOKS` 在 `src/docs/runtime.ts`。Rust 的 `docs-smoke` 默认不跑（工具链约 152 MB）。`SIMPLECODE_RUST_DOCS=1` 才执行书里的块。`tests/smoke.mjs` 仍会编一条 hello、一条编译错误，并试标准输入和写文件。

### 运行时限制（可运行块里避开）

- **C++**：clang 8，大约 gnu++14。`std::sort` 链接缺少 `__lttf2`。`throw`、线程、`<filesystem>` 不放进可运行块。未使用变量会在 `-Werror` 下失败。
- **C**：同样 `-Werror`。`fopen` 标只读。
- **PHP**：8.2，`php -q`，文件以 `<?php` 开头。`STDIN` 未定义，`php://stdin` 和 `php://input` 读不到 WASI 标准输入。没有 curl、mysqli、可靠的超全局。`echo` 用逗号分隔**不会**自动加空格。
- **Shell（wasi-sh）**：只有内建 `echo`、`printf`、`read`、`cat`、`true` / `false` / `:`、`exit`、`test` / `[ ]`，赋值、`$VAR`、`if` / `while` / `for`、内建之间的管道和重定向。没有 `cd`、`$(…)`、`$((…))`、函数、`source`、通配、here-doc、后台和外部命令（退出 127）。`$$` 固定打印 `1`。赋值里不能加引号：`item=钥匙` 可以，`item="钥匙"` 会被当成命令。
- **Go（Yaegi 0.16.1）**：没有网络，不能 import 第三方。`time.Sleep` 在 `poll_oneoff` 上等不回来。自定义 `error` 放进接口再调用 `Error()` 会 panic。
- **Lua 5.4.9**：`pcall` 依赖 wasi-sdk 的 `-mllvm -wasm-enable-sjlj` 和 `-lsetjmp`。不要定义 `LUA_USE_POSIX`，否则 `pcall` 坏掉。`#` 和 `string.len` 按字节。`print` 多个参数之间是制表符。没有 `os.execute`、`io.popen`，也不能 `require` 别的文件。
- **Rust（weblings，`artifacts-test-7`）**：单个 `main.rs`，edition 2024，`-O`，`panic=abort`。没有 Cargo、crates.io、过程宏、`std::thread` 和 `std::thread::sleep`（宿主的 `poll_oneoff` 时钟会空转）。编译器本身要虚拟 sysroot 和 `CLIF2WASM_OBJECT=1`，所以不作为 preview1 命令注册。产物只导入 `wasi_snapshot_preview1` 并导出 `_start`。Safari 没有测过。细节在 `plan/LANGUAGES.md` §11.10。

## 工作顺序

1. 多步改动先写进 `plan/DESIGN.md`、`plan/LANGUAGES.md` 或 `plan/LEARN.md`。
2. 从最新的 `origin/main` 拉分支，提交，推上去，开 PR。
3. 合并前跑 `./build.sh build` 和 `./build.sh test`。草稿 PR 不能合并，准备好就标成可评审。
4. 一次 PR 里不要混无关的重构。文档书按语言分提交，方便看 diff。

## 已经踩过的坑

**`wasm/manifest.json` 体积对不上。** 以前把清单提交进 git。Apple Silicon 上的 Lua 是 720592 字节，Linux 锁定的是 720144，下载检查报大小不匹配；换机器 `git pull` 又会把别人的清单冲突回来。处理：清单不入库，`write-manifest.mjs` 用磁盘文件重写 `size` 和 `sha256`。不要 `git checkout -- wasm/manifest.json`。这份脚本开头也不能留 shebang，否则 Vite 把它当模块导入时会失败（`d668917`）。

**构建脚本只能在 Linux x86_64 上跑。** Lua / Go 的工具链要按 `uname` 选 linux/darwin 与 x86_64/arm64 的压缩包，并在 lock 里钉 sha256。macOS 自带 bash 3.2，脚本不能用 bash 4 语法。Lua 编译前清掉 `SDKROOT`，避免 Xcode 把 WASI sysroot 指走。Go 用下载的工具链（`GOTOOLCHAIN=local`）。编不出来时下载 `prebuiltUrl`，摘要必须和 lock 一致。

**Apple Silicon 的 Lua 摘要不同。** `libclang_rt.builtins.a` 和 Linux 不是同一份，产物 sha256 会变。lock 里用 `outputSha256ByHost`；没有钉的宿主保留二进制并打印摘要，不把 vendor 打失败。`SIMPLECODE_STRICT_WASM_DIGEST=1` 才把这个警告变成错误。清单跟磁盘走之后，缓存检查不再拿 Linux 的字节数去卡 Mac。

**Shiki 多出空行。** 高亮结果在 `.line` 之间插入换行，外层 `white-space: pre` 把这些换行画成额外的空行。`collapseShikiLines` 去掉 `.line` 之间的换行，`.doc-code pre` 用 `white-space: normal`。真正的空行仍是一个空的 `.line`。

**抽屉盖住工具栏。** 抽屉曾经从视口顶边开始，Run 点不到。`DocsDrawer` 的 `top` 改为 `--editor-toolbar-h`，和工具栏同一条偏移。

**草稿 PR 合并不了。** GitHub 上 draft 不能进 `main`。要合并时先标成 Ready for review。

**COOP/COEP 和 SharedArrayBuffer。** `WASIWorkerHost` 一构造就分配 SAB。页面没有 `Cross-Origin-Opener-Policy: same-origin` 和 `Cross-Origin-Embedder-Policy: require-corp` 时，构造直接抛错，`IsolationGuard` 会挡住。Vite 的 `server.headers` 和 `preview.headers` 要带这两项。跨源字体和 CDN 脚本在 COEP 下会被拒绝，所以字体和 wasm 都同源。GitHub Pages 不能加这些头。

**公开的 bash / BusyBox wasm 跑不起来。** `WASIWorkerHost` 只实现 `wasi_snapshot_preview1`。mayflower/busybox-wasm 带 JS 胶水；`@nimbus-sh/runtime-bash` 还要 `nimbus_proc`（`fork`、`execve`）和 `env`。所以 Shell 是仓库里的 `scripts/builders/shell/wasi-sh.c`。要真的 `ls` 和 `cd`，走计划中的 v86，不要再换一份 BusyBox wasm 塞进现有宿主。细节在 `plan/LANGUAGES.md` §9.1 和 §10。

**SQL 概览被章名盖住。** 生成器用 slug `index` 写文件时，非第 0 章也会写成 `index.md`。只有 `chapter == 0` 才能用这个文件名（`ca3ab0b`）。

**文档冒烟在章节壳出现时就去点代码块。** `docs-chapter` 先渲染，代码块稍后才到。`tests/learn.spec.mjs` 要等 `[data-testid="docs-chapter"] [data-testid="doc-code-block"]`，不能只等外壳。

**C++ 宿主编译和聚合初始化。** 本机 g++ 的头文件路径可能和选中的编译器版本不一致。教程里的派生类在 C++14 下不是聚合，`Rect{w,h}` 需要构造函数。这些是写示例时的约束，浏览器里的运行时仍是 clang 8。

## 计划文件

| 文件 | 内容 |
|---|---|
| `plan/DESIGN.md` | 布局、COOP/COEP、缓存、单色、侧栏 |
| `plan/LANGUAGES.md` | 语言评估、Lua/Go/Shell 的实现记录、Linux §10 |
| `plan/LEARN.md` | 快速入门的结构和 §19 写作标准、Linux 书的计划在 §20 |
| `plan/learn-research.md` | 教程取材笔记 |

当前书在短节改写之后（PR #1 侧栏，#2 Lua/Go，#3 可移植构建，#4 JS/TS，#5–#7 快速入门与清单，#8 Shell，#9 书改名，#10 Go 短节，#11 其余九本，#13 Rust 调研）。Rust 的实现记录在 `plan/LANGUAGES.md` §11.10。Linux 仍只在 §10。
