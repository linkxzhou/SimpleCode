# Vendored weblings Rust toolchain

These two files are committed so the page loads them from the same origin.
They are not entries in `wasm/manifest.json`. The browser does not fetch
`https://weblings.forest-anderson.ca`.

`./build.sh vendor --rust` skips when the bytes already match
`scripts/sources.lock.json`. `./build.sh vendor --rust --refresh` downloads
the pinned GitHub Release archives again, checks sha256, and overwrites
these files. That refresh does not contact the demo host.

## rustc.wasm

- bytes: 87871387
- sha256: `41412081eefc3e08ec5664ed0748902a7e575e1f267898dcc64d412702df7e83`
- archive: https://github.com/AngelOnFira/wasm-rustc/releases/download/artifacts-test-7/rustc-wasm.tar.zst
- archive sha256: `a96f6d53afff3c95d6387def27f6ddb53a02575679dc6c981d60797c32dcd022`
- unpacked mirror (not used at runtime): https://weblings.forest-anderson.ca/rustc/rustc.wasm
- license: rustc and Cranelift are MIT OR Apache-2.0. The weblings worker glue is MIT.
- attribution: AngelOnFira/weblings and AngelOnFira/wasm-rustc, tag `artifacts-test-7`

## sysroot-wasip1.bundle

- bytes: 71313335
- sha256: `6dba13d6077cb7936ed6661cd1087bc9e92dc1d8b35903ecf22881c97ac3980b`
- archive: https://github.com/AngelOnFira/wasm-rustc/releases/download/artifacts-test-7/wasip1-sysroot.tar.zst
- archive sha256: `4eedff7b0cd4330bfe226734b67751a97fac5572ac55392e93f9d3e4886a277d`
- unpacked mirror (not used at runtime): https://weblings.forest-anderson.ca/rustc/sysroot-wasip1.bundle
- license: MIT OR Apache-2.0, same as the rustc sysroot in that release
- magic: `RIWB1` (not gzip, so it is not a manifest filesystem asset)
