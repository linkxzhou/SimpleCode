# SimpleCode

纯浏览器内运行代码：Python · Ruby · QuickJS · SQLite · C · C++ · PHP（WebAssembly / WASI，基于 [Runno](https://github.com/taybenlor/runno) 的 `@runno/wasi`）。

```bash
./build.sh install   # yarn install
./build.sh vendor    # thirdparty/runno/langs → wasm/ + manifest.json
./build.sh dev       # http://localhost:5173
./build.sh build     # dist/
./build.sh preview   # http://localhost:4173（带 COOP/COEP）
./build.sh test      # 无头冒烟测试
```

部署时服务器必须返回 `Cross-Origin-Opener-Policy: same-origin` 与 `Cross-Origin-Embedder-Policy: require-corp`，并以 `application/wasm` 提供 `.wasm`。设计文档见 [plan/DESIGN.md](plan/DESIGN.md)。

第三方许可证：Runno（MIT）；各语言运行时有各自许可证（CPython PSF、Ruby、PHP License、LLVM Apache-2.0、SQLite Public Domain、wasmedge-quickjs Apache-2.0），见 plan/DESIGN.md §14。
