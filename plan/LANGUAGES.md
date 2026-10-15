# SimpleCode 多语言扩展评估（LANGUAGES）

> 日期：2026-10-15。语言排名来源：**TIOBE Index, October 2026**（https://www.tiobe.com/tiobe-index/ ，2026-10-15 抓取）。
> 评估标准：能否在 SimpleCode 现有架构下**完全在浏览器内**运行——`@runno/wasi` 的 `WASIWorkerHost`（WASI preview1、Web Worker、SharedArrayBuffer stdin）、xterm 终端交互、COOP/COEP 隔离、资源同源本地托管（`wasm/` + Cache API）。**不允许**远程编译/执行后备（如 play.rust-lang.org）。
> 下文所有链接已于 2026-10-15 通过真实 HTTP 请求验证（均返回 200）；体积、许可证等未亲自核实的项标注 ⚠️。

---

## 0. 结论速览

| TIOBE | 语言 | 推荐方案 | 类型 | 约体积 | 许可证 | 结论 |
|---|---|---|---|---|---|---|
| 1 | Python | CPython 3.11（VMware WLR，已集成） | WASI | 24.6 MB | PSF / Apache-2.0 | ✅ 已支持 |
| 2 | C | clang 8 + wasm-ld（binji，已集成） | WASI | 52.5 MB（与 C++ 共享） | Apache-2.0 w/ LLVM exc. | ✅ 已支持 |
| 3 | C++ | 同上 | WASI | 同上 | 同上 | ✅ 已支持 |
| 4 | Java | TeaVM-javac（javac 21 + TeaVM，浏览器内编译为 Wasm） | JS/Wasm（非 WASI） | ⚠️ 约 10–30 MB | Apache-2.0（TeaVM）+ GPLv2+CPE（javac） | 🟡 可行（需适配） |
| 5 | C# | Roslyn + .NET WebAssembly（Mono）运行时（Blazor 式） | .NET wasm（非 WASI） | ⚠️ 约 20–40 MB | MIT | 🟡 可行（工作量大） |
| 6 | JavaScript / TypeScript | QuickJS（wasmedge）+ 浏览器内 Sucrase 去类型 | WASI + JS | 3.8 MB（运行时） | MIT / Apache-2.0；Sucrase MIT | ✅ 已支持 |
| 7 | Visual Basic | Roslyn VB 编译器 + .NET wasm（与 C# 共用） | .NET wasm | 与 C# 共享 +⚠️数 MB | MIT | 🟡 可行（随 C#） |
| 8 | R | webR | Emscripten | ⚠️ 约 20–40 MB 起 | GPL-2.0+（R）⚠️ | 🟡 可行（需适配） |
| 9 | SQL | SQLite 3.26（已集成） | WASI | 3.4 MB | Public Domain | ✅ 已支持 |
| 10 | Rust | rubrc（rustc+LLVM → WASI threads）/ weblings（rustc+cranelift）/ rubri（Miri） | WASI + wasi-threads | ⚠️ 100 MB–数百 MB | MIT/Apache-2.0 | 🟠 可行但代价高（实验性） |
| 11 | Go | Yaegi 0.16.1，`GOOS=wasip1`（已集成） | **WASI** | **35.0 MB**（36,736,740 B） | Apache-2.0 + Go BSD-3 | ✅ 已支持（见 §8） |
| 12 | PHP | php-cgi 8.2（已集成） | WASI | 12.5 MB | PHP License 3.01 | ✅ 已支持 |
| 13 | Fortran | LFortran（Emscripten / 直接 Wasm 后端） | Emscripten | ⚠️ 约 30–60 MB | BSD-3-Clause | 🟡 可行（需适配） |
| 14 | Swift | 无浏览器内 swiftc（SwiftWasm 只做交叉编译） | — | — | — | ❌ 不可行 |
| 15 | Scratch | 图形化积木语言，不适用于编辑器+终端模型 | — | — | — | ❌ 不适用 |
| 16 | COBOL | GnuCOBOL（cobc→C）+ 现有 clang + libcob(wasi) | WASI（需自建） | ⚠️ 未知 | GPL-3 / LGPL-3 | 🟠 理论可行，需大量自建 |
| 17 | Perl | zeroperl（Perl 5.42，WASI reactor） | WASI（reactor + EH） | ⚠️ 约 10–20 MB | Artistic/GPL；包装 ⚠️ | 🟡 可行（需 reactor 适配） |
| 18 | Julia | 仅实验（WebAssemblyCompiler.jl / julia-wasm） | — | — | MIT | ❌ 暂不可行 |
| 19 | Delphi/Object Pascal | Pas2JS 编译器（Wasm）→ JS 执行 | JS/Wasm | ⚠️ 约 5–15 MB | LGPL + 链接例外 ⚠️ | 🟡 可行（需适配） |
| 20 | MATLAB | MATLAB 闭源不可行；替代：GNU Octave（xeus-octave / emscripten-forge） | Emscripten | ⚠️ 约 50–150 MB | GPL-3.0 | 🟠 以 Octave 替代，代价高 |
| 35 | **Lua** | 自编译 Lua 5.4.9 + wasi-sdk 33（setjmp/EH） | **WASI** | **0.7 MB**（720,144 B） | MIT | ✅ 已支持，`pcall` 可用（见 §8） |

图例：✅ 已支持/可直接支持；🟡 可行（需新运行时适配器或中等工作量）；🟠 可行但代价高/实验性；❌ 不可行。

**要点**
- 现架构（WASI 命令模块 + `WASIWorkerHost`）可**零改动**接入的只有“真正的 WASI preview1 命令程序”。**Lua 5.4.9 与 Go（Yaegi wasip1）已按此接入**（§8）。Perl 仍需 reactor 适配。
- 其余（Java/C#/VB/R/Fortran/Pascal/Octave）都是 Emscripten / .NET / JS 产物，需要引入 **Runtime 适配层**（§2）。
- Rust 能做到“浏览器内编译”，但依赖 wasi-threads、体积巨大、仍属实验，建议作为后期“实验语言”。
- **Shell / Java / Rust 的 2026-10-15 复核**（体积、许可证、与 `WASIWorkerHost` 是否兼容、建议顺序）见 §9。结论：先做 Shell（WASI 命令），Java 单独评估适配器，Rust 暂缓。

