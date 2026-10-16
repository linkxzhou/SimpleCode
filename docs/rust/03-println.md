---
language: rust
chapter: 3
title: "Rust 输出"
level: beginner
minutes: 8
goals:
  - "用 println 换行"
  - "用 print 把两段接在一行"
  - "用 format 先做成字符串"
sources:
  - runoob-rust
updated: "2026-10-16"
---
输出宏把值写到标准输出。想看结果，就在宏里留一个占位。

### 带换行的一句

花括号和后面的参数一一对应。

```rust run expect="fare42" title="票价"
fn main() {
    println!("fare{}", 42);
}
```
行尾已经换过行。

### 同一行接上后半句

`print!` 不换行，下一句 `println!` 才收尾。

```rust run expect="copperkey" title="接成一把钥匙"
fn main() {
    print!("copper");
    println!("key");
}
```
两段宏合成 `copperkey`。

### 先格式化再打印

`format!` 返回字符串，不立刻写到终端。

```rust run expect="7 window" title="先做成字符串"
fn main() {
    let line = format!("{} window", 7);
    println!("{line}");
}
```
打印的是那条已经拼好的字符串。
