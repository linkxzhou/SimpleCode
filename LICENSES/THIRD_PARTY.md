# Third-party licenses

SimpleCode vendors language runtimes into `wasm/` (not committed; see `./build.sh vendor`). The notices below cover those runtimes and the toolchains used to build Lua, Go, and Shell. License texts are the upstream notices; they are included so a deployment can ship them with the binaries.

## Application

- [Runno](https://github.com/taybenlor/runno) `@runno/wasi` — MIT. Provides the in-browser WASI preview1 host.
- UI dependencies (Vue, Monaco, xterm, Tailwind, shadcn-vue / reka-ui) — see each package's license in `node_modules`.
- [Sucrase](https://github.com/alangpierce/sucrase) — MIT. Loaded in the browser only when TypeScript is run, to strip types before QuickJS. It does not type-check.

## Runtimes copied from Runno `langs/`

| Runtime | License |
|---|---|
| CPython 3.11.3 (VMware WebAssembly Language Runtimes) | PSF License |
| Ruby 3.2.0 | Ruby License / BSD-2-Clause |
| PHP 8.2.0 cgi | PHP License 3.01 |
| wasmedge-quickjs | Apache-2.0 (QuickJS itself is MIT) |
| SQLite 3 | Public Domain |
| clang / wasm-ld (binji wasm-clang, LLVM 8) | Apache-2.0 with LLVM exceptions |

## Lua 5.4.9

Built from https://www.lua.org/ftp/lua-5.4.9.tar.gz with wasi-sdk 33. Lua is MIT:

```
Copyright (C) 1994-2026 Lua.org, PUC-Rio.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

wasi-sdk / LLVM is Apache-2.0 with LLVM exceptions. wasi-libc is a mix of MIT, BSD, and Apache-2.0 (see the wasi-sdk sysroot). The Wasm binary links `libc`, `libsetjmp`, `libwasi-emulated-signal`, and `libwasi-emulated-process-clocks` from that sysroot.

## Go (Yaegi 0.16.1 on Go 1.22.12)

- [Yaegi](https://github.com/traefik/yaegi) v0.16.1 — Apache-2.0. Copyright Traefik Labs and contributors.
- The wasm binary also contains the Go 1.22.12 runtime and standard library, which are BSD-3-Clause:

```
Copyright (c) 2009 The Go Authors. All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

   * Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
   * Redistributions in binary form must reproduce the above
copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the
distribution.
   * Neither the name of Google Inc. nor the names of its
contributors may be used to endorse or promote products derived from
this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

Source for the small WASI wrapper is `scripts/builders/go/main.go` in this repository.

## Shell (wasi-sh)

`wasi-sh.wasm` is compiled from `scripts/builders/shell/wasi-sh.c` in this repository with wasi-sdk 33. It is a small single-process shell (builtins and in-memory pipes only). It is not GNU bash and not BusyBox.

The shell source is MIT:

```
Copyright (c) 2026 SimpleCode contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

The binary links wasi-libc from wasi-sdk (MIT, BSD, and Apache-2.0; see the wasi-sdk sysroot). Public bash and BusyBox wasm builds were not vendored: they need host imports this runtime does not provide, and their licenses are GPL (see plan/LANGUAGES.md §9.1).

## Linux guest (v86 + Buildroot image)

The sidebar language Linux is not a WASI module. `./build.sh vendor` downloads pinned files and writes `wasm/linux-state.bin`.

- [v86](https://github.com/copy/v86) 0.5.471 (`libv86.mjs`, `v86.wasm`) — BSD-2-Clause. Copyright (c) 2012, The v86 contributors. The full notice is `LICENSES/v86-BSD-2-Clause.txt`. The npm package also bundles Berkeley SoftFloat and other pieces listed in the upstream README; those stay inside the vendored `libv86` build.
- SeaBIOS and the VGA BIOS (`seabios.bin`, `vgabios.bin`) come from the v86 `bios/` directory. SeaBIOS is LGPL-2.1 (`COPYING.LESSER` in the SeaBIOS sources). The files are pinned by sha256 because the npm tarball does not include them.
- Guest kernel: Linux **6.8.12** i686, GPL-2.0. The bzImage is the unmodified v86 demo file `https://i.copy.sh/buildroot-bzimage68.bin` (profile “Buildroot Linux 6.8”), not a Buildroot 2026.08 tree built in this repository.
- Guest userspace: Buildroot **2024.05.2** (`/etc/os-release`) and BusyBox **1.36.1** (GPL-2.0). BusyBox source for that version: https://busybox.net/downloads/busybox-1.36.1.tar.bz2 . Buildroot 2024.05.2: https://buildroot.org/downloads/buildroot-2024.05.2.tar.gz . The image is prebuilt; `scripts/builders/linux/rebuild.sh` documents a Linux or Docker fetch of Buildroot 2026.08 and is not what `./build.sh vendor` runs. A from-scratch image would not match the pinned digest.
- 9p on this image is mounted at `/mnt` (tag `host9p`), not `/mnt/host`.