---

## 1. 逐语言详情

### 1.1 已支持（Python / C / C++ / JavaScript / SQL / PHP）
见 `plan/DESIGN.md` §2、§6。来源：Runno `langs/`（VMware webassembly-language-runtimes、binji/wasm-clang、second-state/wasmedge-quickjs、SQLite）。
- 可选升级：VMware WLR 已发布 Python 3.12.0、PHP 8.2.6、Ruby 3.2.2（https://github.com/vmware-labs/webassembly-language-runtimes ），可替换以获得新版本（需重测 baseFS 布局）。

### 1.2 Java（#4）— 🟡（2026-10-15 复核见 §9.2）
- **TeaVM-javac**：https://github.com/konsoletyper/teavm-javac ；在线演示 https://teavm.org/playground.html （作者 2025-06 发布，javac 21 + TeaVM 打包为一个 Wasm 模块，`compiler.wasm`）。流程：`addSourceFile` → `compile()` → `generateWebAssembly({mainClass})` → 得到用户程序 wasm（TeaVM 的 Wasm GC 输出 + JS 运行时）。
- 类型：非 WASI；需在 Worker 中加载 TeaVM 运行时 JS。用户程序 `System.out` 可接到回调；**交互式 `System.in`** 需要 TeaVM classlib 支持同步读取 ⚠️（可用 SharedArrayBuffer+Atomics.wait 在 Worker 中实现阻塞读，需验证 TeaVM 的 stdin 钩子）。
- 限制：TeaVM 限制反射、类加载等；标准库子集。依赖浏览器 **Wasm GC** 支持（Chrome 119+/Firefox 120+/Safari 18.2+）⚠️。
- 备选：CheerpJ（https://cheerpj.com ，完整 JVM，但**商业许可**，且需加载其 CDN 运行时——与“本地托管”冲突）→ 不选。
- 工作量：中（新增 `teavm` 适配器 + stdin 桥接）。

### 1.3 C#（#5）与 Visual Basic（#7）— 🟡
- 方案：在 .NET WebAssembly（Mono 运行时，`dotnet/runtime` 的 browser-wasm）中运行 **Roslyn**（`Microsoft.CodeAnalysis.CSharp` / `.VisualBasic`），`CSharpCompilation.Create(..., concurrentBuild:false)` 编译到内存程序集后在同一运行时内 `Assembly.Load` 执行。参考：Blazor 内 Roslyn 编译（StackOverflow 74351536）、`ubercellogeek/blazoryn`。
- 类型：.NET wasm（自带 JS 引导 `dotnet.js`），非 WASI；需 `dotnet` 适配器。
- `Console.ReadLine` 交互：需在 Worker 中运行 .NET 并以 SAB 阻塞读重定向 `Console.In` ⚠️。
- 体积：运行时 + 裁剪后的 BCL 引用程序集 + Roslyn ≈ 20–40 MB ⚠️。许可证 MIT。
- 工作量：大（需要单独的 .NET 构建工程产出静态资源；C# 与 VB 共享运行时）。

### 1.4 R（#8）— 🟡
- **webR**：https://github.com/r-wasm/webr ，演示 https://webr.r-wasm.org/latest/ 。R 编译为 Emscripten Wasm，提供 Worker 化的 JS API，支持 SharedArrayBuffer 通道（与我们的 COOP/COEP 一致）。
- 适配：`emscripten` 适配器（或直接使用 webR 的 npm 包，在 Worker 内运行，stdout/stderr 回调到终端，`readline()` 走其 stdin 通道）。
- 体积：基础 R ≈ 数十 MB ⚠️；扩展包按需（默认从其仓库 CDN 安装 → 需本地托管或禁用）。许可证 R 为 GPL-2.0+（webR 本身 MIT？⚠️ 需核实）。
- 工作量：中。

### 1.5 Rust（#10）— 🟠 详见 §4；2026-10-15 复核见 §9.3

### 1.6 Go（#11）— ✅ 已集成（原评估 🟡）
- **Yaegi**（Go 解释器，Traefik）：https://github.com/traefik/yaegi ，Apache-2.0，纯 Go 实现，支持几乎完整的 Go 规范与标准库（反射实现）。
- 关键：Go 1.21+ 原生支持 `GOOS=wasip1 GOARCH=wasm`，编译出的就是 **WASI preview1 命令模块** → 可直接用 `WASIWorkerHost` 运行：`yaegi /program`（或自写 20 行 main：读取 `/program` 并 `interp.Eval`）。stdin/stdout 走 WASI，xterm 交互天然可用。
- 已有先例（JS/wasm 版）：LiveCodes Go(Wasm)（https://livecodes.io/docs/languages/go-wasm ）。
- 风险：Go wasip1 产物较大（标准库符号表 ⚠️ 15–40 MB），性能为解释执行；`goroutine` 在单线程 wasm 中可用（Go 运行时调度）；Go wasip1 在缺少 `poll_oneoff` 完整实现时 `time.Sleep` 可能有问题 ⚠️（@runno/wasi 已实现 poll_oneoff 的时钟订阅？需验证）。
- 工作量：小–中（构建脚本 + manifest 条目）。

### 1.7 Fortran（#13）— 🟡
- **LFortran**：https://lfortran.org ，浏览器演示 https://dev.lfortran.org/ ，JupyterLite 内核 xlfortran（Emscripten）；构建见 https://github.com/lfortran/wasm_builds 。LFortran 带**直接 Wasm 后端**：在浏览器内把 Fortran 编译成 wasm 后执行。
- 适配：`emscripten` 适配器加载编译器；生成的程序 wasm 的导入接口是 LFortran 自定义 JS 运行时 ⚠️（非 WASI），需按其 demo 实现。
- 许可证 BSD-3。成熟度：Alpha/Beta（LFortran 仍在完善 Fortran 语义）⚠️。工作量：中。

### 1.8 Swift（#14）— ❌
- SwiftWasm（https://swiftwasm.org/ ）与官方 Swift Wasm SDK 只提供**宿主机上的交叉编译**，没有可在浏览器中运行的 swiftc；swift-frontend 依赖 LLVM 且体量巨大，无人移植。第三方“MiniSwift”为非官方子集实现 ⚠️，不纳入。

