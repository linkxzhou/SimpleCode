---
language: rust
chapter: 2
title: "Rust Cargo"
level: beginner
minutes: 8
goals:
  - "知道 Cargo 不在浏览器里"
  - "用 const 代替包名"
  - "仍从 main 进入"
sources:
  - runoob-rust
updated: "2026-10-16"
---
Cargo 负责建目录、拉依赖和选目标。这个练习场没有它，依赖写不进来。

### 包名写成常量

桌面项目会把名字放进 Cargo.toml。这里用一个常量表达同一个意思。

```rust run expect="nightwin" title="常量包名"
fn main() {
    const CRATE: &str = "nightwin";
    println!("{CRATE}");
}
```
终端打出夜窗。

### 入口仍是 main

没有 `src/main.rs` 的目录树。函数 `main` 就是入口。

```rust run expect="entry at main" title="入口函数"
fn main() {
    println!("entry at main");
}
```
这行字就是程序开始后的第一句输出。

### 构建命令不执行

`cargo build` 会去找本机工具链。阅读即可。

```rust norun title="不运行 cargo"
fn main() {
    println!("cargo build");
}
```
