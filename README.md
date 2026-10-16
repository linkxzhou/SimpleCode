# SimpleCode

纯浏览器内运行代码：Python · Ruby · JS/TS · SQLite · C · C++ · PHP · Lua · Go · Shell · Rust · Java · Linux。前十门是 WebAssembly / WASI（基于 [Runno](https://github.com/taybenlor/runno) 的 `@runno/wasi`）。Rust 的编译器是 [weblings](https://github.com/AngelOnFira/weblings) 的 Cranelift rustc，不在默认 `./build.sh vendor` 里；选中 Rust 时再下载约 152 MB，或事先运行 `./build.sh vendor --rust`。Java 是 [TeaVM](https://github.com/konsoletyper/teavm) 的浏览器 javac，同样不在默认 vendor 里；选中 Java 时从同源 `wasm/java/` 下载约 6.6 MB，事先运行 `./build.sh vendor --java`。Linux 是 v86 里的 BusyBox 客户机，随默认 vendor 下载。

## 快速开始

语言运行时（`.wasm` / `.tar.gz`，约 158 MB）和 `wasm/manifest.json` **都不随仓库提交**。`manifest.json` 在 `vendor`、`dev` 和 `build` 时按当前目录里的文件重算 `size` / `sha256`。Apple Silicon 上编出的 Lua 与 Linux 参考体积可能差几百字节；运行时只对照这份刚生成的清单，所以 `git pull` 不会再把另一台机器的摘要盖回来。`./build.sh vendor` 从 Runno 复制已有运行时，并按 `scripts/sources.lock.json` 为当前系统下载工具链、编译 Lua、Go 与 Shell（Linux 与 macOS 的 x86_64 / arm64，macOS 自带 bash 3.2 即可）：

```bash
git clone https://github.com/linkxzhou/SimpleCode && cd SimpleCode
git clone --depth 1 https://github.com/taybenlor/runno thirdparty/runno   # 提供 langs/*.wasm
./build.sh install   # yarn install
./build.sh vendor    # Runno langs + Lua/Go/Shell + Linux 客户机 → wasm/，并按磁盘上的文件写 manifest.json
./build.sh dev       # http://localhost:5173
./build.sh build     # dist/
./build.sh preview   # http://localhost:4173（带 COOP/COEP）
./build.sh vendor --java   # 可选：把钉住的 TeaVM 文件放到 wasm/java/（teavm.org 没有 CORS）
./build.sh test      # 无头冒烟测试（含 Linux；JS 与 TS 各一例；Rust 需 wasm/rust 或可访问的演示地址；Java 需 wasm/java）
```

`./build.sh build` 在 `wasm/java/compiler.wasm` 不存在时打印警告，构建照常完成。开发服务器和 preview 对缺失的 `/wasm/**` 返回 404（`Cache-Control: no-store`），不回退首页；存在的 `/wasm/**` 用 `Cache-Control: no-cache` 送出，避免空正文被缓存成 “0 kB transferred”。若浏览器曾把首页或空响应缓存成 `compiler.wasm`，刷新后按 `?v=` 重新拉取，空的或变短的正文会再试一次。仍失败时终端写明得到和期望的字节数；文件缺失则提示 `./build.sh vendor --java`，页面来自 dist 时再提示 `./build.sh build`。

`./build.sh dev` 和 `./build.sh preview` 由 Vite 返回 `Cross-Origin-Opener-Policy: same-origin` 与 `Cross-Origin-Embedder-Policy: require-corp`。没有这两项头的静态站点也可以打开 `dist/`：页面在启动前注册同源的 `coi-serviceworker.js`，需要时刷新一次，自己补上同样的头。`file://` 和隐私模式没有 Service Worker，仍会看到隔离说明。

```bash
./build.sh build
python3 -m http.server 4173 -d dist   # http://localhost:4173
```

部署在子目录时，把 Vite 的 `base` 设成该路径。Service Worker 的地址和 `wasm/` 都相对 `base`。`.wasm` 仍以 `application/wasm` 提供。设计文档见 [plan/DESIGN.md](plan/DESIGN.md)，语言方案见 [plan/LANGUAGES.md](plan/LANGUAGES.md)。

侧栏里的 **JS/TS** 仍使用同一份 wasmedge-quickjs（只执行 JavaScript）。工具栏可在 JS 与 TS 之间切换：Monaco 分别用 `javascript` / `typescript` 高亮，两份示例和草稿分开保存，选择记在本机。运行 TypeScript 时，浏览器才懒加载 [Sucrase](https://github.com/alangpierce/sucrase)，把类型标注和 `interface` 剥掉后再交给 QuickJS。这不是完整类型检查。转译失败时错误写在终端，不会启动 wasm。

Lua 5.4.9 用 wasi-sdk 33 从源码编译，`pcall` / `error` 可用（依赖浏览器的 Wasm 异常处理）。Go 是 Yaegi 0.16.1 解释器（`GOOS=wasip1`），只解释标准库，不能 `go get` 第三方模块。Shell 是同一套工具链编出的 `wasi-sh`（MIT）：`echo` / `printf` / `read` / `cat` / `test`、`if` / `while` / `for`，以及内建命令之间的管道和重定向。没有 `fork`，所以 `ls` 这类外部命令会失败。限制见 plan/LANGUAGES.md §8。

第三方许可证：Runno（MIT）；Sucrase（MIT，仅浏览器内 TypeScript 去类型）；Lua（MIT）；wasi-sh（MIT）；Yaegi（Apache-2.0）与 Go 标准库（BSD-3-Clause）；TeaVM（Apache-2.0），其中 `compiler.wasm` 里的 javac 是 GPLv2 + Classpath Exception；以及 CPython PSF、Ruby、PHP License、LLVM Apache-2.0、SQLite Public Domain、wasmedge-quickjs Apache-2.0。汇总在 [LICENSES/THIRD_PARTY.md](LICENSES/THIRD_PARTY.md)。