### 1.9 Scratch（#15）— ❌ 不适用
- 积木式图形语言，需 scratch-gui/scratch-vm 舞台渲染，与“代码编辑器 + 终端”模型不符。可作为独立嵌入功能，不在本规划内。

### 1.10 COBOL（#16）— 🟠
- 路线：GnuCOBOL `cobc -C` 把 COBOL 翻译为 C → 用**我们现有的浏览器内 clang** 编译链接 libcob（需预先为 wasm32-wasi 交叉编译 libcob + GMP）。
- 参考：Cloudflare cobweb（https://github.com/cloudflare/cobweb ，Workers 用，Emscripten）、浏览器 PoC https://github.com/moxon6/cobol-js-emscripten （COBOL Pong）。但这些都是**宿主机预编译**；要在浏览器内编译用户代码，需把 `cobc` 本身编译为 WASI（无先例 ⚠️）。
- 工作量：大；建议仅作远期实验。

### 1.11 Perl（#17）— 🟡
- **zeroperl**：https://github.com/6over3/zeroperl （Perl 5.42，wasi-sdk 构建，产物 `zeroperl.wasm` 为 **reactor + asyncify** 模块），TS 包装 https://github.com/6over3/zeroperl-ts （npm `@6over3/zeroperl-ts`）。
- 差异：reactor（无 `_start`，导出 `eval` 等函数）+ 使用 Wasm **exception-handling**（exnref）提案——浏览器较新版本支持，wasmtime 不支持；`@runno/wasi` 的 `WASI.start` 只支持命令模块 → 需新增 `wasi-reactor` 适配器（直接用 zeroperl-ts 在 Worker 中运行，或自行实例化并调用导出）。
- 备选：WebPerl（Emscripten，Perl 5.28，较旧 ⚠️）。
- 工作量：中。

### 1.12 Julia（#18）— ❌（暂不可行）
- 仅有实验性项目：WebAssemblyCompiler.jl（https://github.com/tshort/WebAssemblyCompiler.jl ，编译 Julia 子集）、julia-wasm（https://github.com/Keno/julia-wasm ，早期移植）。完整 Julia（LLVM JIT）无法在浏览器运行。持续观察。

### 1.13 Delphi / Object Pascal（#19）— 🟡
- **Pas2JS**：Free Pascal 官方 Live-Pascal（https://live.freepascal.org/ ，源码 https://gitlab.com/freepascal.org/fpc/live-pascal ），**编译器本身以 Wasm 在 Web Worker 中运行**，把 Object Pascal 编译为 JavaScript 执行。
- 适配：`js-codegen` 适配器：编译器 wasm 生成 JS → 在隔离 Worker 中 `new Function`/模块执行 → `writeln` 接终端；`readln` 需 SAB 阻塞读 ⚠️（pas2js RTL 的 `readln` 默认基于浏览器 prompt/异步）。
- 许可证：FPC 编译器 GPL，RTL 为 LGPL+静态链接例外 ⚠️。工作量：中。

### 1.14 MATLAB（#20）— 🟠（以 Octave 替代）
- MATLAB 闭源，无可在浏览器运行的实现 → ❌。替代：**GNU Octave** Emscripten 构建，已用于 JupyterLite（xeus-octave：https://github.com/jupyter-xeus/xeus-octave ，2025 Jupyter 博客介绍）；另有 rwl/octave-wasm（Octave 7.2）⚠️。
- 体积极大（含 LAPACK/Fortran 运行时）⚠️，GPL-3。仅建议远期“Octave（MATLAB 兼容）”实验。

---

## 2. 架构改造

### 2.1 Runtime 适配器抽象
当前 `src/core/runner.ts` 直接绑定 `WASIWorkerHost`。改为：

```ts
// src/core/runtime/types.ts
export interface RuntimeIO {
  stdout(text: string): void;
  stderr(text: string): void;
  phase(p: "load" | "compile" | "link" | "run"): void;
}
export interface RunHandle {
  pushStdin(data: string): Promise<void>;
  pushEOF(): Promise<void>;
  kill(): void;
  done: Promise<RunOutcome>;
}
export interface RuntimeAdapter {
  kind: string;                                   // "wasi" | "wasi-reactor" | "emscripten" | "dotnet" | "js-codegen" | "teavm"
  prepare?(lang: LanguageSpec, assets: AssetMap): Promise<void>; // 一次性初始化（如加载编译器）
  run(lang: LanguageSpec, code: string, io: RuntimeIO): RunHandle;
}
```
- `WasiCommandAdapter`：现有逻辑（prepare 链 + run），覆盖 Python/Ruby/QuickJS/SQLite/PHP/C/C++/Lua/Go。
- `WasiReactorAdapter`：实例化 reactor，调用约定导出（Perl）。
- `EmscriptenAdapter`：在专用 Worker 中加载 `*.js + *.wasm (+ .data)`，`Module.print/printErr` → io，`stdin` 回调走 SAB 阻塞读（R/Fortran/Octave）。
- `DotnetAdapter`、`TeaVMAdapter`、`JsCodegenAdapter`（Pascal：编译出 JS 后在沙箱 Worker 执行）。
- **统一 stdin 通道**：抽出 `StdinChannel`（SharedArrayBuffer + Atomics，与 `@runno/wasi` 协议一致：Int32 长度头 + 数据，-1 = EOF），所有 Worker 侧适配器共用；UI 层（xterm 行编辑）不变。
- **Worker 隔离**：非 WASI 运行时一律放进独立 Worker，Stop = `worker.terminate()`，与现有语义一致；COOP/COEP 下同源 Worker/Blob Worker 均可用。

