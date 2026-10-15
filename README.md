# SimpleCode

纯浏览器内运行代码：Python · Ruby · JS/TS · SQLite · C · C++ · PHP · Lua · Go · Shell（WebAssembly / WASI，基于 [Runno](https://github.com/taybenlor/runno) 的 `@runno/wasi`）。

## 快速开始

语言运行时（`.wasm` / `.tar.gz`，约 158 MB）**不随仓库提交**。`./build.sh vendor` 从 Runno 复制已有运行时，并按 `scripts/sources.lock.json` 为当前系统下载工具链、编译 Lua、Go 与 Shell（Linux 与 macOS 的 x86_64 / arm64，macOS 自带 bash 3.2 即可）：

```bash
git clone https://github.com/linkxzhou/SimpleCode && cd SimpleCode
git clone --depth 1 https://github.com/taybenlor/runno thirdparty/runno   # 提供 langs/*.wasm
./build.sh install   # yarn install
./build.sh vendor    # Runno langs + 构建 Lua/Go/Shell → wasm/ + manifest.json
./build.sh dev       # http://localhost:5173
./build.sh build     # dist/
./build.sh preview   # http://localhost:4173（带 COOP/COEP）
./build.sh test      # 无头冒烟测试（9 种运行时；JS 与 TS 各一例）
```

部署时服务器必须返回 `Cross-Origin-Opener-Policy: same-origin` 与 `Cross-Origin-Embedder-Policy: require-corp`，并以 `application/wasm` 提供 `.wasm`。设计文档见 [plan/DESIGN.md](plan/DESIGN.md)，语言方案见 [plan/LANGUAGES.md](plan/LANGUAGES.md)。

侧栏里的 **JS/TS** 仍使用同一份 wasmedge-quickjs（只执行 JavaScript）。工具栏可在 JS 与 TS 之间切换：Monaco 分别用 `javascript` / `typescript` 高亮，两份示例和草稿分开保存，选择记在本机。运行 TypeScript 时，浏览器才懒加载 [Sucrase](https://github.com/alangpierce/sucrase)，把类型标注和 `interface` 剥掉后再交给 QuickJS。这不是完整类型检查。转译失败时错误写在终端，不会启动 wasm。

Lua 5.4.9 用 wasi-sdk 33 从源码编译，`pcall` / `error` 可用（依赖浏览器的 Wasm 异常处理）。Go 是 Yaegi 0.16.1 解释器（`GOOS=wasip1`），只解释标准库，不能 `go get` 第三方模块。Shell 是同一套工具链编出的 `wasi-sh`（MIT）：`echo` / `printf` / `read` / `cat` / `test`、`if` / `while` / `for`，以及内建命令之间的管道和重定向。没有 `fork`，所以 `ls` 这类外部命令会失败。限制见 plan/LANGUAGES.md §8。

第三方许可证：Runno（MIT）；Sucrase（MIT，仅浏览器内 TypeScript 去类型）；Lua（MIT）；wasi-sh（MIT）；Yaegi（Apache-2.0）与 Go 标准库（BSD-3-Clause）；以及 CPython PSF、Ruby、PHP License、LLVM Apache-2.0、SQLite Public Domain、wasmedge-quickjs Apache-2.0。汇总在 [LICENSES/THIRD_PARTY.md](LICENSES/THIRD_PARTY.md)。
