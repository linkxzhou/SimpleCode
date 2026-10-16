---
language: rust
chapter: 9
title: "Rust 条件"
level: beginner
minutes: 8
goals:
  - "用 if 选择一句"
  - "用 else 接另一句"
  - "把 if 当成表达式"
sources:
  - runoob-rust
updated: "2026-10-16"
---
`if` 的条件是布尔值。花括号里是各自的分支。

### 只在付清时打印

条件为假时，花括号里的语句跳过。

```rust run expect="付清" title="刚好付清"
fn main() {
    let paid = 42;
    if paid == 42 {
        println!("付清");
    }
}
```
相等才会看到付清。

### 否则走另一支

`else` 接住剩下的情况。

```rust run expect="还差" title="钱不够"
fn main() {
    let paid = 10;
    if paid == 42 {
        println!("付清");
    } else {
        println!("还差");
    }
}
```
10 不等于 42，所以走 else。

### 用分支产生值

两个分支的类型要一致，结果可以绑到名字上。

```rust run expect="夜班" title="按钟点选班"
fn main() {
    let hour = 23;
    let shift = if hour >= 18 { "夜班" } else { "日班" };
    println!("{shift}");
}
```
23 点落在夜班。