### 2.2 Manifest schema 扩展（向后兼容，version: 2）
```jsonc
{
  "id": "go", "label": "Go", "short": "Go", "syntax": "go", "fileName": "main.go",
  "runtime": "wasi",                     // 新增：适配器类型，缺省 "wasi"
  "features": ["wasi-threads", "exception-handling", "wasm-gc"],  // 新增：浏览器能力需求，启动前检测
  "stdin": "interactive",                // interactive | batch | none
  "license": "Apache-2.0", "homepage": "https://github.com/traefik/yaegi",
  "experimental": false,
  "run": { "asset": "yaegi-wasm", "binaryName": "yaegi", "args": ["run", "{entry}"] },
  "adapterOptions": { }                  // 适配器私有配置（如 emscripten 的 locateFile 映射、dotnet 引用程序集列表）
}
```
- `assets` 增加 `kind: "bundle"`（多文件目录打包为 tar/zip，解压到 Cache/内存；如 .NET `_framework/*`、webR 的 R 库）。
- `features` 检测：`wasm-gc`/`exception-handling` 用 `WebAssembly.validate` 探测小模块；`wasi-threads` 要求 `crossOriginIsolated` + 共享内存。不满足时侧栏条目禁用并提示原因。
- 侧栏增加“实验”标记（单色，虚线描边图标）。

### 2.3 资源与构建
- `scripts/vendor-wasm.mjs` → 支持多来源：`thirdparty/runno/langs`、npm 包（`node_modules/@antonz/lua-wasi/dist/lua.wasm` 等）、`scripts/builders/<lang>/`（Dockerfile/脚本，如 Lua+wasi-sdk、Yaegi wasip1）产物、HTTP 下载（带 sha256 锁定，`scripts/sources.lock.json`）。
- 大体积运行时（Rust/Octave/.NET）**不进入默认构建**：通过 `./build.sh vendor --with rust,octave` 显式启用；部署时注意单文件大小限制（>25 MiB 的托管限制，见 DESIGN §14）。
- 第三方许可证随 manifest 生成 `LICENSES/THIRD_PARTY.md`。

---

## 3. Lua 详细集成方案（Phase 1，优先）

### 3.1 候选
| 方案 | 链接 | 类型 | 体积 | 许可证 | 备注 |
|---|---|---|---|---|---|
| A. `@antonz/lua-wasi` 5.4.6 | https://github.com/nalgeon/lua-wasi （已归档）/ npm `@antonz/lua-wasi` | WASI 命令 | 329 KB（实测） | MIT | wasienv 构建；**无 pcall/错误恢复**、语法错误信息不完整 |
| B. 自编译 Lua 5.4.7 + wasi-sdk（推荐） | 脚本参考 https://github.com/singlestore-labs/lua-wasi | WASI 命令 | 约 0.3–0.5 MB ⚠️ | MIT | 开启 wasi-sdk 的 setjmp/longjmp 支持（基于 Wasm EH，`-mllvm -wasm-enable-sjlj` + `-lsetjmp`，wasi-sdk ≥ 22 ⚠️）以恢复 `pcall`/`error` |
| C. Fengari | https://github.com/fengari-lua/fengari | 纯 JS（Lua 5.3） | ~200 KB | MIT | 需 JS 适配器；stdin 需桥接 |
| D. wasmoon | npm `wasmoon` | Emscripten | ~200 KB ⚠️ | MIT | 需 Emscripten 适配器 |

### 3.2 实测（2026-10-15，本机，现有 runner，未提交代码）
- 下载 `https://unpkg.com/@antonz/lua-wasi/dist/lua.wasm`（329,167 B，`\0asm` 魔数正确），临时加入 manifest：`run: { binaryName: "lua", args: ["{entry}"] }`。
- 测试程序：`io.read("l")` 读取 stdin、字符串拼接、table、`pcall(error)`。
- 结果：`Hello, Ada from Lua 42`、`1,4,9` **正确输出，交互式 stdin 正常**；执行到 `pcall(function() error("boom") end)` 时以**非零退出**结束（与该构建 README 所述“不支持 pcall 异常处理”一致）。
- 结论：架构零改动可用；需要**方案 B** 修复 `pcall`/`error`（Lua 的错误机制基于 `setjmp/longjmp`，wasienv 旧工具链不支持）。

### 3.3 实施步骤
1. `scripts/builders/lua/build.sh`：Docker 中下载 wasi-sdk（固定版本）与 Lua 源码（固定版本 + sha256），`make CC="clang --target=wasm32-wasi" MYCFLAGS="-DLUA_USE_POSIX? -mllvm -wasm-enable-sjlj" MYLIBS="-lsetjmp"`，去掉 `os.execute`/`io.popen`/`tmpfile` 等不可用接口（编译期宏或补丁）⚠️。
2. 产物 `lua-5.4.x.wasm` 进入 `wasm/`；manifest 条目：`syntax: "lua"`（Monaco 自带 `basic-languages/lua`），`fileName: main.lua`，`features: ["exception-handling"]`（若采用 EH 方案）。
3. 回退：若 EH 方案在某浏览器不可用，退到方案 A 并在 UI 提示“pcall 不可用”。
4. 测试：smoke 增加 Lua 用例（stdin、`pcall`、`string.format`、语法错误信息）。
- 工作量：约 0.5–1 天。

---

## 4. Rust 详细评估与方案（Phase 3，实验）

### 4.1 选项对比
| 方案 | 链接 | 原理 | 产物/执行 | 依赖 | 体积 | 成熟度 |
|---|---|---|---|---|---|---|
| R1. rubrc | https://github.com/oligamiq/rubrc | rustc（LLVM 后端）+ cargo + clang/llvm 编译为 WASI（`wasm32-wasip1-threads`），在 Worker 中运行 | 生成 `wasm32-wasip1` 可执行文件 → 我们的 `WASIWorkerHost` 可直接运行产物 | **wasi-threads**（`thread-spawn`）、共享内存、COOP/COEP；作者的 browser_wasi_shim-threads | ⚠️ 数百 MB（rustc_opt/llvm_opt 等） | 实验（作者自述 WIP，线程缺失时很慢） |
| R2. weblings | https://github.com/AngelOnFira/weblings | bjorn3 补丁版 rustc → cranelift → waffle → wasm 目标文件 → 自研链接器 | 浏览器内产出 wasm 可执行 | rustc wasm 构建（bjorn3/wasm-rustc），sysroot rlibs | ⚠️ 100+ MB | 实验 |
| R3. rubri（Miri 解释器） | https://github.com/LyonSyonII/rubri | Miri 编译到 wasm，解释执行 MIR | 解释执行，无需链接 | rustc 前端 + Miri | ⚠️ 100+ MB | 实验；运行慢，但无需 codegen/链接 |
| R4. 远程 play.rust-lang.org | — | 服务器编译 | — | 网络 | — | ❌ 违反“完全浏览器内”约束 |

