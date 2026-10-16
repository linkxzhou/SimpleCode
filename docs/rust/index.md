---
language: rust
chapter: 0
title: "Rust 教程"
minutes: 8
goals:
  - "用 println 打出一行"
  - "用 Vec 把三个数加起来"
  - "知道这里没有 Cargo"
sources:
  - runoob-rust
updated: "2026-10-16"
---
这一本只编译一个 main.rs。编译器是浏览器里的 weblings rustc，目标是 wasm32-wasip1。

### 先打出船票

`println!` 在末尾加换行。花括号里的数会按顺序填进去。

```rust run expect="船票" title="窗口那一行"
fn main() {
    println!("窗口打出{}", "船票");
}
```
终端里会出现船票。

### 三个数相加

`vec!` 做出一块可增长的列表。`iter` 再把元素加总，类型要写明。

```rust run expect="42" title="三张票价"
fn main() {
    let fares = vec![4, 15, 23];
    let total: i32 = fares.iter().sum();
    println!("{total}");
}
```
相加的结果是 42。

### 不写 Cargo

这里没有项目清单，也下载不了 crates.io。下面这行命令不会执行。

```rust norun title="没有 cargo"
fn main() {
    println!("cargo new 不会在这里跑");
}
```
