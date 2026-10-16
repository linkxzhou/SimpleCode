---
language: rust
chapter: 24
title: "Rust 并发"
level: advanced
minutes: 8
goals:
  - "顺序调用两段工作"
  - "用向量当信箱传递"
  - "知道线程起不来"
sources:
  - runoob-rust
updated: "2026-10-16"
---
宿主没有 wasi 线程。`thread::spawn` 和 `sleep` 不要放进可运行块，后者会卡在时钟等待上。

### 先算再加

两段纯函数按书写顺序执行，效果像把两份结果汇合。

```rust run expect="42" title="顺序汇合"
fn left() -> i32 {
    19
}

fn right() -> i32 {
    23
}

fn main() {
    println!("{}", left() + right());
}
```
没有第二条线程，和仍然是 42。

### 向量当信箱

一个任务往向量里放数，后面的代码再取出来。这是同一个调用栈。

```rust run expect="42" title="信箱里的数"
fn main() {
    let mut boxy = Vec::new();
    boxy.push(42);
    println!("{}", boxy[0]);
}
```
取到的就是放进去的 42。

### 线程语法只供阅读

下面的程序在这里编不过，或者即使编过也不能真正并行。

```rust norun title="不起线程"
fn main() {
    println!("nope spawn");
}
```