基础：bjorn3 的 rustc→WASI 工作（https://github.com/bjorn3/wasm-rustc 、https://github.com/bjorn3/browser_wasi_shim 示例 `rustc.html`）。

### 4.2 与我们架构的差距
- `@runno/wasi` **不实现 wasi-threads**（无 `wasi.thread-spawn` 导入、无共享内存实例化）→ rustc/LLVM 无法在现有 `WASIWorkerHost` 中运行；需新增 `WasiThreadsAdapter`（可基于 browser_wasi_shim-threads，或给 @runno/wasi 增补：共享 `WebAssembly.Memory` + 每线程一个 Worker + `wasi_thread_start`）。
- 文件系统：rustc 需要 sysroot（std/core/alloc rlibs，数十 MB）只读挂载；@runno/wasi 的 WASIFS 是“整份复制进 Worker”，大 sysroot 传递开销大 → 需按需/共享（OPFS 或 SharedArrayBuffer 只读 FS）⚠️。
- 内存：rustc 编译 hello world 需要数百 MB–1 GB+ 线性内存 ⚠️；移动端不可用。
- 编译耗时：数秒到数十秒（取决于线程可用性）⚠️。

### 4.3 推荐路线
1. **调研原型（独立页面）**：直接集成 rubrc 的预构建 wasm 资产与其 threads shim，在 SimpleCode 中以 `rust-experimental` 适配器运行 `rustc --target wasm32-wasip1 main.rs -o /main.wasm`，产物交给现有 `WASIWorkerHost` 运行（复用 stdin/终端）。
2. 测量：首次下载体积、编译时间、内存峰值、Chrome/Firefox/Safari 兼容性。
3. 若体积/耗时不可接受 → 评估 R3（Miri）作为“教学模式”（无需 LLVM/链接，体积相对小，但执行慢）。
4. 默认构建不包含 Rust；`./build.sh vendor --with rust` 启用，UI 标记“实验”。
- 结论：**可行但代价高**；放在 Phase 3，前置条件是 Runtime 适配器与 wasi-threads 支持。

---

## 5. 分阶段路线图

| 阶段 | 内容 | 优先级 | 预估 |
|---|---|---|---|
| Phase 0 | Runtime 适配器抽象（`WasiCommandAdapter` 迁移现有 7 语言，行为不变）、manifest v2（runtime/features/license/experimental）、vendor 多来源 + sources.lock | P0 | 2–3 天 |
| Phase 1 | **Lua**（自编译 + sjlj）、**Go**（Yaegi wasip1）——均为纯 WASI，零适配器新增 | P0 | **已完成**（§8） |
| Phase 1.5 | Python/PHP/Ruby 升级到 VMware WLR 新版本（3.12 / 8.2.6 / 3.2.2） | P2 | 1 天 |
| Phase 2 | `EmscriptenAdapter` + 统一 StdinChannel → **R（webR）**、**Fortran（LFortran）**；`WasiReactorAdapter` → **Perl（zeroperl）** | P1 | 1–2 周 |
| Phase 2.5 | `TeaVMAdapter` → **Java**；`JsCodegenAdapter` → **Pascal（Pas2JS）** | P1 | 1–2 周 |
| Phase 3 | `DotnetAdapter` → **C# / VB**；`WasiThreadsAdapter` → **Rust（实验）** | P2 | 2–4 周 |
| Phase 4（远期） | Octave（MATLAB 替代）、COBOL（cobc→clang 链路）、Julia 观察 | P3 | 视情况 |
| 不做 | Swift、Scratch、MATLAB 本体 | — | — |

---

## 6. 风险
1. **体积**：Java/.NET/R/Octave/Rust 单语言数十至数百 MB；需按需下载、显式启用、服务端压缩；注意托管平台单文件限制。
2. **浏览器能力差异**：Wasm GC（TeaVM）、exception-handling/exnref（zeroperl、Lua sjlj）、wasi-threads/共享内存（Rust）在 Safari/旧版浏览器支持不一 ⚠️ → manifest `features` 探测 + 降级提示。
3. **stdin 交互**：Emscripten/.NET/TeaVM/Pas2JS 默认使用异步或 `prompt()`；统一的 SAB 阻塞读需要在其 Worker 中替换 I/O 钩子，个别运行时可能只能做“批量 stdin”⚠️。
4. **许可证**：GPL 运行时（R、Octave、GnuCOBOL、javac GPLv2+CPE）随站点分发需提供源码获取方式与许可证文本；CheerpJ 商业许可排除。
5. **维护性**：多个上游为个人/实验项目（rubrc、weblings、rubri、lua-wasi 已归档、zeroperl），需锁定版本并自建构建脚本以防上游消失。
6. **COEP 约束**：所有资源必须同源或带 CORP/CORS；上游默认从 CDN 加载（webR 包仓库、zeroperl CDN、TeaVM classlib URL）的地方都要改为本地托管。
7. **安全**：JS 代码生成类运行时（Pas2JS、TeaVM JS 运行时）执行用户生成的 JS，必须放在专用 Worker（无 DOM、可 terminate），不得在主线程 `eval`。

---

## 7. 参考链接（2026-10-15 验证，HTTP 200）
- TIOBE Index：https://www.tiobe.com/tiobe-index/
- VMware WLR：https://github.com/vmware-labs/webassembly-language-runtimes
- Lua：https://github.com/nalgeon/lua-wasi ・ https://unpkg.com/@antonz/lua-wasi/dist/lua.wasm ・ https://github.com/singlestore-labs/lua-wasi ・ https://github.com/fengari-lua/fengari
- Rust：https://github.com/oligamiq/rubrc ・ https://github.com/AngelOnFira/weblings ・ https://github.com/LyonSyonII/rubri ・ https://github.com/bjorn3/wasm-rustc ・ https://github.com/bjorn3/browser_wasi_shim
- Go：https://github.com/traefik/yaegi ・ https://livecodes.io/docs/languages/go-wasm
- Java：https://github.com/konsoletyper/teavm-javac ・ https://teavm.org/playground.html ・ https://cheerpj.com/docs/overview.html
- C#/VB：https://github.com/dotnet/runtime ・ https://github.com/ubercellogeek/blazoryn
- R：https://github.com/r-wasm/webr ・ https://webr.r-wasm.org/latest/
- Fortran：https://dev.lfortran.org/ ・ https://github.com/lfortran/wasm_builds
- Perl：https://github.com/6over3/zeroperl ・ https://github.com/6over3/zeroperl-ts
- Pascal：https://live.freepascal.org/ ・ https://gitlab.com/freepascal.org/fpc/live-pascal
- Octave：https://github.com/jupyter-xeus/xeus-octave
- COBOL：https://github.com/cloudflare/cobweb ・ https://github.com/moxon6/cobol-js-emscripten
- Julia：https://github.com/tshort/WebAssemblyCompiler.jl ・ https://github.com/Keno/julia-wasm
- Swift：https://swiftwasm.org/

