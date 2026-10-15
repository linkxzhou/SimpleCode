# SimpleCode

纯浏览器内运行代码：Python · Ruby · QuickJS · SQLite · C · C++ · PHP · Lua · Go（WebAssembly / WASI，基于 [Runno](https://github.com/taybenlor/runno) 的 `@runno/wasi`）。

## 快速开始

语言运行时（`.wasm` / `.tar.gz`，约 158 MB）**不随仓库提交**。`./build.sh vendor` 从 Runno 复制已有运行时，并按 `scripts/sources.lock.json` 为当前系统下载工具链、编译 Lua 与 Go（Linux 与 macOS 的 x86_64 / arm64，macOS 自带 bash 3.2 即可）：

```bash
git clone https://github.com/linkxzhou/SimpleCode && cd SimpleCode
git clone --depth 1 https://github.com/taybenlor/runno thirdparty/runno   # 提供 langs/*.wasm
./build.sh install   # yarn install
./build.sh vendor    # Runno langs + 构建 Lua/Go → wasm/ + manifest.json
./build.sh dev       # http://localhost:5173
./build.sh build     # dist/
./build.sh preview   # http://localhost:4173（带 COOP/COEP）
./build.sh test      # 无头冒烟测试（9 种语言）
```

部署时服务器必须返回 `Cross-Origin-Opener-Policy: same-origin` 与 `Cross-Origin-Embedder-Policy: require-corp`，并以 `application/wasm` 提供 `.wasm`。设计文档见 [plan/DESIGN.md](plan/DESIGN.md)，语言方案见 [plan/LANGUAGES.md](plan/LANGUAGES.md)。

Lua 5.4.9 用 wasi-sdk 33 从源码编译，`pcall` / `error` 可用（依赖浏览器的 Wasm 异常处理）。Go 是 Yaegi 0.16.1 解释器（`GOOS=wasip1`），只解释标准库，不能 `go get` 第三方模块。限制见 plan/LANGUAGES.md §8。

第三方许可证：Runno（MIT）；Lua（MIT）；Yaegi（Apache-2.0）与 Go 标准库（BSD-3-Clause）；以及 CPython PSF、Ruby、PHP License、LLVM Apache-2.0、SQLite Public Domain、wasmedge-quickjs Apache-2.0。汇总在 [LICENSES/THIRD_PARTY.md](LICENSES/THIRD_PARTY.md)。