---

## 8. Phase 1 实现记录（2026-10-15）

Lua、Go 与 Shell 已接入现有 `WASIWorkerHost`，没有新增 Runtime 适配器。二进制不入库；`./build.sh vendor` 按 `scripts/sources.lock.json` 下载并校验 sha256 后构建。构建机可以是 **Linux 或 macOS** 的 x86_64 / arm64（见 §8.3）。

### 8.1 Lua 5.4.9
- 脚本：`scripts/builders/lua/build.sh`。wasi-sdk **33.0**（按宿主选择压缩包，Linux x86_64 为 `0ba8b5bf…`）+ Lua **5.4.9**（`2335b6c5…`）。产物 `lua-5.4.9.wasm`，720,144 字节，sha256 `06a6f1aa34d854386f962b270720373bd5a3951aac441e22323295b720ad1adb`。
- 关键参数：`--target=wasm32-wasip1 -mllvm -wasm-enable-sjlj -mllvm -wasm-use-legacy-eh=false`，链接 `-lsetjmp`。**不定义 `LUA_USE_POSIX`**，否则 `ldo.c` 使用 `_setjmp`/`_longjmp`，LLVM 的 sjlj pass 不会改写它们，`pcall` 仍然无效。
- 实测（`@runno/wasi`，需 Wasm `exnref`）：`pcall(error)` 捕获错误并继续执行；嵌套 `pcall` 正常；语法错误输出 `lua: /program:2: unexpected symbol near <eof>` 并以退出码 1 结束；`io.read("*l")` 走 WASI stdin。
- 浏览器需要**标准** Wasm 异常处理（`try_table`，不是旧版 legacy EH）。Playwright 附带的 Chromium 156 可通过。缺少该特性的浏览器会在实例化阶段失败。
- 沙箱里没有的接口：`os.execute`（无 shell）、`io.popen`（Lua 报错）、`io.tmpfile` / `os.tmpname`（失败）、动态库加载。`os.clock` 使用 wasi-sdk 的进程时钟模拟。
- 未采用 `@antonz/lua-wasi` 5.4.6：那份预编译包在本运行器里能跑 stdin，但 `pcall` 会以非零退出结束。

### 8.2 Go（Yaegi 0.16.1，Go 1.22.12）
- 脚本：`scripts/builders/go/build.sh`。官方 Go **1.22.12**（按宿主选择压缩包，Linux x86_64 为 `4fa4f869…`），不使用系统上的 `go`。`GOOS=wasip1 GOARCH=wasm`，`-mod=readonly -buildvcs=false -trimpath -ldflags="-s -w -buildid="`，`GOTOOLCHAIN=local`。Yaegi 模块校验和在 `scripts/builders/go/go.sum`。
- 包装程序 `scripts/builders/go/main.go`：`interp.Use(stdlib.Symbols)` 后 `EvalPath` 解释 `/program`（必须是 `package main` 且含 `func main`）。manifest 参数为 `yaegi {entry}`。
- 产物 `yaegi-0.16.1.wasm`，36,736,740 字节（35.0 MB），sha256 `570999c368119300b76785385555683355fb1a474819f30c603675070ee9db7d`。同一源码在仓库内和仓库外各构建一次，摘要一致。
- 已在 `@runno/wasi` 上验证：`fmt`、`strings`、`bufio`/`os.Stdin`、`time.Now()`、向带缓冲 channel 发送的 goroutine。
- 限制：
  - 解释执行，只有标准库。没有模块下载，`import` 第三方包会失败。
  - **`time.Sleep` 不会返回。** `@runno/wasi` 的 `poll_oneoff` 对时钟订阅是忙等，和 Go wasip1 运行时的调度方式对不上；10ms 的 `Sleep` 在节点上超过 8 秒仍未结束。`time.Now()` 正常。
  - 无网络（`sock_*` 为 ENOSYS）。
  - 单文件 35 MB，超过部分静态托管的 25 MiB 上限（与 clang.wasm 同类问题）。
- 不采用 `GOOS=js`：那份产物依赖 `wasm_exec.js`，不能作为 `WASIWorkerHost` 的命令模块。Yaegi v0.16.1 的标准库符号与 Go 1.22 可以一起编译；更新 Go 大版本前需要重测符号是否仍能编译。

### 8.3 构建机：Linux 与 macOS

`scripts/builders/*.sh` 用 `uname -s` 与 `uname -m` 选择工具链（测试可设 `SIMPLECODE_UNAME_S` / `SIMPLECODE_UNAME_M`）：

| 宿主 | wasi-sdk 33.0 | Go 1.22.12 |
| --- | --- | --- |
| linux-x86_64 | `wasi-sdk-33.0-x86_64-linux.tar.gz` `0ba8b5bf…` | `go1.22.12.linux-amd64.tar.gz` `4fa4f869…` |
| linux-arm64 | `wasi-sdk-33.0-arm64-linux.tar.gz` `4f98ee73…` | `go1.22.12.linux-arm64.tar.gz` `fd017e64…` |
| darwin-arm64 | `wasi-sdk-33.0-arm64-macos.tar.gz` `85c997a2…` | `go1.22.12.darwin-arm64.tar.gz` `416c3521…` |
| darwin-x86_64 | `wasi-sdk-33.0-x86_64-macos.tar.gz` `18f3f201…` | `go1.22.12.darwin-amd64.tar.gz` `e7bbe07e…` |

脚本按 bash 3.2 编写（macOS `/bin/bash`）。校验和用 `sha256sum` 或 `shasum -a 256`，解压用 `tar -xzf`。编译 Lua 前去掉 `SDKROOT` 等变量，避免 clang 去找 Xcode SDK。Go 设置 `GOTOOLCHAIN=local`。

`outputSha256` 是 Linux x86_64 上的参考摘要。Lua 用相对路径 `-include wasi-lua.h`；Go 使用 `-trimpath -buildvcs=false -buildid=`。Go 的 wasm 在 Linux x86_64 与 Linux arm64（qemu-user 跑官方 arm64 工具链）上摘要相同，因此 `go.outputSha256ByHost` 登记了这两个宿主。四个宿主包里的 `libc.a` / `libsetjmp.a` 字节相同；darwin-x86_64 的 wasi sysroot 与 compiler-rt 也和 Linux x86_64 相同。darwin-arm64 的 `libclang_rt.builtins.a` 有 142/149 个成员不同，Apple Silicon 上编出来的 Lua 摘要可能不一样。

`outputSha256ByHost` 里登记过的宿主摘要不符则失败。还没登记的宿主（例如 darwin-arm64 的 Lua）若摘要不同，脚本打印实际摘要并保留刚编译的文件，下次 vendor 会再编一次；把该摘要写进 lock 后即可跳过。`SIMPLECODE_STRICT_WASM_DIGEST=1` 改为失败。

本地编译失败，或系统不在上表中时，下载 `prebuiltUrl` 的 wasm，sha256 必须等于 `outputSha256`。默认地址是 GitHub Release `wasi-runtimes-1` 的 `lua-5.4.9.wasm` 与 `yaegi-0.16.1.wasm`（需要发布后备用下载才会成功）：

```bash
gh release create wasi-runtimes-1 --title "WASI runtimes" wasm/lua-5.4.9.wasm wasm/yaegi-0.16.1.wasm
```

临时改地址：`SIMPLECODE_LUA_PREBUILT_URL`、`SIMPLECODE_GO_PREBUILT_URL`、`SIMPLECODE_SHELL_PREBUILT_URL`。`scripts/builders/self-check.sh` 检查宿主选择、校验和与失败后退回预编译文件；`SIMPLECODE_INSPECT_TOOLCHAINS=1` 会解压四个宿主的工具链并核对 ELF / Mach-O。

### 8.4 Shell（wasi-sh）

公开的 bash / BusyBox wasm 不能交给 `WASIWorkerHost`（导入了 `nimbus_proc`、`env` 或 Emscripten 胶水，见 §9.1）。因此 Shell 是本仓库的 `scripts/builders/shell/wasi-sh.c`，用 §8.3 的 wasi-sdk 33 编成 preview1 命令。脚本：`scripts/builders/shell/build.sh`。产物 `wasi-sh.wasm`，55,023 字节，sha256 `0dcaeccb81ad6ae506674171cfae935697ea2e6b5687067357bf38fd6d4e3807`（Linux x86_64，同一源码在两个目录各编一次，摘要一致）。导入只有 `wasi_snapshot_preview1`，导出 `_start` 与 `memory`。许可证 MIT。预编译备用地址与 Lua/Go 相同，文件名 `wasi-sh.wasm`（需要发布后才下载得到）。

能做的事（已在 Node `node:wasi` preview1 上跑过）：

- 内建：`echo`（`-n`）、`printf`（`%s` `%d` `%%` 和 `\n` `\t`）、`read`、`cat`、`true` / `false` / `:`、`exit`、`test` 与 `[ ]`（`-z` `-n`、字符串 `=` `!=`、整数 `-eq` `-ne` `-lt` `-le` `-gt` `-ge`）。
- 赋值 `NAME=value`，展开 `$VAR` `${VAR}` `$?` `$#` `$$`（固定为 `1`）`$0`–`$9`。单引号按字面，双引号里展开变量。
- `if` / `elif` / `else` / `fi`，`while` / `do` / `done`，`for NAME in …; do` / `done`，`;` 与换行，`&&` 与 `||`。
- 内建之间的管道（内存缓冲，左结合，例如 `echo a | cat | cat`）。重定向 `<` `>` `>>` 走 WASI 预打开的文件系统。
- 外部命令写到 stderr：`shell: NAME: external commands are not available (no fork)`，退出码 127。语法错误退出码 2。`while` / `for` 超过 100000 次会停下来。

做不到的事，因为 preview1 没有进程和管道系统调用，这个宿主也没有补：

- `fork`、`exec`、后台 `&`、真正的 OS 管道、`cd`（没有 `chdir`）、命令替换 `$(…)`、算术 `$((…))`、子 shell、通配、here-doc、函数、`source`。
- 管道右边如果是外部程序，同样是 127；左边的输出不会交给宿主去启动另一个 wasm。

---

## 9. Java、Rust 与 Shell（2026-10-15 复核）

本节只回答三件事：有哪些浏览器内方案、和现有 `@runno/wasi` `WASIWorkerHost`（只提供 `wasi_snapshot_preview1`）能不能直接跑、建议的顺序。链接在 2026-10-15 用 HTTP 或包内清单核对过；返回非 200 的页面会单独注明。WASI preview1 是扁平的 `wasi_snapshot_preview1` 导入，没有创建进程的调用（没有 `fork` / `exec` / `pipe`）。来源：https://wasi.dev/releases/wasi-p1 （200）。

建议顺序：**Shell → Java（评估，不在本轮做适配器）→ Rust 暂缓。**

### 9.1 Shell

要接进现有侧栏，二进制必须是 WASI preview1 **命令模块**（导出 `_start`，导入只有 `wasi_snapshot_preview1`）。下面三份公开产物都不是这样：

| 产物 | 体积（实测字节） | 许可证 | 导入 | 能否用于 `WASIWorkerHost` |
|---|---|---|---|---|
| [mayflower/busybox-wasm](https://github.com/mayflower/busybox-wasm/releases/tag/v1.37.1) `v1.37.1` 的 `busybox.wasm` | 226,326；sha256 `7fc7e424188eb9edf966a74c87390b3652b726f1edec9c0e120a957127284012` | 上游 BusyBox 为 GPLv2（https://busybox.net/license.html ，200） | 模块名被压成 `a`，配套 `busybox.js`（77,468 字节） | 否。这是给 JS 胶水用的，不是 preview1 命令 |
| [@nimbus-sh/runtime-bash](https://registry.npmjs.org/@nimbus-sh/runtime-bash) `5.2.37-3` 的 `bash.async.wasm` | 3,896,320；sha256 `dcfd8bb774351e890c2b0fef70809564ea574a1c27f276f381748c2aa0d92362` | 包声明 `GPL-3.0-or-later AND GPL-2.0-only`（registry JSON，200）。GNU bash 文档：https://www.gnu.org/software/bash/manual/bash.html （200） | `wasi_snapshot_preview1` **加上** `env`（`getuid`、`dlopen` 等）和 `nimbus_proc`（`fork`、`execve`、`pipe`、`waitpid`、`dup2` 等），并导出 Asyncify 符号 | 否。实例化时缺 `nimbus_proc` / `env` |
| 同包 `coreutils/busybox.wasm`（BusyBox 1.37.0） | 293,648；sha256 `51a04c6e0fa2dad05cd4b6fc729615e7765b3bb76842ab9528916ae2eaac7475` | 同上，BusyBox 部分为 GPL-2.0-only | `wasi_snapshot_preview1` **加上** `nimbus_proc`（`chmod`、`chown` 等） | 否 |
| [agentskillmania/busybox-wasi](https://github.com/agentskillmania/busybox-wasi) | 未取二进制 | 仓库未标 SPDX | 说明文字写的是 **WASI Preview 2** | 否。Preview 2 组件不能交给 preview1 宿主 |

Nimbus 仓库：https://github.com/AshishKumar4/Nimbus （200）。这些包要的进程模型（`fork` / `exec` / 管道）正是 preview1 没有的系统调用，所以不能靠“再包一层下载”接进 `WASIWorkerHost`。

可行做法：用已有的 wasi-sdk 33（Linux / macOS、x86_64 / arm64，见 §8.3）编一个 **只导入 preview1** 的 shell 命令。内建命令在同一个 wasm 实例里跑；内建之间的管道用内存接起来。外部程序、`fork`、真正的子进程管道做不到，失败要写在终端里。许可证选 MIT（自写）比把 GPLv2 BusyBox 或 GPLv3 bash 打进站点更干净；若以后换上游 BusyBox，必须按 GPLv2 提供对应源码（https://busybox.net/license.html ）。

### 9.2 Java

| 方案 | 许可证 | 形态 | 体积 | 与 preview1 宿主 |
|---|---|---|---|---|
| [TeaVM](https://github.com/konsoletyper/teavm) + [teavm-javac](https://github.com/konsoletyper/teavm-javac) | TeaVM **Apache-2.0**（GitHub API）。自带类库，不用 OpenJDK；类库来源含 Apache Harmony、Joda-Time、jzlib（仓库 README，200）。javac 本体是 GPLv2+CPE | 浏览器里把源码编成 Wasm GC + JS 运行时。演示 https://teavm.org/playground.html （200） | 仍约 10–30 MB ⚠️（本轮没有独立称到 `compiler.wasm`） | 否。不是 `_start` 命令模块 |
| [CheerpJ 4.3](https://labs.leaningtech.com/blog/cheerpj-4.3) | 商业软件；FOSS、个人项目、一人公司可免费使用（该文，200）。自托管 CheerpJ Core 需要商业许可或技术评估，社区许可不能自托管（https://cheerpj.com/licensing/ ；本机 `curl` 对该站返回 403，条文来自同一天的页面检索） | 浏览器内 Wasm JVM + 未修改的 OpenJDK，Java 8 / 11 / 17 | 典型下载约 10–20 MB（https://labs.leaningtech.com/docs/cheerpj2/guides/Startup-time-optimization ）；有人测 BrowserCraft 首屏约 32 MB（公开讨论，未复测）⚠️ | 否。JS 库 + 按需字节区间，不是 WASI 命令 |

TeaVM 曾经有 WASI 草稿（https://github.com/konsoletyper/teavm/pull/610 ）。GitHub API：`state=closed`，`merged_at=null`，没有并进主线。草稿自己也写了类库仍要非 WASI 的宿主导入（时区、大小写、数学函数）。因此 Java **不能**零改动接上 `WASIWorkerHost`。若要做，TeaVM 的许可证和“完全在浏览器内编译”更接近本项目；CheerpJ 更完整，但自托管和商业条款与 `wasm/` 本地分发冲突。这是评估项，不是本轮实现。

### 9.3 Rust

| 方案 | 许可证 | 体积 | 与 preview1 宿主 |
|---|---|---|---|
| [weblings](https://github.com/AngelOnFira/weblings) | MIT（GitHub API） | 说明写 rustc（Cranelift）+ sysroot 约 **187 MB**（仓库 Actions 工作流注释，https://github.com/AngelOnFira/weblings ） | 否。浏览器里的整套编译器，不是一条 WASI 命令 |
| [rubrc](https://github.com/oligamiq/rubrc) | README 写 MIT OR Apache-2.0（GitHub API 的 license 字段为空） | rustc + LLVM + Cargo + clang，远大于单语言 wasm ⚠️ | 否。依赖其 `browser_wasi_shim-threads` / wasi-threads，不是 preview1 单线程宿主 |
| [rubri](https://github.com/LyonSyonII/rubri) | MIT（GitHub API）。描述：“Rust interpreter that runs in the browser!” | 解释器，无独立称重 ⚠️ | 仍是浏览器应用，不是 `_start` 命令。Miri 维护者认为编到 Wasm 不是官方支持，而且慢：https://github.com/rust-lang/miri/issues/722 （200） |

Rust 工具链的许可证（MIT / Apache-2.0）没问题，卡在体积、线程和实验状态。默认构建不收录。维持 §4 的“实验语言”，排在 Shell 和 Java 之后。

### 9.4 顺序

1. **Shell**：唯一能留在 `WASIWorkerHost` 里的。用 wasi-sdk 编 preview1 命令，内建 + 内建管道；明确没有 `fork`。
2. **Java**：下一轮评估 TeaVM 适配器（新的 JS/Wasm GC 宿主、stdin 桥、本地托管）。不选 CheerpJ 作为默认。
3. **Rust**：暂缓。不下载 100 MB 以上的实验编译器，也不为 wasi-threads 改宿主。
